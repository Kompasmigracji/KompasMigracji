/* Innovation 7: AI Document Generator
   F19: Auto fill {{vars}} from lead/member data
   F20: Auto generate unique doc number KM-YYYY-NNNN
   F21: Save history + return HTML for download */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// F20: Generate unique KM-YYYY-NNNN number
async function nextDocNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const row = await one("SELECT nextval('kompas_doc_seq') AS n");
  const n = String(row?.n || 1).padStart(4, "0");
  return `KM-${year}-${n}`;
}

// F19: Replace {{var}} placeholders with actual data
function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { templateSlug?: unknown; leadId?: unknown; memberId?: unknown; extraVars?: unknown } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const templateSlug = String(body.templateSlug || "");
  if (!templateSlug) return NextResponse.json({ error: "templateSlug required" }, { status: 400 });

  const template = await one(
    "SELECT body, title FROM message_templates WHERE slug=$1",
    [templateSlug],
  );
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  // Build vars from lead or member
  const vars: Record<string, string> = {
    date: new Date().toLocaleDateString("uk-UA"),
    company: "Kompas Migracji",
    phone: "+48 729 271 848",
    website: process.env.NEXT_PUBLIC_APP_URL || "https://kompasmigracji.com",
    ...(body.extraVars && typeof body.extraVars === "object"
      ? body.extraVars as Record<string, string>
      : {}),
  };

  if (body.leadId) {
    const lead = await one(
      "SELECT first_name, contact, service, situation, urgency FROM leads WHERE id=$1 AND deleted_at IS NULL",
      [Number(body.leadId)],
    );
    if (lead) {
      vars.name = lead.first_name || "Клієнт";
      vars.contact = lead.contact || "";
      vars.service = lead.service || "";
      vars.situation = lead.situation || "";
      vars.urgency = lead.urgency || "";
    }
  }

  if (body.memberId) {
    const member = await one(
      "SELECT full_name, email, phone, mp.member_no, mp.city, mp.category FROM kompas_users u LEFT JOIN kompas_member_profiles mp ON mp.user_id=u.id WHERE u.id=$1",
      [Number(body.memberId)],
    );
    if (member) {
      vars.name = member.full_name || "Учасник";
      vars.email = member.email || "";
      vars.memberPhone = member.phone || "";
      vars.memberNo = member.member_no || "";
      vars.city = member.city || "";
      vars.category = member.category || "";
    }
  }

  // F19: Fill template
  const filledHtml = fillTemplate(String(template.body), vars);

  // F20: Generate unique number
  const docNumber = await nextDocNumber();

  const userId = auth.user?.sub ?? null;

  // F21: Save to history
  await one(
    `INSERT INTO kompas_generated_docs
       (doc_number, template_slug, lead_id, member_id, body_html, vars_json, generated_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      docNumber,
      templateSlug,
      body.leadId ? Number(body.leadId) : null,
      body.memberId ? Number(body.memberId) : null,
      filledHtml,
      JSON.stringify(vars),
      userId || null,
    ],
  );

  return NextResponse.json({
    docNumber,
    title: template.title,
    html: filledHtml,
    vars,
  });
}

export async function GET() {
  const auth = await requireAuth(["admin", "moderator"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const docs = await q(`
    SELECT gd.id, gd.doc_number, gd.template_slug, gd.lead_id, gd.member_id,
           gd.created_at, u.full_name AS generated_by_name
    FROM kompas_generated_docs gd
    LEFT JOIN kompas_users u ON u.id = gd.generated_by
    ORDER BY gd.created_at DESC LIMIT 50`);

  return NextResponse.json({ docs });
}

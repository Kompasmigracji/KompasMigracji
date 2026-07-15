import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(["member"]);
    if (auth.error || !auth.user) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });

    const dbCases = await q(
      'SELECT * FROM kompas_legal_cases_v2 WHERE user_id = $1 ORDER BY created_at DESC',
      [auth.user.sub],
    );

    // Map DB cases to UI format
    const mappedCases = dbCases.map((c: any) => {
      const submissionDate = c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : null;
      return {
        id: c.id,
        case_type: c.case_type,
        status: c.status,
        submission_date: submissionDate,
        expected_decision_date: c.deadline ? new Date(c.deadline).toISOString().split('T')[0] : null,
        urgency_level: "Normal",
        progress: c.status === 'blocked' ? 30 : 60,
        steps: [
          { id: "step-1", step_name: "Złożenie wniosku", step_status: "Completed", step_date: submissionDate },
          { id: "step-2", step_name: c.current_stage || "Odciski palców", step_status: c.status === 'blocked' ? "Pending" : "In Progress", step_date: null }
        ],
        missing_documents: c.status === 'blocked' ? [c.notes] : [],
        ai_warning: c.status === 'blocked' ? "Справа призупинена. Будь ласка, зверніть увагу на відсутні документи." : null
      };
    });

    return NextResponse.json({ cases: mappedCases }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching legal cases:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

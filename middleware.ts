/* middleware.ts — KompasCRM + next-intl.
   • /admin/* и /api/admin/* — защита JWT (кроме /admin/login и /api/admin/auth/*)
   • Все остальные маршруты — next-intl локализация.
*/
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";

const COOKIE = "kompascrm_session";

/** Видаляє BOM (U+FEFF, charCode 65279) та \r — захист від PowerShell pipe артефактів. */
function cleanEnv(s: string | undefined): string {
  let r = s || "";
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join("").trim();
}

const SECRET = new TextEncoder().encode(
  cleanEnv(process.env.JWT_SECRET) || "dev-secret-change-me-in-production"
);

const intlMiddleware = createMiddleware({
  locales: ["uk", "pl", "en", "ru"],
  defaultLocale: "uk",
  localePrefix: "always",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Non-admin API routes: pass through unchanged ──────────────────────────
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // ── Strip locale prefix from admin routes: /uk/admin → /admin ────────────
  // Prevents 404 when a user navigates to /uk/admin (locale-prefixed URL)
  const localeAdminMatch = pathname.match(/^\/(uk|pl|en|ru)(\/admin.*)$/);
  if (localeAdminMatch) {
    const url = req.nextUrl.clone();
    url.pathname = localeAdminMatch[2];
    return NextResponse.redirect(url);
  }

  // ── Admin pages + admin API: JWT protection ───────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Login page and auth endpoints are public
    if (
      pathname === "/admin/login" ||
      pathname.startsWith("/api/admin/auth/")
    ) {
      return NextResponse.next();
    }

    // Verify JWT
    const token = req.cookies.get(COOKIE)?.value;
    let payload: { role?: string } | null = null;
    if (token) {
      try {
        payload = (await jwtVerify(token, SECRET)).payload as { role?: string };
      } catch {
        payload = null;
      }
    }

    // Not authenticated
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Member role: only /admin/me and own /api/admin/members/:id
    if (
      payload.role === "member" &&
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/me")
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/me";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // ── Public routes: next-intl localization ─────────────────────────────────
  return intlMiddleware(req);
}

export const config = {
  // Include API routes (needed to protect /api/admin/*), exclude static assets
  matcher: ["/((?!_next|_vercel|favicon\\.ico|.*\\..*).*)"],
};

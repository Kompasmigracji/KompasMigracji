/* middleware.ts — KompasCRM + next-intl.
   • /admin/* и /api/admin/* — защита JWT (кроме /admin/login и /api/admin/auth/*)
   • Все остальные маршруты — next-intl локализация.
*/
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";

const COOKIE = "kompascrm_session";
const rateLimitMap = new Map();

function rateLimit(ip: string, isAuth: boolean) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxReqs = isAuth ? 20 : 100;
  const key = `${ip}_${isAuth ? 'auth' : 'api'}`;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const record = rateLimitMap.get(key);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }
  
  record.count += 1;
  return record.count <= maxReqs;
}

/** Видаляє BOM (U+FEFF, charCode 65279) та \r — захист від PowerShell pipe артефактів. */
function cleanEnv(s: string | undefined): string {
  let r = s || "";
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join("").trim();
}

const jwtSecret = cleanEnv(process.env.JWT_SECRET);
if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET env var is not configured");
}
const SECRET = new TextEncoder().encode(jwtSecret || "dev-secret-change-me-in-production");

const intlMiddleware = createMiddleware({
  locales: ["uk", "pl", "en", "ru", "rom"],
  defaultLocale: "pl",
  localePrefix: "always",
  localeDetection: true,
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Request Logging ─────────────────────────────────────────────────────────
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // ── CSRF Protection for mutations ───────────────────────────────────────────
  if (req.method !== "GET" && req.method !== "OPTIONS" && req.method !== "HEAD") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return NextResponse.json({ error: "CSRF check failed." }, { status: 403 });
      }
    }
  }

  // ── Rate Limiting ───────────────────────────────────────────────────────────
  const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
  if (pathname.startsWith("/api/")) {
    const isAuth = pathname.startsWith("/api/admin/auth/");
    if (!rateLimit(ip, isAuth)) {
      return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 });
    }
  }

  // ── Non-admin API routes: pass through unchanged ──────────────────────────
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin")) {
    const res = NextResponse.next();
    res.headers.set("X-Content-Type-Options", "nosniff");
    return res;
  }

  // ── Strip locale prefix from admin routes: /uk/admin → /admin ────────────
  // Prevents 404 when a user navigates to /uk/admin (locale-prefixed URL)
  const localeAdminMatch = pathname.match(/^\/(uk|pl|en|ru|rom)(\/admin.*)$/);
  if (localeAdminMatch) {
    const url = req.nextUrl.clone();
    url.pathname = localeAdminMatch[2];
    return NextResponse.redirect(url);
  }

  // ── Strip locale prefix from payment routes: /uk/payment → /payment ───────
  // Payment pages live in app/payment/ (not in app/[locale]/), so they must
  // be accessed WITHOUT a locale prefix.
  const localePaymentMatch = pathname.match(/^\/(uk|pl|en|ru|rom)(\/payment\/.*)$/);
  if (localePaymentMatch) {
    const url = req.nextUrl.clone();
    url.pathname = localePaymentMatch[2];
    return NextResponse.redirect(url, 301);
  }

  // ── Payment pages: skip intl middleware (no locale prefix needed) ─────────
  if (pathname.startsWith("/payment/")) {
    return NextResponse.next();
  }

  // ── Strip locale prefix from portal routes: /uk/portal → /portal ─────────
  // Portal lives in app/portal/ (not in app/[locale]/), no locale prefix needed.
  const localePortalMatch = pathname.match(/^\/(uk|pl|en|ru|rom)(\/portal.*)$/);
  if (localePortalMatch) {
    const url = req.nextUrl.clone();
    url.pathname = localePortalMatch[2];
    return NextResponse.redirect(url, 301);
  }

  // ── Portal pages: skip intl middleware ───────────────────────────────────
  if (pathname.startsWith("/portal")) {
    return NextResponse.next();
  }

  // ── Strip locale prefix from architect routes: /uk/architect → /architect ──
  const localeArchitectMatch = pathname.match(/^\/(uk|pl|en|ru|rom)(\/architect.*)$/);
  if (localeArchitectMatch) {
    const url = req.nextUrl.clone();
    url.pathname = localeArchitectMatch[2];
    return NextResponse.redirect(url, 301);
  }

  // ── Architect pages: skip intl middleware ────────────────────────────────
  if (pathname.startsWith("/architect")) {
    // Architect pages must be protected. We will let the JWT check handle it,
    // so we don't return next() here, but we let it fall through to the auth check below.
    // Actually, wait, if we fall through to auth check, we need to add /architect to the auth check!
  }

  // ── Admin & Architect pages + admin API: JWT protection ─────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname.startsWith("/architect")) {
    // Login page, setup page and auth endpoints are public
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/setup" ||
      pathname.startsWith("/api/admin/auth/") ||
      pathname.startsWith("/api/admin/setup")
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

    // Architect requires admin role
    if (pathname.startsWith("/architect") && payload.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
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

    const res = NextResponse.next();
    // Add CSRF & Security Headers to all admin pages & APIs
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return res;
  }

  // ── Public routes: next-intl localization ─────────────────────────────────
  return intlMiddleware(req);
}

export const config = {
  // Include API routes (needed to protect /api/admin/*), exclude static assets
  matcher: ["/((?!_next|_vercel|favicon\\.ico|.*\\..*).*)"],
};

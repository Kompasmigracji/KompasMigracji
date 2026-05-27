/* KompasCRM — middleware. Защищает /admin/*.
   Кладётся в КОРЕНЬ проекта (рядом с app/) или в src/ если используешь src-каталог.
   Если у тебя уже есть middleware.js — слей логику вручную. */
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-in-production"
);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // страница входа доступна всем
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("kompascrm_session")?.value;
  let payload = null;
  if (token) {
    try {
      payload = (await jwtVerify(token, SECRET)).payload;
    } catch {
      payload = null;
    }
  }

  // не залогинен → на страницу входа
  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // участник профсоюза имеет доступ только к своему кабинету
  if (payload.role === "member" && !pathname.startsWith("/admin/me")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/me";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

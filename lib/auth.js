/* KompasCRM — авторизация: JWT в httpOnly-cookie, bcrypt, проверки доступа. */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const COOKIE = "kompascrm_session";

/** Видаляє BOM (U+FEFF) та \r з початку рядка. */
function cleanEnv(s) {
  let r = (s || "");
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  return r.split(String.fromCharCode(13)).join("").trim();
}

const jwtSecret = cleanEnv(process.env.JWT_SECRET);
if (!jwtSecret && process.env.NODE_ENV === "production") {
  console.warn("WARNING: JWT_SECRET env var is not configured. Falling back to dev secret.");
}
const SECRET = new TextEncoder().encode(jwtSecret || "dev-secret-change-me-in-production");

/* ---- пароли ---- */
export function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}
export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/* ---- токены ---- */
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}
export async function signTempToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(SECRET);
}
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

/* ---- текущий пользователь из cookie ---- */
export async function currentUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/* ---- защита API-роутов ----
   Использование в route.js:
     const auth = await requireAuth(["admin","moderator"]);
     if (auth.error) return Response.json({ error: auth.error }, { status: auth.status }); */
export async function requireAuth(roles) {
  const user = await currentUser();
  if (!user) return { error: "Требуется вход", status: 401 };
  if (roles && roles.length && !roles.includes(user.role)) {
    return { error: "Недостаточно прав", status: 403 };
  }
  return { user };
}

/* Случайный временный пароль для новых участников. */
export function tempPassword() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

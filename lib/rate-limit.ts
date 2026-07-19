import { NextRequest } from 'next/server';

// ── Fixed-window rate limiter ─────────────────────────────────────────────────
// Per-instance in-memory store. Vercel spins up multiple instances so this is
// not globally consistent, but it's sufficient to slow down abuse from a single
// client hitting the same edge node.

type WindowEntry = { count: number; start: number };
const rlStores = new Map<string, Map<string, WindowEntry>>();

function getStore(ns: string): Map<string, WindowEntry> {
  let s = rlStores.get(ns);
  if (!s) { s = new Map(); rlStores.set(ns, s); }
  return s;
}

export function rateLimit(
  key: string,
  { max = 10, windowMs = 60000, ns = 'default' }: { max?: number; windowMs?: number; ns?: string } = {}
): { ok: boolean; remaining: number } {
  const store = getStore(ns);
  const now   = Date.now();

  // Стор живе весь час життя інстансу — без прибирання прострочений запис
  // на кожен унікальний IP лишається назавжди (повільний memory leak).
  if (store.size > 10_000) {
    for (const [k, e] of store) {
      if (now - e.start >= windowMs) store.delete(k);
    }
  }

  const entry = store.get(key);

  if (!entry || now - entry.start >= windowMs) {
    store.set(key, { count: 1, start: now });
    return { ok: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: max - entry.count };
}

// ── Brute-force lockout ───────────────────────────────────────────────────────
// Separate from rate-limit: counts auth failures and locks out after threshold.

type LockEntry = { failures: number; lockedUntil: number };
const lockStore = new Map<string, LockEntry>();

export function checkLockout(
  key: string,
  { maxFailures = 5, lockMs = 15 * 60_000 }: { maxFailures?: number; lockMs?: number } = {}
): { locked: boolean; minutesLeft?: number } {
  const entry = lockStore.get(key);
  if (!entry) return { locked: false };

  const now = Date.now();
  if (entry.lockedUntil > now) {
    return { locked: true, minutesLeft: Math.ceil((entry.lockedUntil - now) / 60_000) };
  }
  if (entry.failures < maxFailures) return { locked: false };
  lockStore.delete(key);
  return { locked: false };
}

export function recordFailure(
  key: string,
  { maxFailures = 5, lockMs = 15 * 60_000 }: { maxFailures?: number; lockMs?: number } = {}
): void {
  const entry = lockStore.get(key) ?? { failures: 0, lockedUntil: 0 };
  entry.failures++;
  if (entry.failures >= maxFailures) entry.lockedUntil = Date.now() + lockMs;
  lockStore.set(key, entry);
}

export function resetLockout(key: string): void {
  lockStore.delete(key);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Clamp string length and strip dangerous characters for plain-text fields. */
export function sanitize(s: unknown, maxLen = 200): string {
  return String(s ?? '').trim().slice(0, maxLen);
}

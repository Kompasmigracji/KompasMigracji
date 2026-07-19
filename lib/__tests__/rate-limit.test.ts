import { rateLimit, checkLockout, recordFailure, resetLockout, clientIp, sanitize } from '../rate-limit';

function fakeReq(headers: Record<string, string>) {
  return { headers: { get: (k: string) => headers[k.toLowerCase()] ?? null } } as any;
}

describe('rateLimit', () => {
  it('allows up to max requests inside the window, then blocks', () => {
    const ns = 'test-window';
    for (let i = 0; i < 3; i++) {
      expect(rateLimit('ip-1', { max: 3, windowMs: 60_000, ns }).ok).toBe(true);
    }
    expect(rateLimit('ip-1', { max: 3, windowMs: 60_000, ns }).ok).toBe(false);
  });

  it('tracks keys independently', () => {
    const ns = 'test-keys';
    expect(rateLimit('ip-a', { max: 1, ns }).ok).toBe(true);
    expect(rateLimit('ip-a', { max: 1, ns }).ok).toBe(false);
    expect(rateLimit('ip-b', { max: 1, ns }).ok).toBe(true);
  });

  it('resets after the window elapses', () => {
    const ns = 'test-reset';
    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValue(1_000_000);
    expect(rateLimit('ip-1', { max: 1, windowMs: 60_000, ns }).ok).toBe(true);
    expect(rateLimit('ip-1', { max: 1, windowMs: 60_000, ns }).ok).toBe(false);
    nowSpy.mockReturnValue(1_000_000 + 60_001);
    expect(rateLimit('ip-1', { max: 1, windowMs: 60_000, ns }).ok).toBe(true);
    nowSpy.mockRestore();
  });

  it('reports remaining count', () => {
    const ns = 'test-remaining';
    expect(rateLimit('ip-1', { max: 3, ns }).remaining).toBe(2);
    expect(rateLimit('ip-1', { max: 3, ns }).remaining).toBe(1);
    expect(rateLimit('ip-1', { max: 3, ns }).remaining).toBe(0);
  });
});

describe('lockout', () => {
  it('locks after maxFailures and unlocks after lockMs', () => {
    const key = 'user@test';
    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValue(2_000_000);
    expect(checkLockout(key).locked).toBe(false);
    for (let i = 0; i < 5; i++) recordFailure(key, { maxFailures: 5, lockMs: 15 * 60_000 });
    expect(checkLockout(key).locked).toBe(true);
    nowSpy.mockReturnValue(2_000_000 + 15 * 60_000 + 1);
    expect(checkLockout(key, { maxFailures: 5 }).locked).toBe(false);
    resetLockout(key);
    nowSpy.mockRestore();
  });
});

describe('clientIp', () => {
  it('prefers first x-forwarded-for entry', () => {
    expect(clientIp(fakeReq({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }))).toBe('1.2.3.4');
  });
  it('falls back to x-real-ip, then "unknown"', () => {
    expect(clientIp(fakeReq({ 'x-real-ip': '9.9.9.9' }))).toBe('9.9.9.9');
    expect(clientIp(fakeReq({}))).toBe('unknown');
  });
});

describe('sanitize', () => {
  it('trims and clamps length', () => {
    expect(sanitize('  hello  ')).toBe('hello');
    expect(sanitize('x'.repeat(500), 10)).toHaveLength(10);
    expect(sanitize(null)).toBe('');
  });
});

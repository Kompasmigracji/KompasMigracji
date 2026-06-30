import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit utility', () => {
  it('should return an object with ok and remaining properties', () => {
    const result = rateLimit('test-key');
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('ok');
    expect(result).toHaveProperty('remaining');
  });
});

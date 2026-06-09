import * as crypto from 'crypto';

const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32ToBuffer(base32: string): Buffer {
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  
  for (let i = 0; i < base32.length; i++) {
    const val = base32chars.indexOf(base32[i].toUpperCase());
    if (val === -1) continue;
    
    value = (value << 5) | val;
    bits += 5;
    
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function generateSecretBase32(length = 16): string {
  const randomBytes = crypto.randomBytes(length);
  let base32 = '';
  let bits = 0;
  let value = 0;
  
  for (let i = 0; i < randomBytes.length; i++) {
    value = (value << 8) | randomBytes[i];
    bits += 8;
    
    while (bits >= 5) {
      base32 += base32chars[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  
  if (bits > 0) {
    base32 += base32chars[(value << (5 - bits)) & 31];
  }
  
  return base32;
}

function generateHOTP(secretBase32: string, counter: number): string {
  const key = base32ToBuffer(secretBase32);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buffer.writeUInt32BE(counter & 0xffffffff, 4);

  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  
  return code.toString().padStart(6, '0');
}

function verifyTOTP(token: string, secretBase32: string, window = 1): boolean {
  if (!token || token.length !== 6) return false;
  
  const counter = Math.floor(Date.now() / 30000);
  
  for (let i = -window; i <= window; i++) {
    const generatedToken = generateHOTP(secretBase32, counter + i);
    if (generatedToken === token) {
      return true;
    }
  }
  return false;
}

export function generate2FASecret(email: string, issuer = 'KompasCRM') {
  const secret = generateSecretBase32(20);
  const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  return { secret, uri };
}

export function verify2FA(token: string, secret: string): boolean {
  return verifyTOTP(token, secret);
}

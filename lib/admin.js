import crypto from 'crypto';

export function adminToken() {
  return crypto
    .createHash('sha256')
    .update((process.env.ADMIN_PASSWORD || '') + (process.env.IP_SALT || ''))
    .digest('hex');
}

export function isAdmin(cookieValue) {
  if (!cookieValue) return false;
  const expected = adminToken();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieValue),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}
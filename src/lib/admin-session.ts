import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE = 'admin_session';
const SESSION_DURATION_S = 60 * 60 * 8; // 8 hours

/**
 * Secret used to sign the admin session JWT. Falls back to AUTH_SECRET so
 * existing deployments keep working, but a dedicated ADMIN_SESSION_SECRET is
 * recommended. This module is edge-safe (uses `jose`, not `crypto`/`bcrypt`)
 * so it can run in middleware.
 */
function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET (or AUTH_SECRET) must be set to sign admin sessions.'
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  email: string;
  role: 'admin';
}

/** Creates a signed JWT for an authenticated admin. */
export async function createAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_S}s`)
    .sign(getSecret());
}

/** Verifies a session token; returns the payload or null if invalid/expired. */
export async function verifyAdminToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== 'admin' || typeof payload.email !== 'string') return null;
    return { email: payload.email, role: 'admin' };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_DURATION_S;

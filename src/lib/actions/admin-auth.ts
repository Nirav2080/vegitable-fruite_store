'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { timingSafeEqual } from 'crypto';
import { createAdminToken, verifyAdminToken, ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from '@/lib/admin-session';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Constant-time string comparison to avoid leaking length/contents via timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison to keep timing roughly constant.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function adminLogin(
  data: unknown
): Promise<{ success: boolean; message: string }> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('[admin-auth] ADMIN_EMAIL / ADMIN_PASSWORD are not configured.');
    return {
      success: false,
      message: 'Admin login is not configured. Please contact the site owner.',
    };
  }

  const { email, password } = parsed.data;

  const emailMatches = safeEqual(email.toLowerCase().trim(), adminEmail.toLowerCase().trim());
  const passwordMatches = safeEqual(password, adminPassword);

  if (!emailMatches || !passwordMatches) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const token = await createAdminToken(adminEmail);

  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  return { success: true, message: 'Logged in successfully.' };
}

export async function adminLogout(): Promise<void> {
  cookies().delete(ADMIN_COOKIE);
}

/** Server-side check used by the admin layout to gate rendering. */
export async function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

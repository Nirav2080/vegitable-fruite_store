'use server';

import { z } from 'zod';
import { randomBytes } from 'crypto';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/db';
import type { User } from '@/lib/types';
import { sendEmail, buildPasswordResetEmail } from '@/lib/email';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getDb() {
  return getDatabase();
}

function getBaseUrl(): string {
  // Prefer an explicit env var (set this in production), else derive from request headers.
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:9002';
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

const forgotSchema = z.object({
  email: z.string().email(),
});

/**
 * Initiates a password reset. Always returns the same generic success response
 * regardless of whether the email exists, to avoid leaking which emails are
 * registered (account enumeration). A hashed, time-limited token is stored on
 * the user document and the plaintext token is emailed as a link.
 */
export async function requestPasswordReset(
  data: unknown
): Promise<{ success: boolean; message: string }> {
  const genericResponse = {
    success: true,
    message: "If an account exists for that email, we've sent a password reset link.",
  };

  const parsed = forgotSchema.safeParse(data);
  if (!parsed.success) {
    return genericResponse;
  }

  const { email } = parsed.data;

  const db = await getDb();
  if (!db) {
    // Don't reveal infra problems to the client; behave generically.
    console.error('[password-reset] Database not connected.');
    return genericResponse;
  }

  const usersCollection = db.collection<User>('users');
  const user = await usersCollection.findOne({ email });

  if (user) {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { resetTokenHash: tokenHash, resetTokenExpires: expiresAt } }
    );

    const resetUrl = `${getBaseUrl()}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: buildPasswordResetEmail(resetUrl, user.name || user.firstName),
    });
  }

  return genericResponse;
}

const resetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Completes a password reset. Verifies the token against the stored hash and
 * expiry, then sets the new (bcrypt-hashed) password and clears the token so it
 * can't be reused.
 */
export async function resetPassword(
  data: unknown
): Promise<{ success: boolean; message: string }> {
  const parsed = resetSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Invalid input.';
    return { success: false, message: firstError };
  }

  const { email, token, password } = parsed.data;

  const db = await getDb();
  if (!db) {
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }

  const usersCollection = db.collection<User>('users');
  const user = await usersCollection.findOne({ email });

  const invalidMsg = 'This reset link is invalid or has expired. Please request a new one.';

  if (!user || !user.resetTokenHash || !user.resetTokenExpires) {
    return { success: false, message: invalidMsg };
  }

  if (new Date(user.resetTokenExpires).getTime() < Date.now()) {
    return { success: false, message: invalidMsg };
  }

  const tokenMatches = await bcrypt.compare(token, user.resetTokenHash);
  if (!tokenMatches) {
    return { success: false, message: invalidMsg };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await usersCollection.updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
      $unset: { resetTokenHash: '', resetTokenExpires: '' },
    }
  );

  return { success: true, message: 'Your password has been reset. You can now log in.' };
}

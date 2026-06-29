import nodemailer, { type Transporter } from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
// Address the email is sent "from". Falls back to the SMTP user.
const from = process.env.EMAIL_FROM || (user ? `<${user}>` : undefined);

let transporter: Transporter | null = null;

/**
 * Lazily creates (and caches) the nodemailer SMTP transport. Returns null when
 * SMTP isn't configured so callers can fall back to logging in development.
 */
function getTransporter(): Transporter | null {
  if (!host || !user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      // Port 465 uses implicit TLS; 587/25 use STARTTLS.
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends a transactional email over SMTP via nodemailer.
 *
 * If SMTP isn't configured (SMTP_HOST/SMTP_USER/SMTP_PASS), the email is logged
 * to the server console instead of being sent, so local development still works
 * end-to-end. Never throws to the caller — failures are logged and reported via
 * the return value so callers don't leak detail to the client.
 */
export async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<{ sent: boolean }> {
  const tx = getTransporter();

  if (!tx || !from) {
    console.info(
      '\n[email] SMTP not configured — email not sent. Preview below:\n' +
        `  to:      ${to}\n` +
        `  subject: ${subject}\n` +
        `  html:    ${html}\n`
    );
    return { sent: false };
  }

  try {
    await tx.sendMail({ from, to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error('[email] Failed to send email:', err);
    return { sent: false };
  }
}

/**
 * Builds the branded HTML for a password-reset email.
 */
export function buildPasswordResetEmail(resetUrl: string, name?: string): string {
  const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi there,';
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
    <div style="text-align: center; margin-bottom: 28px;">
      <span style="display:inline-block; font-size: 20px; font-weight: 700; color: #16a34a; letter-spacing: -0.02em;">Richmond Vege Mart</span>
    </div>
    <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 16px;">Reset your password</h1>
    <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 12px;">${greeting}</p>
    <p style="font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 24px;">
      We received a request to reset the password for your account. Click the button below to choose a new password. This link will expire in <strong>1 hour</strong>.
    </p>
    <div style="text-align: center; margin: 0 0 28px;">
      <a href="${resetUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 10px;">Reset Password</a>
    </div>
    <p style="font-size: 13px; line-height: 1.6; color: #777; margin: 0 0 8px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="font-size: 13px; line-height: 1.6; color: #16a34a; word-break: break-all; margin: 0 0 24px;">${resetUrl}</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
    <p style="font-size: 13px; line-height: 1.6; color: #999; margin: 0;">
      If you didn't request a password reset, you can safely ignore this email — your password won't be changed.
    </p>
  </div>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

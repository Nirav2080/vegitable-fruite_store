'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(3, 'Subject must be at least 3 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function submitContactForm(data: unknown): Promise<{ success: boolean; message: string }> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Invalid form data.';
    return { success: false, message: firstError };
  }

  // Ready to wire up email (e.g. Resend, SendGrid) or save to database
  console.info('[Contact form]', parsed.data);

  return {
    success: true,
    message: 'Thank you for your message. We will get back to you within 1–2 business days.',
  };
}

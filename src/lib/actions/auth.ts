
'use server'

import { z } from 'zod';
import { getDatabase } from '@/lib/db';
import type { User } from '@/lib/types';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().optional(),
})

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  user?: Partial<User>;
}

async function getDb() {
    return getDatabase();
}

export async function login(data: unknown): Promise<ActionResult> {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: 'Please enter a valid email and password.' };
  }

  const { email, password } = result.data;

  try {
    const db = await getDb();
    if (!db) {
      return { success: false, message: 'Service is temporarily unavailable. Please try again later.' };
    }

    const usersCollection = db.collection<User>('users');
    const user = await usersCollection.findOne({ email });

    if (!user || !user.password) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    return {
      success: true,
      message: 'Logged in successfully.',
      user: { id: (user._id as any).toString(), name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(), email: user.email },
    };
  } catch {
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}


export async function register(data: unknown): Promise<ActionResult> {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.errors.map(e => e.message).join(', ');
        return { success: false, message: errorMessage };
    }

    const { firstName, lastName, email, password, phone } = result.data;
    const fullName = `${firstName} ${lastName}`;

    try {
        const db = await getDb();
        if (!db) {
            return { success: false, message: 'Service is temporarily unavailable. Please try again later.' };
        }

        const usersCollection = db.collection<User>('users');
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: Omit<User, 'id'> = {
            firstName,
            lastName,
            name: fullName,
            email,
            password: hashedPassword,
            phone: phone || undefined,
            avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${fullName}`,
            registeredAt: new Date(),
            orderCount: 0,
            totalSpent: 0,
        };

        const insertResult = await usersCollection.insertOne(newUser as any);

        return {
            success: true,
            message: 'Account created successfully.',
            user: { id: insertResult.insertedId.toString(), name: fullName, email },
        };
    } catch {
        return { success: false, message: 'Failed to create account. Please try again.' };
    }
}

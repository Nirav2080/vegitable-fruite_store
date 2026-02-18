
'use server'

import { z } from 'zod';
import clientPromise from '@/lib/db';
import type { User } from '@/lib/types';
import { AuthError } from '@/lib/exceptions';
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

async function getDb() {
    const client = await clientPromise;
    if (!client) {
      return null;
    }
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

export async function login(data: unknown): Promise<{ success: boolean; message: string; user?: Partial<User> }> {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    throw new AuthError('Invalid input.');
  }

  const { email, password } = result.data;
  
  const db = await getDb();
  if (!db) throw new Error("Database not connected.");
  const usersCollection = db.collection<User>('users');
  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw new AuthError('No user found with this email address.');
  }

  if (!user.password) {
      throw new AuthError('This account was created without a password. Please contact support.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AuthError('Invalid password.');
  }

  return {
    success: true,
    message: 'Logged in successfully.',
    user: { id: (user._id as any).toString(), name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(), email: user.email },
  };
}


export async function register(data: unknown): Promise<{ success: boolean; message: string; user?: Partial<User> }> {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.errors.map(e => e.message).join(', ');
        throw new AuthError(errorMessage);
    }
    
    const { firstName, lastName, email, password, phone } = result.data;
    const fullName = `${firstName} ${lastName}`;

    const db = await getDb();
    if (!db) throw new Error("Database not connected.");
    const usersCollection = db.collection<User>('users');
    
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
        throw new AuthError('A user with this email already exists.');
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
}


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
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

async function getDb() {
    if (!clientPromise) return null;
    const client = await clientPromise;
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
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
}


export async function register(data: unknown): Promise<{ success: boolean; message: string; }> {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.errors.map(e => e.message).join(', ');
        throw new AuthError(errorMessage);
    }
    
    const { name, email, password } = result.data;

    const db = await getDb();
    if (!db) throw new Error("Database not connected.");
    const usersCollection = db.collection<User>('users');
    
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
        throw new AuthError('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: Omit<User, 'id'> = {
        name,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`,
        registeredAt: new Date(),
        orderCount: 0,
        totalSpent: 0,
    };

    await usersCollection.insertOne(newUser as any);

    return {
        success: true,
        message: 'User registered successfully.',
    };
}

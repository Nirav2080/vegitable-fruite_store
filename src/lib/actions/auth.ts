
'use server'

import { z } from 'zod';
import clientPromise from '@/lib/db';
import type { User } from '@/lib/types';
import { AuthError } from '@/lib/exceptions';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

export async function login(data: unknown): Promise<{ success: boolean; message: string; user?: Partial<User> }> {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: 'Invalid input.' };
  }

  const { email, password } = result.data;
  
  // This is a mock authentication. In a real app, you would hash the password
  // and compare it to a stored hash.
  if (email === 'customer@example.com' && password === 'password') {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
        // For demo purposes, let's use a fallback if the user isn't in the DB
        return { 
            success: true, 
            message: 'Logged in successfully.',
            user: { name: 'Demo User', email }
        };
    }
    
    return {
      success: true,
      message: 'Logged in successfully.',
      user: { id: user._id.toString(), name: user.name, email: user.email },
    };
  }

  throw new AuthError('Invalid email or password.');
}

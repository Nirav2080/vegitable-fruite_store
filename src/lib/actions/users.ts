
'use server'

import type { User } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { AuthError } from '../exceptions';

async function getDb() {
    if (!clientPromise) return null;
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getUsersCollection() {
    const db = await getDb();
    if (!db) return null;
    return db.collection<User>('users');
}

function serializeUser(user: any): User {
    const { _id, password, ...rest } = user;
    return {
        ...rest,
        id: _id.toString(),
    } as User;
}

export async function getUsers(): Promise<User[]> {
    const usersCollection = await getUsersCollection();
    if (!usersCollection) return [];
    const users = await usersCollection.find({}).sort({ registeredAt: -1 }).toArray();
    return users.map(serializeUser);
}

export async function getUserById(id: string): Promise<User | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const usersCollection = await getUsersCollection();
    if (!usersCollection) return null;
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
        return null;
    }
    return serializeUser(user);
}


export async function getCurrentUser(userId?: string): Promise<User | null> {
    if (!userId || !ObjectId.isValid(userId)) {
        return null;
    }
    const usersCollection = await getUsersCollection();
    if (!usersCollection) return null;
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return null;
    }
    return serializeUser(user);
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  mobile: z.string().optional(),
  address: z.string().optional(),
})

export async function updateUserProfile(userId: string, data: unknown) {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new AuthError('Invalid user ID.');
  }
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors.map(e => e.message).join(', '));
  }

  const { name, mobile, address } = result.data;
  const usersCollection = await getUsersCollection();
  if (!usersCollection) throw new Error("Database not connected.");

  const updateResult = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { name, mobile, address } }
  );

  if (updateResult.matchedCount === 0) {
    throw new Error('User not found.');
  }
  
  revalidatePath('/account/profile');

  const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });

  return { 
      success: true, 
      message: 'Profile updated successfully.',
      user: serializeUser(updatedUser)
    };
}

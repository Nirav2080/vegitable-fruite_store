
'use server'

import type { User } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getUsersCollection() {
    const db = await getDb();
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
    const users = await usersCollection.find({}).sort({ registeredAt: -1 }).toArray();
    return users.map(serializeUser);
}

export async function getUserById(id: string): Promise<User | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const usersCollection = await getUsersCollection();
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
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return null;
    }
    return serializeUser(user);
}

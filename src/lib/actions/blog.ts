
'use server'

import type { Blog } from '@/lib/types';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getBlogCollection() {
    const db = await getDb();
    return db.collection<Blog>('blog');
}

function serializePost(post: any): Blog {
    const { _id, ...rest } = post;
    return {
        ...rest,
        id: _id.toString(),
    } as Blog;
}

export async function getBlogPosts(): Promise<Blog[]> {
    const blogCollection = await getBlogCollection();
    const posts = await blogCollection.find({}).sort({ date: -1 }).toArray();
    return posts.map(serializePost);
}

export async function getBlogPostBySlug(slug: string): Promise<Blog | null> {
    const blogCollection = await getBlogCollection();
    const post = await blogCollection.findOne({ slug });
    if (!post) {
        return null;
    }
    return serializePost(post);
}

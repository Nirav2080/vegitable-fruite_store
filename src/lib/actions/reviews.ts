
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { Review, Product, User } from '@/lib/types';
import { AuthError } from '../exceptions';
import { getCurrentUser } from './users';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(1, 'Comment is required'),
});

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

export async function addReview(productId: string, data: unknown) {
  if (!ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const result = reviewSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map(e => e.message).join(', '));
  }

  // In a real app, you would get the current logged-in user's ID
  const db = await getDb();
  const usersCollection = db.collection<User>('users');
  const user = await usersCollection.findOne({}); // For demo, just grab any user

  if (!user) {
    throw new AuthError('You must be logged in to post a review.');
  }

  const { rating, title, comment } = result.data;

  const newReview: Omit<Review, 'id'> = {
    _id: new ObjectId(),
    author: user.name,
    avatar: user.avatar,
    rating,
    title,
    comment,
    date: new Date(),
  };

  const productsCollection = db.collection<Product>('products');
  
  // Add the new review and update the average rating
  const productBeforeUpdate = await productsCollection.findOne({ _id: new ObjectId(productId) });
  if (!productBeforeUpdate) {
    throw new Error('Product not found');
  }

  const existingReviews = Array.isArray(productBeforeUpdate.reviews) ? productBeforeUpdate.reviews : [];
  const totalRating = existingReviews.reduce((acc, r) => acc + r.rating, 0) + newReview.rating;
  const newAverageRating = totalRating / (existingReviews.length + 1);

  const updateResult = await productsCollection.updateOne(
    { _id: new ObjectId(productId) },
    { 
        $push: { reviews: newReview as any }, // Cast to any to avoid type issues with _id
        $set: { rating: newAverageRating }
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error('Failed to add review.');
  }
  
  const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

  revalidatePath(`/products/${product?.slug}`);

  return { success: true, message: 'Review added successfully' };
}

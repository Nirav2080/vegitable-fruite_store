
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Category, Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getCategoriesCollection() {
    const db = await getDb();
    return db.collection<Category>('categories');
}

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  icon: z.string().min(1, "An SVG icon is required"),
});

function serializeCategory(category: any): Category {
    if (!category) return category;
    const { _id, ...rest } = category;
    return {
        ...rest,
        id: _id.toString(),
    } as Category;
}

export async function getCategories(): Promise<Category[]> {
    const categoriesCollection = await getCategoriesCollection();
    const categories = await categoriesCollection.find({}).sort({ name: 1 }).toArray();
    return categories.map(serializeCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const categoriesCollection = await getCategoriesCollection();
    const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });
    if (!category) {
        return null;
    }
    return serializeCategory(category);
}

export async function createCategory(data: unknown) {
    const parsedData = categorySchema.parse(data);
    const categoriesCollection = await getCategoriesCollection();
    
    await categoriesCollection.insertOne({
      ...parsedData,
      createdAt: new Date(),
    } as any);
    
    revalidatePath('/admin/categories');
    revalidatePath('/');
}

export async function updateCategory(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const parsedData = categorySchema.parse(data);
  const categoriesCollection = await getCategoriesCollection();

  const result = await categoriesCollection.updateOne({ _id: new ObjectId(id) }, { $set: parsedData });

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}/edit`);
  revalidatePath('/');
  revalidatePath('/products');
}

export async function deleteCategory(id: string) {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ID');
    }
    
    const db = await getDb();
    const productsCollection = db.collection<Product>('products');
    const productCount = await productsCollection.countDocuments({ categoryId: new ObjectId(id) });

    if (productCount > 0) {
        throw new Error('Cannot delete category with associated products.');
    }

    const categoriesCollection = await getCategoriesCollection();
    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidatePath('/products');
}

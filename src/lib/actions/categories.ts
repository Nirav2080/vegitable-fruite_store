
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Category, Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    if (!clientPromise) return null;
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getCategoriesCollection() {
    const db = await getDb();
    if (!db) return null;
    return db.collection<Category>('categories');
}

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  icon: z.string().optional(),
  parentId: z.string().optional(),
});

function serializeCategory(category: any): Category {
    if (!category) return category;
    const { _id, ...rest } = category;
    return {
        ...rest,
        id: _id.toString(),
    } as Category;
}

export async function getCategories(includeSubcategories = false): Promise<Category[]> {
    const categoriesCollection = await getCategoriesCollection();
    if (!categoriesCollection) return [];
    const categoriesData = await categoriesCollection.find({}).sort({ name: 1 }).toArray();
    const categories = categoriesData.map(serializeCategory);

    if (includeSubcategories) {
        const categoryMap = new Map<string, Category>();
        const rootCategories: Category[] = [];

        categories.forEach(category => {
            category.subcategories = [];
            categoryMap.set(category.id, category);
        });

        categories.forEach(category => {
            if (category.parentId && categoryMap.has(category.parentId)) {
                categoryMap.get(category.parentId)!.subcategories!.push(category);
            } else {
                rootCategories.push(category);
            }
        });
        return rootCategories;
    }
    
    return categories;
}

export async function getCategoryById(id: string): Promise<Category | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const categoriesCollection = await getCategoriesCollection();
    if (!categoriesCollection) return null;
    const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });
    if (!category) {
        return null;
    }
    return serializeCategory(category);
}

export async function createCategory(data: unknown) {
    const parsedData = categorySchema.parse(data);
    const categoriesCollection = await getCategoriesCollection();
    if (!categoriesCollection) throw new Error("Database not connected.");
    
    const dataToInsert: any = {
      ...parsedData,
      createdAt: new Date(),
    };

    if (parsedData.parentId) {
        dataToInsert.parentId = parsedData.parentId;
    }

    await categoriesCollection.insertOne(dataToInsert);
    
    revalidatePath('/admin/categories');
    revalidatePath('/');
}

export async function updateCategory(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const parsedData = categorySchema.parse(data);
  const categoriesCollection = await getCategoriesCollection();
  if (!categoriesCollection) throw new Error("Database not connected.");

  const dataToUpdate: any = { ...parsedData };
    if (parsedData.parentId) {
        dataToUpdate.parentId = parsedData.parentId;
    } else {
        dataToUpdate.parentId = null;
    }

  const result = await categoriesCollection.updateOne({ _id: new ObjectId(id) }, { $set: dataToUpdate });

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
    if (!db) throw new Error("Database not connected.");
    const productsCollection = db.collection<Product>('products');
    const productCount = await productsCollection.countDocuments({ categoryId: id });

    if (productCount > 0) {
        throw new Error('Cannot delete category with associated products.');
    }

    const categoriesCollection = await getCategoriesCollection();
    if (!categoriesCollection) throw new Error("Database not connected.");
    const subcategoryCount = await categoriesCollection.countDocuments({ parentId: id });

     if (subcategoryCount > 0) {
        throw new Error('Cannot delete category with subcategories.');
    }

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidatePath('/products');
}

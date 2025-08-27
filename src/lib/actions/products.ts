
'use server'

import { z } from 'zod';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  longDescription: z.string().min(20),
  price: z.number().min(0.01),
  category: z.enum(['Fruits', 'Vegetables', 'Organic Boxes']),
  stock: z.number().int().min(0),
  isOrganic: z.boolean(),
  isSeasonal: z.boolean(),
  images: z.array(z.string().url()),
});

// Helper function to connect to DB and get collection
async function getProductsCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Omit<Product, 'id'>>('products');
}


function toProduct(doc: any): Product {
    const { _id, ...rest } = doc;
    return {
        id: _id.toHexString(),
        ...rest
    } as Product;
}

export async function getProducts(): Promise<Product[]> {
    const productsCollection = await getProductsCollection();
    const products = await productsCollection.find({}).sort({ name: 1 }).toArray();
    return products.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const productsCollection = await getProductsCollection();
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!product) {
        return null;
    }
    return toProduct(product);
}


export async function createProduct(data: unknown) {
    const parsedData = productSchema.parse(data);
    const productsCollection = await getProductsCollection();

    const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = {
      ...parsedData,
      slug,
      rating: 0, // default rating
      reviews: 0, // default reviews
      createdAt: new Date(),
    };

    await productsCollection.insertOne(newProduct);

    revalidatePath('/admin/products');
    revalidatePath('/products');
}

export async function updateProduct(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
  const parsedData = productSchema.parse(data);
  const productsCollection = await getProductsCollection();

  const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updatedProduct = {
      ...parsedData,
      slug,
  };

  const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
  );

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
}

export async function deleteProduct(id: string) {
    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid product ID");
    }
    const productsCollection = await getProductsCollection();
    
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
}

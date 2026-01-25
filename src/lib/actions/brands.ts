
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Brand } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    if (!client) {
      return null;
    }
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getBrandsCollection() {
    const db = await getDb();
    if (!db) return null;
    return db.collection<Brand>('brands');
}

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logo: z.string().min(1, "A logo is required"),
});

function serializeBrand(brand: any): Brand {
    const { _id, ...rest } = brand;
    return {
        ...rest,
        id: _id.toString(),
    } as Brand;
}

export async function getBrands(): Promise<Brand[]> {
    const brandsCollection = await getBrandsCollection();
    if (!brandsCollection) return [];
    const brands = await brandsCollection.find({}).sort({ name: 1 }).toArray();
    return brands.map(serializeBrand);
}

export async function getBrandById(id: string): Promise<Brand | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const brandsCollection = await getBrandsCollection();
    if (!brandsCollection) return null;
    const brand = await brandsCollection.findOne({ _id: new ObjectId(id) });
    if (!brand) {
        return null;
    }
    return serializeBrand(brand);
}

export async function createBrand(data: unknown) {
    const parsedData = brandSchema.parse(data);
    const brandsCollection = await getBrandsCollection();
    if (!brandsCollection) throw new Error("Database not connected.");
    
    await brandsCollection.insertOne({
      ...parsedData,
      createdAt: new Date(),
    } as any);
    
    revalidatePath('/admin/brands');
    revalidatePath('/');
}

export async function updateBrand(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const parsedData = brandSchema.parse(data);
  const brandsCollection = await getBrandsCollection();
  if (!brandsCollection) throw new Error("Database not connected.");

  const result = await brandsCollection.updateOne({ _id: new ObjectId(id) }, { $set: parsedData });

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/brands');
  revalidatePath(`/admin/brands/${id}/edit`);
  revalidatePath('/');
}

export async function deleteBrand(id: string) {
    if (!ObjectId.isValid(id)) {
        notFound();
    }
    const brandsCollection = await getBrandsCollection();
    if (!brandsCollection) throw new Error("Database not connected.");
    const result = await brandsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/brands');
    revalidatePath('/');
}

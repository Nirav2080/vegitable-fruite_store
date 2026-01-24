
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Banner } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    if (!clientPromise) return null;
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getBannersCollection() {
    const db = await getDb();
    if (!db) return null;
    return db.collection<Banner>('banners');
}

const bannerSchema = z.object({
  supertitle: z.string().min(1, "Supertitle is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  image: z.string().min(1, "An image is required"),
  href: z.string().min(1, "A link URL is required"),
  isActive: z.boolean().default(true),
});

function serializeBanner(banner: any): Banner {
    const { _id, ...rest } = banner;
    return {
        ...rest,
        id: _id.toString(),
    } as Banner;
}

export async function getBanners(): Promise<Banner[]> {
    const bannersCollection = await getBannersCollection();
    if (!bannersCollection) return [];
    const banners = await bannersCollection.find({}).sort({ createdAt: -1 }).toArray();
    return banners.map(serializeBanner);
}

export async function getActiveBanners(): Promise<Banner[]> {
    const bannersCollection = await getBannersCollection();
    if (!bannersCollection) return [];
    const banners = await bannersCollection.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    return banners.map(serializeBanner);
}

export async function getBannerById(id: string): Promise<Banner | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const bannersCollection = await getBannersCollection();
    if (!bannersCollection) return null;
    const banner = await bannersCollection.findOne({ _id: new ObjectId(id) });
    if (!banner) {
        return null;
    }
    return serializeBanner(banner);
}

export async function createBanner(data: unknown) {
    const parsedData = bannerSchema.parse(data);
    const bannersCollection = await getBannersCollection();
    if (!bannersCollection) throw new Error("Database not connected.");
    
    const newBanner: Omit<Banner, 'id'> = {
      ...parsedData,
      createdAt: new Date(),
    };

    await bannersCollection.insertOne(newBanner as any);
    
    revalidatePath('/admin/banners');
    revalidatePath('/');
}

export async function updateBanner(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const parsedData = bannerSchema.parse(data);
  const bannersCollection = await getBannersCollection();
  if (!bannersCollection) throw new Error("Database not connected.");

  const result = await bannersCollection.updateOne({ _id: new ObjectId(id) }, { $set: parsedData });

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/banners');
  revalidatePath(`/admin/banners/${id}/edit`);
  revalidatePath('/');
}

export async function deleteBanner(id: string) {
    if (!ObjectId.isValid(id)) {
        notFound();
    }
    const bannersCollection = await getBannersCollection();
    if (!bannersCollection) throw new Error("Database not connected.");
    const result = await bannersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/banners');
    revalidatePath('/');
}

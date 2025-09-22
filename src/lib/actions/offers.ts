
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Offer } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getOffersCollection() {
    const db = await getDb();
    return db.collection<Offer>('offers');
}

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  code: z.string().optional(),
  discount: z.coerce.number().optional(),
  link: z.string().min(1, "A link URL is required"),
  bgColor: z.string().min(1, "Background color is required"),
  isActive: z.boolean().default(true),
});

function serializeOffer(offer: any): Offer {
    const { _id, ...rest } = offer;
    return {
        ...rest,
        id: _id.toString(),
    } as Offer;
}

export async function getOffers(): Promise<Offer[]> {
    const offersCollection = await getOffersCollection();
    const offers = await offersCollection.find({}).sort({ createdAt: -1 }).toArray();
    return offers.map(serializeOffer);
}

export async function getActiveOffers(): Promise<Offer[]> {
    const offersCollection = await getOffersCollection();
    const offers = await offersCollection.find({ isActive: true }).sort({ createdAt: -1 }).limit(2).toArray();
    return offers.map(serializeOffer);
}

export async function getOfferById(id: string): Promise<Offer | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const offersCollection = await getOffersCollection();
    const offer = await offersCollection.findOne({ _id: new ObjectId(id) });
    if (!offer) {
        return null;
    }
    return serializeOffer(offer);
}

export async function createOffer(data: unknown) {
    const parsedData = offerSchema.parse(data);
    const offersCollection = await getOffersCollection();
    
    await offersCollection.insertOne({
      ...parsedData,
      createdAt: new Date(),
    } as any);
    
    revalidatePath('/admin/offers');
    revalidatePath('/');
}

export async function updateOffer(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const parsedData = offerSchema.parse(data);
  const offersCollection = await getOffersCollection();

  const result = await offersCollection.updateOne({ _id: new ObjectId(id) }, { $set: parsedData });

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/offers');
  revalidatePath(`/admin/offers/${id}/edit`);
  revalidatePath('/');
}

export async function deleteOffer(id: string) {
    if (!ObjectId.isValid(id)) {
        notFound();
    }
    const offersCollection = await getOffersCollection();
    const result = await offersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/offers');
    revalidatePath('/');
}


'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Attribute } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    if (!clientPromise) return null;
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getAttributesCollection() {
    const db = await getDb();
    if (!db) return null;
    return db.collection<Attribute>('attributes');
}

const attributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  values: z.array(z.string().min(1, "Value cannot be empty")).min(1, "At least one value is required"),
});

function serializeAttribute(attribute: any): Attribute {
    const { _id, ...rest } = attribute;
    return {
        ...rest,
        id: _id.toString(),
    } as Attribute;
}

export async function getAttributes(): Promise<Attribute[]> {
    const attributesCollection = await getAttributesCollection();
    if (!attributesCollection) return [];
    const attributes = await attributesCollection.find({}).sort({ name: 1 }).toArray();
    return attributes.map(serializeAttribute);
}

export async function getAttributeById(id: string): Promise<Attribute | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const attributesCollection = await getAttributesCollection();
    if (!attributesCollection) return null;
    const attribute = await attributesCollection.findOne({ _id: new ObjectId(id) });
    if (!attribute) {
        return null;
    }
    return serializeAttribute(attribute);
}

export async function createAttribute(data: unknown) {
    const parsedData = attributeSchema.parse(data);
    const attributesCollection = await getAttributesCollection();
    if (!attributesCollection) throw new Error("Database not connected.");
    
    await attributesCollection.insertOne({
      ...parsedData,
      createdAt: new Date(),
    } as any);
    
    revalidatePath('/admin/attributes');
}

export async function updateAttribute(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const parsedData = attributeSchema.parse(data);
  const attributesCollection = await getAttributesCollection();
  if (!attributesCollection) throw new Error("Database not connected.");

  const result = await attributesCollection.updateOne({ _id: new ObjectId(id) }, { $set: parsedData });

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/attributes');
  revalidatePath(`/admin/attributes/${id}/edit`);
}

export async function deleteAttribute(id: string) {
    if (!ObjectId.isValid(id)) {
        notFound();
    }
    const attributesCollection = await getAttributesCollection();
    if (!attributesCollection) throw new Error("Database not connected.");
    const result = await attributesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/attributes');
}

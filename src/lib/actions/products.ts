

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
  price: z.coerce.number().min(0.01),
  category: z.enum(['Fruits', 'Vegetables', 'Organic Boxes']),
  stock: z.coerce.number().int().min(0),
  isOrganic: z.boolean(),
  isSeasonal: z.boolean(),
  images: z.string().min(1).transform(val => val.split(',').map(s => s.trim())),
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

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) {
        return [];
    }
    const productsCollection = await getProductsCollection();
    const products = await productsCollection.find({
        name: { $regex: query, $options: 'i' }
    }).limit(10).toArray();

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
      rating: Math.floor(Math.random() * (5 - 3 + 1)) + 3, // default rating
      reviews: Math.floor(Math.random() * 100), // default reviews
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

  const { images, ...restOfParsedData } = parsedData;

  const updatedProduct = {
      ...restOfParsedData,
      images: Array.isArray(images) ? images : [images],
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

export async function getDashboardData() {
    const productsCollection = await getProductsCollection();
    const products = await productsCollection.find({}).toArray();

    const totalRevenue = products.reduce((acc, p) => acc + (p.price * (100 - p.stock)), 0);
    const totalSales = 100 - products.reduce((acc, p) => acc + p.stock, 0) / products.length;
    const totalProducts = products.length;

    const salesData = [
        { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
        { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
    ];

    const recentTransactions = products.slice(0, 5).map(p => ({
        id: p._id.toHexString(),
        name: `Customer ${Math.floor(Math.random() * 100)}`,
        email: `customer${Math.floor(Math.random() * 100)}@example.com`,
        amount: p.price * (Math.floor(Math.random() * 3) + 1),
    }));

    return {
        totalRevenue,
        totalSales,
        totalProducts,
        salesData,
        recentTransactions,
    }
}

// Seeding function - only run once if needed
export async function seedDatabase() {
  const productsCollection = await getProductsCollection();
  const count = await productsCollection.countDocuments();
  if (count > 0) {
    console.log('Database already seeded.');
    return;
  }
  console.log('Seeding database...');
  
  const productsToSeed: Omit<Product, 'id'>[] = [
      {
        slug: 'organic-royal-gala-apples',
        name: 'Organic Royal Gala Apples',
        description: 'Crisp, sweet, and perfect for snacking.',
        longDescription: 'Our Organic Royal Gala Apples are sourced from local orchards in the Hawke\'s Bay region. Known for their reddish-pink skin and sweet, crisp flesh, they are perfect for eating fresh, adding to salads, or baking into pies. Grown without synthetic pesticides, they are a healthy and delicious choice.',
        price: 6.99,
        images: ['https://picsum.photos/seed/apple/800/800', 'https://picsum.photos/seed/apple2/800/800', 'https://picsum.photos/seed/apple3/800/800'],
        category: 'Fruits',
        isOrganic: true,
        isSeasonal: true,
        stock: 150,
        rating: 4.8,
        reviews: 120,
      },
      {
        slug: 'hass-avocados',
        name: 'Hass Avocados',
        description: 'Creamy and rich, ideal for toast or salads.',
        longDescription: 'These creamy Hass Avocados are grown in the Bay of Plenty. They have a rich, nutty flavor and a buttery texture that makes them perfect for spreading on toast, adding to smoothies, or making guacamole. Packed with healthy fats and nutrients.',
        price: 2.50,
        images: ['https://picsum.photos/seed/avocado/800/800', 'https://picsum.photos/seed/avocado2/800/800'],
        category: 'Fruits',
        isOrganic: false,
        isSeasonal: true,
        stock: 200,
        rating: 4.9,
        reviews: 250,
      },
      {
        slug: 'agria-potatoes',
        name: 'Agria Potatoes',
        description: 'Fluffy texture, excellent for roasting and mashing.',
        longDescription: 'Agria Potatoes from Canterbury are a versatile favorite. Their yellow flesh and fluffy texture make them ideal for roasting, mashing, and making chips. A staple in any Kiwi kitchen, they offer a delicious, earthy flavor.',
        price: 4.50,
        images: ['https://picsum.photos/seed/potato/800/800', 'https://picsum.photos/seed/potato2/800/800'],
        category: 'Vegetables',
        isOrganic: false,
        isSeasonal: false,
        stock: 300,
        rating: 4.7,
        reviews: 95,
      },
      {
        slug: 'organic-carrots',
        name: 'Organic Carrots',
        description: 'Sweet and crunchy, packed with vitamins.',
        longDescription: 'Our organic carrots are grown in the fertile soils of Pukekohe. They are known for their sweet flavor and satisfying crunch. Perfect for snacking, juicing, or adding to stews and roasts. Certified organic and full of beta-carotene.',
        price: 3.99,
        images: ['https://picsum.photos/seed/carrot/800/800', 'https://picsum.photos/seed/carrot2/800/800'],
        category: 'Vegetables',
        isOrganic: true,
        isSeasonal: false,
        stock: 180,
        rating: 4.6,
        reviews: 88,
      },
      {
        slug: 'gold-kiwifruit',
        name: 'Gold Kiwifruit',
        description: 'Sweet, tropical, and bursting with Vitamin C.',
        longDescription: 'A true New Zealand icon, our Gold Kiwifruit is sweeter and less acidic than its green counterpart. With a smooth, hairless skin and a tropical flavor, it\'s a delicious way to boost your Vitamin C intake. Sourced from Te Puke, the kiwifruit capital of the world.',
        price: 7.50,
        images: ['https://picsum.photos/seed/kiwi/800/800', 'https://picsum.photos/seed/kiwi2/800/800'],
        category: 'Fruits',
        isOrganic: false,
        isSeasonal: true,
        stock: 120,
        rating: 5.0,
        reviews: 310,
      },
  ];

  await productsCollection.insertMany(productsToSeed as any);
  console.log('Database seeded successfully.');
}

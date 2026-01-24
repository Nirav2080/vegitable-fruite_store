
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Product, ProductVariant, Category, ProductSearchResult } from '@/lib/types';
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

async function getProductsCollection() {
    const db = await getDb();
    if (!db) return null;
    return db.collection<Product>('products');
}

const variantSchema = z.object({
  weight: z.string().min(1, 'Weight/Unit is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
});

const unitOptions = [
    "Loose", "Bag(e.g, 1kg, 1.5kg)", "Each", "Half", "Punnet", "Bunch", "Piece (e.g Quarter, half)", "Mix Pepper Bag", "Dozen(e.g half Dozen, Tray)", "Liter Bottles(e.g, 1 liter, 2 liter)", "Tub(e.g 700g)"
];

const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  brand: z.string().optional(),
  unitType: z.string().optional(),
  isOrganic: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDeal: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  images: z.array(z.string()).min(1, { message: "Please add at least one image."}),
  variants: z.array(variantSchema).min(1, { message: 'At least one product variant is required.'}),
});

function serializeProduct(product: any, categoryMap: Map<string, string>): Product | null {
    if (!product || !product.categoryId) return null;

    const { _id, ...rest } = product;

    const serializedReviews = Array.isArray(product.reviews)
        ? product.reviews.map((review: any) => {
            const date = review.date ? new Date(review.date) : new Date();
            return {
                ...review,
                _id: review._id.toString(),
                date: isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
            }
          })
        : [];

    const categoryIdString = product.categoryId.toString();

    return {
        ...rest,
        id: _id.toString(),
        categoryId: categoryIdString,
        category: categoryMap.get(categoryIdString) || 'Uncategorized',
        reviews: serializedReviews,
        rating: typeof product.rating === 'number' ? product.rating : 0,
    } as Product;
}

export async function getProducts(): Promise<Product[]> {
    const db = await getDb();
    if (!db) return [];
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');

    const [productsData, categoriesData] = await Promise.all([
        productsCollection.find({}).sort({ createdAt: -1 }).toArray(),
        categoriesCollection.find({}).toArray()
    ]);

    const categoryMap = new Map<string, string>();
    categoriesData.forEach(cat => {
        categoryMap.set(cat._id.toString(), cat.name);
    });

    const serializedProducts = productsData.map(product => serializeProduct(product, categoryMap));
    return serializedProducts.filter((p): p is Product => p !== null);
}

export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
    if (!query) {
        return [];
    }
    const productsCollection = await getProductsCollection();
    if (!productsCollection) return [];
    const products = await productsCollection.find({ name: { $regex: query, $options: 'i' } }).limit(10).toArray();

    return products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        images: p.images,
        price: p.variants?.[0]?.price ?? 0,
    }));
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const db = await getDb();
    if (!db) return null;
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    
    const productData = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!productData) {
        return null;
    }

    const categoriesData = await categoriesCollection.find({}).toArray();
    const categoryMap = new Map<string, string>();
    categoriesData.forEach(cat => {
        categoryMap.set(cat._id.toString(), cat.name);
    });

    return serializeProduct(productData, categoryMap);
}

export async function createProduct(data: unknown) {
    const parsedData = productSchema.parse(data);
    const productsCollection = await getProductsCollection();
    if (!productsCollection) throw new Error("Database not connected.");
    
    const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Omit<Product, 'id' | 'category' | 'rating' | 'reviews'> & { categoryId: ObjectId, createdAt: Date, reviews: [], rating: number } = {
      ...parsedData,
      categoryId: new ObjectId(parsedData.categoryId),
      images: parsedData.images.length > 0 ? parsedData.images : ['https://placehold.co/400x400/EEE/31343C?text=No+Image'],
      slug,
      createdAt: new Date(),
      reviews: [],
      rating: 0,
    };

    await productsCollection.insertOne(newProduct as any);
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
}

export async function updateProduct(id: string, data: unknown) {
  if (!ObjectId.isValid(id)) {
      notFound();
  }
  const productsCollection = await getProductsCollection();
  if (!productsCollection) throw new Error("Database not connected.");
  
  const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) });
  if (!existingProduct) {
      notFound();
  }

  const parsedData = productSchema.parse(data);
  const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updateData = {
      ...parsedData,
      categoryId: new ObjectId(parsedData.categoryId),
      slug,
      reviews: existingProduct.reviews || [],
      rating: existingProduct.rating || 0,
  };

  const result = await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/');
}

export async function deleteProduct(id: string) {
    if (!ObjectId.isValid(id)) {
        notFound();
    }
    const productsCollection = await getProductsCollection();
    if (!productsCollection) throw new Error("Database not connected.");
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
}

export async function getDashboardData() {
    const db = await getDb();
    if (!db) return { totalRevenue: 0, totalSales: 0, totalProducts: 0, salesData: [], recentTransactions: [] };

    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');

    const totalProducts = await productsCollection.countDocuments();
    
    const revenueResult = await ordersCollection.aggregate([
        { $match: { status: 'Delivered' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const totalSales = await ordersCollection.countDocuments({ status: { $in: ['Delivered', 'Shipped', 'Processing'] }});

    const salesByMonth = await ordersCollection.aggregate([
        { $project: { month: { $month: "$date" }, total: "$total" } },
        { $group: { _id: "$month", total: { $sum: "$total" } } },
        { $sort: { _id: 1 } }
    ]).toArray();
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesData = monthNames.map((name, index) => {
        const monthData = salesByMonth.find(d => d._id === index + 1);
        return { name, total: monthData ? monthData.total : 0 };
    });

    const recentTransactions = await ordersCollection.find({})
        .sort({ date: -1 })
        .limit(5)
        .toArray();

    return {
        totalRevenue,
        totalSales,
        totalProducts,
        salesData,
        recentTransactions: recentTransactions.map(t => ({
            id: t._id.toString(),
            name: t.customerName,
            email: t.email,
            amount: t.total,
        })),
    }
}

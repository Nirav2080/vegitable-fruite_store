
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Product, ProductVariant, Category } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.DB_NAME || 'aotearoa-organics');
}

async function getProductsCollection() {
    const db = await getDb();
    return db.collection<Product>('products');
}

const variantSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
});

const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  brand: z.string().optional(),
  isOrganic: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDeal: z.boolean().default(false),
  images: z.array(z.string()).min(1, { message: "Please add at least one image."}),
  variants: z.array(variantSchema).min(1, { message: 'At least one product variant is required.'}),
});

async function serializeProduct(product: any): Promise<Product | null> {
    if (!product || !product.categoryId) return null;

    const db = await getDb();
    const categoriesCollection = db.collection<Category>('categories');
    
    const category = await categoriesCollection.findOne({ _id: new ObjectId(product.categoryId) });

    const { _id, categoryId, ...rest } = product;

    const serializedReviews = Array.isArray(product.reviews) 
        ? product.reviews.map((review: any) => ({
            ...review,
            _id: review._id.toString(),
            date: review.date.toISOString(),
          }))
        : [];

    return {
        ...rest,
        id: _id.toString(),
        categoryId: categoryId.toString(),
        category: category ? category.name : 'Uncategorized',
        reviews: serializedReviews,
        rating: typeof product.rating === 'number' ? product.rating : 0,
    } as Product;
}

export async function getProducts(): Promise<Product[]> {
    const productsCollection = await getProductsCollection();
    const productsData = await productsCollection.find({}).sort({ createdAt: -1 }).toArray();

    const serializedProducts = await Promise.all(productsData.map(serializeProduct));
    return serializedProducts.filter((p): p is Product => p !== null);
}

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) {
        return [];
    }
    const productsCollection = await getProductsCollection();
    const products = await productsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
    
    // In this simplified search, we're only returning a subset of fields.
    return products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        images: p.images,
        price: p.variants?.[0]?.price ?? 0, // Simplified for search result
        // We are not returning all fields to keep the payload small.
    })) as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const productsCollection = await getProductsCollection();
    const productData = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!productData) {
        return null;
    }
    return serializeProduct(productData);
}

export async function createProduct(data: unknown) {
    const parsedData = productSchema.parse(data);
    const productsCollection = await getProductsCollection();
    
    const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Omit<Product, 'id' | 'category'> = {
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
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        notFound();
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
}

export async function getDashboardData() {
    const productsCollection = await getProductsCollection();
    const ordersCollection = (await getDb()).collection('orders');

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


'use server'

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import type { Product, ProductVariant, Category, ProductSearchResult, Brand } from '@/lib/types';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import * as XLSX from 'xlsx';

const PLACEHOLDER_BRAND_LOGO =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

type ImportRow = Record<string, unknown>;

function normalizeImportRow(row: Record<string, unknown>): ImportRow {
    const normalized: ImportRow = {};
    for (const [key, value] of Object.entries(row)) {
        normalized[key.trim().toLowerCase()] = value;
    }
    return normalized;
}

function parseBool(value: unknown, fallback = false): boolean {
    if (typeof value === 'boolean') return value;
    if (value === undefined || value === null || value === '') return fallback;
    const s = String(value).trim().toUpperCase();
    if (s === 'TRUE' || s === 'YES' || s === '1') return true;
    if (s === 'FALSE' || s === 'NO' || s === '0') return false;
    return fallback;
}

function isPlaceholderText(value: unknown): boolean {
    if (value === undefined || value === null) return true;
    return String(value).trim().toLowerCase() === 'text';
}

function getImportPrice(row: ImportRow): number | undefined {
    const priceVal = row.price ?? row['price ($)'];
    if (priceVal !== undefined && priceVal !== null && priceVal !== '') {
        const price = Number(priceVal);
        if (!isNaN(price)) return price;
    }
    const dealVal = row.isdeal;
    if (dealVal !== undefined && dealVal !== null && dealVal !== '') {
        const asNumber = Number(dealVal);
        if (!isNaN(asNumber) && asNumber > 0) return asNumber;
    }
    return undefined;
}

function getImportIsDeal(row: ImportRow): boolean {
    const dealVal = row.isdeal;
    if (typeof dealVal === 'boolean') return dealVal;
    const s = String(dealVal ?? '').trim().toUpperCase();
    if (s === 'TRUE') return true;
    if (s === 'FALSE') return false;
    if (!isNaN(Number(dealVal))) return false;
    return false;
}

function parseImportVariants(row: ImportRow, price: number): ProductVariant[] {
    const rawVariants = row.variants;
    if (rawVariants && typeof rawVariants === 'string' && rawVariants.trim().startsWith('[')) {
        const parsed = JSON.parse(rawVariants);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error('Variants JSON must be a non-empty array.');
        }
        return parsed;
    }

    const unitLabel =
        (typeof rawVariants === 'string' && rawVariants.trim() ? rawVariants.trim() : null) ||
        row.weight?.toString().trim() ||
        row.unittype?.toString().trim() ||
        'Each';

    const stock = parseInt(String(row.stock ?? ''), 10);
    return [
        {
            weight: unitLabel,
            price,
            stock: !isNaN(stock) ? stock : 100,
        },
    ];
}

function getImportUnitType(row: ImportRow): string | undefined {
    const rawVariants = row.variants;
    if (rawVariants && typeof rawVariants === 'string' && !rawVariants.trim().startsWith('[')) {
        return rawVariants.trim() || undefined;
    }
    const unitType = row.unittype?.toString().trim();
    return unitType || undefined;
}

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
  // description field disabled for future use:
  // description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  description: z.string().optional().default(""),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  brandId: z.string().optional(),
  unitType: z.string().optional(),
  isOrganic: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDeal: z.boolean().default(false),
  images: z.array(z.string()).min(1, { message: "Please add at least one image."}),
  variants: z.array(variantSchema).min(1, { message: 'At least one product variant is required.'}),
});

function serializeProduct(product: any, categoryMap: Map<string, string>, brandMap: Map<string, string>): Product | null {
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
    const brandIdString = product.brandId ? product.brandId.toString() : undefined;

    return {
        ...rest,
        id: _id.toString(),
        categoryId: categoryIdString,
        category: categoryMap.get(categoryIdString) || 'Uncategorized',
        brandId: brandIdString,
        brand: brandIdString ? brandMap.get(brandIdString) : undefined,
        reviews: serializedReviews,
        rating: typeof product.rating === 'number' ? product.rating : 0,
    } as Product;
}

export async function getProducts(): Promise<Product[]> {
    const db = await getDb();
    if (!db) return [];
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    const brandsCollection = db.collection('brands');

    const [productsData, categoriesData, brandsData] = await Promise.all([
        productsCollection.find({}).sort({ createdAt: -1 }).toArray(),
        categoriesCollection.find({}).toArray(),
        brandsCollection.find({}).toArray()
    ]);

    const categoryMap = new Map<string, string>();
    categoriesData.forEach(cat => {
        categoryMap.set(cat._id.toString(), cat.name);
    });

    const brandMap = new Map<string, string>();
    brandsData.forEach(brand => {
        brandMap.set(brand._id.toString(), brand.name);
    });

    const serializedProducts = productsData.map(product => serializeProduct(product, categoryMap, brandMap));
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
    const brandsCollection = db.collection('brands');
    
    const productData = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!productData) {
        return null;
    }

    const [categoriesData, brandsData] = await Promise.all([
        categoriesCollection.find({}).toArray(),
        brandsCollection.find({}).toArray()
    ]);

    const categoryMap = new Map<string, string>();
    categoriesData.forEach(cat => {
        categoryMap.set(cat._id.toString(), cat.name);
    });

    const brandMap = new Map<string, string>();
    brandsData.forEach(brand => {
        brandMap.set(brand._id.toString(), brand.name);
    });

    return serializeProduct(productData, categoryMap, brandMap);
}

export async function createProduct(data: unknown) {
    const parsedData = productSchema.parse(data);
    const productsCollection = await getProductsCollection();
    if (!productsCollection) throw new Error("Database not connected.");
    
    const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { brandId, ...restOfParsedData } = parsedData;

    const newProduct = {
      ...restOfParsedData,
      slug,
      categoryId: new ObjectId(parsedData.categoryId),
      createdAt: new Date(),
      reviews: [],
      rating: 0,
      ...(brandId && { brandId: new ObjectId(brandId) })
    };

    await productsCollection.insertOne(newProduct as any);
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidateTag('products');
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

  const { brandId, ...restOfParsedData } = parsedData;

  const updateData = {
      ...restOfParsedData,
      slug,
      categoryId: new ObjectId(parsedData.categoryId),
      reviews: existingProduct.reviews || [],
      rating: existingProduct.rating || 0,
  };
  
  const updateOperation: any = { $set: updateData };

  if (brandId) {
    updateOperation.$set.brandId = new ObjectId(brandId);
  } else {
    updateOperation.$unset = { brandId: "" };
  }

  const result = await productsCollection.updateOne({ _id: new ObjectId(id) }, updateOperation);

  if (result.matchedCount === 0) {
      notFound();
  }

  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/');
  revalidateTag('products');
  if (id) revalidateTag(`product-${id}`);
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
    revalidateTag('products');
    if (id) revalidateTag(`product-${id}`);
}

export async function getDashboardData() {
    const db = await getDb();
    if (!db) return {
        totalRevenue: 0, totalSales: 0, totalProducts: 0, totalCustomers: 0,
        pendingOrders: 0, lowStockProducts: 0, totalCategories: 0, totalBrands: 0,
        ordersByStatus: { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 },
        salesData: [], recentOrders: [], topProducts: [],
        revenueGrowth: 0, salesGrowth: 0, customerGrowth: 0,
    };

    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');
    const usersCollection = db.collection('users');
    const categoriesCollection = db.collection('categories');
    const brandsCollection = db.collection('brands');

    // Get current and previous month boundaries
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Run all queries in parallel for performance
    const [
        totalProducts,
        totalCustomers,
        totalCategories,
        totalBrands,
        revenueResult,
        totalSales,
        pendingOrders,
        orderStatusCounts,
        salesByMonth,
        recentOrdersDocs,
        lowStockResult,
        topProductsResult,
        currentMonthRevenue,
        previousMonthRevenue,
        currentMonthSales,
        previousMonthSales,
        currentMonthCustomers,
        previousMonthCustomers,
    ] = await Promise.all([
        productsCollection.countDocuments(),
        usersCollection.countDocuments(),
        categoriesCollection.countDocuments(),
        brandsCollection.countDocuments(),
        ordersCollection.aggregate([
            { $match: { status: { $in: ['Delivered', 'Shipped', 'Processing'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
        ]).toArray(),
        ordersCollection.countDocuments({ status: { $in: ['Delivered', 'Shipped', 'Processing'] } }),
        ordersCollection.countDocuments({ status: 'Pending' }),
        ordersCollection.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).toArray(),
        ordersCollection.aggregate([
            { $project: { month: { $month: "$date" }, year: { $year: "$date" }, total: "$total" } },
            { $group: { _id: { month: "$month", year: "$year" }, total: { $sum: "$total" } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).toArray(),
        ordersCollection.find({}).sort({ date: -1 }).limit(7).toArray(),
        productsCollection.aggregate([
            { $unwind: '$variants' },
            { $match: { 'variants.stock': { $lte: 5 } } },
            { $group: { _id: '$_id' } },
            { $count: 'count' }
        ]).toArray(),
        ordersCollection.aggregate([
            { $match: { status: { $in: ['Delivered', 'Shipped', 'Processing'] } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.productId', totalSold: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]).toArray(),
        // Current month revenue
        ordersCollection.aggregate([
            { $match: { date: { $gte: startOfCurrentMonth }, status: { $in: ['Delivered', 'Shipped', 'Processing'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]).toArray(),
        // Previous month revenue
        ordersCollection.aggregate([
            { $match: { date: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth }, status: { $in: ['Delivered', 'Shipped', 'Processing'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]).toArray(),
        // Current month sales count
        ordersCollection.countDocuments({ date: { $gte: startOfCurrentMonth }, status: { $in: ['Delivered', 'Shipped', 'Processing'] } }),
        // Previous month sales count
        ordersCollection.countDocuments({ date: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth }, status: { $in: ['Delivered', 'Shipped', 'Processing'] } }),
        // Current month new customers
        usersCollection.countDocuments({ registeredAt: { $gte: startOfCurrentMonth } }),
        // Previous month new customers
        usersCollection.countDocuments({ registeredAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } }),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const lowStockProducts = lowStockResult.length > 0 ? lowStockResult[0].count : 0;

    // Build order status breakdown
    const ordersByStatus = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orderStatusCounts.forEach((s: any) => {
        if (s._id in ordersByStatus) {
            (ordersByStatus as any)[s._id] = s.count;
        }
    });

    // Build monthly sales data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = now.getFullYear();
    const salesData = monthNames.map((name, index) => {
        const monthData = salesByMonth.find((d: any) => d._id.month === index + 1 && d._id.year === currentYear);
        return { name, total: monthData ? monthData.total : 0 };
    });

    // Enrich top products with names
    let topProducts: { name: string; sold: number; revenue: number }[] = [];
    if (topProductsResult.length > 0) {
        const productIds = topProductsResult.map((p: any) => {
            try { return new ObjectId(p._id); } catch { return null; }
        }).filter((id): id is ObjectId => id !== null);
        const productDocs = await productsCollection.find({ _id: { $in: productIds } }).toArray();
        const productNameMap = new Map(productDocs.map(p => [p._id.toString(), p.name]));
        topProducts = topProductsResult.map((p: any) => ({
            name: productNameMap.get(p._id) || 'Unknown Product',
            sold: p.totalSold,
            revenue: p.totalRevenue,
        }));
    }

    // Calculate growth percentages
    const curRevenue = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;
    const prevRevenue = previousMonthRevenue.length > 0 ? previousMonthRevenue[0].total : 0;
    const revenueGrowth = prevRevenue > 0 ? ((curRevenue - prevRevenue) / prevRevenue) * 100 : (curRevenue > 0 ? 100 : 0);
    const salesGrowth = previousMonthSales > 0 ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : (currentMonthSales > 0 ? 100 : 0);
    const customerGrowth = previousMonthCustomers > 0 ? ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 : (currentMonthCustomers > 0 ? 100 : 0);

    return {
        totalRevenue,
        totalSales,
        totalProducts,
        totalCustomers,
        pendingOrders,
        lowStockProducts,
        totalCategories,
        totalBrands,
        ordersByStatus,
        salesData,
        recentOrders: recentOrdersDocs.map(t => ({
            id: t._id.toString(),
            name: t.customerName,
            email: t.email,
            amount: t.total,
            status: t.status as string,
            date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
        })),
        topProducts,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        salesGrowth: Math.round(salesGrowth * 10) / 10,
        customerGrowth: Math.round(customerGrowth * 10) / 10,
    }
}

export async function importProducts(formData: FormData): Promise<{message: string}> {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No Excel file uploaded.');
    }

    const db = await getDb();
    if (!db) {
        throw new Error("Database not connected.");
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
        return { message: "The uploaded file is empty or in the wrong format." };
    }

    const categoriesCollection = db.collection<Category>('categories');
    const brandsCollection = db.collection<Brand>('brands');
    const productsCollection = db.collection<Product>('products');

    const existingCategories = await categoriesCollection.find({}).toArray();
    const categoryMap = new Map(existingCategories.map(c => [c.name.toLowerCase(), c._id]));

    const existingBrands = await brandsCollection.find({}).toArray();
    const brandMap = new Map(existingBrands.map(b => [b.name.toLowerCase(), b._id]));

    const existingProducts = await productsCollection
        .find({}, { projection: { name: 1, slug: 1 } })
        .toArray();
    const existingNames = new Set(
        existingProducts.map((p) => p.name.toLowerCase().trim())
    );
    const existingSlugs = new Set(
        existingProducts
            .map((p) => p.slug?.toLowerCase().trim())
            .filter((s): s is string => Boolean(s))
    );
    const seenInImport = new Set<string>();
    
    const productsToInsert: Record<string, unknown>[] = [];
    let errorCount = 0;
    let skippedDuplicateCount = 0;

    for (const rawRow of data as Record<string, unknown>[]) {
        const row = normalizeImportRow(rawRow);
        try {
            const name = row.name?.toString().trim();
            const categoryName = row.category?.toString().trim();

            if (!name || !categoryName) {
                console.warn("Skipping row due to missing Name or Category:", rawRow);
                errorCount++;
                continue;
            }

            const price = getImportPrice(row);
            if (price === undefined) {
                console.warn(`Skipping product "${name}" due to missing Price.`);
                errorCount++;
                continue;
            }

            let categoryId;
            const lowerCategoryName = categoryName.toLowerCase();
            if (categoryMap.has(lowerCategoryName)) {
                categoryId = categoryMap.get(lowerCategoryName);
            } else {
                const newCategory: Omit<Category, 'id'> = { name: categoryName, createdAt: new Date() };
                const result = await categoriesCollection.insertOne(newCategory as any);
                categoryId = result.insertedId;
                categoryMap.set(lowerCategoryName, categoryId);
            }

            let variants: ProductVariant[];
            try {
                variants = parseImportVariants(row, price);
            } catch {
                console.warn(`Skipping product "${name}" due to invalid Variants.`);
                errorCount++;
                continue;
            }

            let brandId: ObjectId | undefined;
            const brandName = row.brand?.toString().trim();
            if (brandName && !isPlaceholderText(brandName)) {
                const lowerBrandName = brandName.toLowerCase();
                if (brandMap.has(lowerBrandName)) {
                    brandId = brandMap.get(lowerBrandName);
                } else {
                    const result = await brandsCollection.insertOne({
                        name: brandName,
                        logo: PLACEHOLDER_BRAND_LOGO,
                        createdAt: new Date(),
                    } as any);
                    brandId = result.insertedId;
                    brandMap.set(lowerBrandName, brandId);
                }
            }

            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const nameKey = name.toLowerCase();

            if (
                existingNames.has(nameKey) ||
                existingSlugs.has(slug) ||
                seenInImport.has(nameKey) ||
                seenInImport.has(slug)
            ) {
                skippedDuplicateCount++;
                continue;
            }
            seenInImport.add(nameKey);
            seenInImport.add(slug);

            const description = isPlaceholderText(row.description) ? '' : row.description?.toString() ?? '';
            const unitType = getImportUnitType(row);

            const productData: Record<string, unknown> = {
                name,
                slug,
                categoryId,
                isFeatured: parseBool(row.isfeatured, false),
                isOrganic: parseBool(row.isorganic, false),
                isDeal: getImportIsDeal(row),
                images: [],
                variants,
                createdAt: new Date(),
                reviews: [],
                rating: 0,
            };

            if (description) productData.description = description;
            if (unitType) productData.unitType = unitType;
            if (brandId) productData.brandId = brandId;

            productsToInsert.push(productData);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            console.error("Error processing row:", rawRow, message);
            errorCount++;
        }
    }

    if (productsToInsert.length > 0) {
        await productsCollection.insertMany(productsToInsert as any[]);
    }
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    let message = `${productsToInsert.length} product(s) created.`;
    if (skippedDuplicateCount > 0) {
        message += ` ${skippedDuplicateCount} duplicate(s) skipped (already in store or repeated in file).`;
    }
    if (errorCount > 0) message += ` ${errorCount} row(s) had errors and were skipped.`;
    
    return { message };
}

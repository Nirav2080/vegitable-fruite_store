
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import { blogPosts, products as staticProducts } from '@/lib/data';

// Simulate a database
let products: Product[] = [...staticProducts];

const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  longDescription: z.string().min(20, { message: "Long description must be at least 20 characters." }),
  price: z.coerce.number().min(0.01, { message: "Price must be a positive number." }),
  category: z.enum(['Fruits', 'Vegetables', 'Organic Boxes']),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  isOrganic: z.boolean().default(false),
  isSeasonal: z.boolean().default(false),
  images: z.string().min(1, { message: "Please add at least one image URL."}),
});

export async function getProducts(): Promise<Product[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return JSON.parse(JSON.stringify(products));
}

export async function searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!query) {
        return [];
    }
    return JSON.parse(JSON.stringify(products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))));
}


export async function getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const product = products.find(p => p.id === id);
    if (!product) {
        return null;
    }
    return JSON.parse(JSON.stringify(product));
}


export async function createProduct(data: unknown) {
    const parsedData = productSchema.parse(data);
    
    const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: new Date().getTime().toString(),
      ...parsedData,
      images: parsedData.images.split(',').map(s => s.trim()).filter(Boolean),
      slug,
      rating: Math.floor(Math.random() * (5 - 3 + 1)) + 3, // default rating
      reviews: Math.floor(Math.random() * 100), // default reviews
      createdAt: new Date(),
    };

    products.unshift(newProduct);
    
    revalidatePath('/admin/products');
    revalidatePath('/products');
}

export async function updateProduct(id: string, data: unknown) {
  const parsedData = productSchema.parse(data);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
      notFound();
  }

  const slug = parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updatedProduct: Product = {
      ...products[productIndex],
      ...parsedData,
      images: parsedData.images.split(',').map(s => s.trim()).filter(Boolean),
      slug,
  };

  products[productIndex] = updatedProduct;

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
}

export async function deleteProduct(id: string) {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        notFound();
    }
    products.splice(productIndex, 1);

    revalidatePath('/admin/products');
    revalidatePath('/products');
}

export async function getDashboardData() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const currentProducts = products;

    const totalRevenue = currentProducts.reduce((acc, p) => acc + (p.price * (Math.floor(Math.random() * 50))), 0);
    const totalSales = currentProducts.reduce((acc, p) => acc + (Math.floor(Math.random() * 50)), 0);
    const totalProducts = currentProducts.length;

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

    const recentTransactions = currentProducts.slice(0, 5).map(p => ({
        id: p.id,
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

// Seeding function - not used with in-memory data
export async function seedDatabase() {
  // This function is not needed when using in-memory static data
  return;
}

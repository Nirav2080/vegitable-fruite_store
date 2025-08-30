
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';

// Simulate a database
let products: Product[] = [
      {
        id: '1001',
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
        createdAt: new Date('2023-10-01'),
      },
      {
        id: '1002',
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
        createdAt: new Date('2023-10-02'),
      },
      {
        id: '1003',
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
        createdAt: new Date('2023-10-03'),
      },
      {
        id: '1004',
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
        createdAt: new Date('2023-10-04'),
      },
      {
        id: '1005',
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
        createdAt: new Date('2023-10-05'),
      },
       {
        id: '1006',
        slug: 'fresh-broccoli',
        name: 'Fresh Broccoli',
        description: 'Nutrient-dense and great for steaming or stir-frying.',
        longDescription: 'This fresh broccoli is harvested at its peak to ensure maximum flavor and nutritional value. With its firm stalks and vibrant green florets, it\'s a versatile vegetable that can be steamed, roasted, or added to stir-fries. A fantastic source of vitamins K and C.',
        price: 3.20,
        images: ['https://picsum.photos/seed/broccoli/800/800'],
        category: 'Vegetables',
        isOrganic: false,
        isSeasonal: false,
        stock: 90,
        rating: 4.5,
        reviews: 75,
        createdAt: new Date('2023-10-06'),
      },
      {
        id: '1007',
        slug: 'seasonal-organic-box',
        name: 'Seasonal Organic Box',
        description: 'A curated mix of the best seasonal organic produce.',
        longDescription: 'Our Seasonal Organic Box is a fantastic way to enjoy the best of what the season has to offer. Each week, we curate a selection of fresh, certified organic fruits and vegetables from our partner farms. The contents vary based on availability, ensuring you always get the freshest, most flavorful produce.',
        price: 55.00,
        images: ['https://picsum.photos/seed/box/800/800', 'https://picsum.photos/seed/box2/800/800'],
        category: 'Organic Boxes',
        isOrganic: true,
        isSeasonal: true,
        stock: 50,
        rating: 4.9,
        reviews: 150,
        createdAt: new Date('2023-10-07'),
      },
      {
        id: '1008',
        slug: 'mixed-leaf-salad',
        name: 'Mixed Leaf Salad',
        description: 'A fresh and zesty mix of organic salad greens.',
        longDescription: 'Ready for your favorite dressing, our Mixed Leaf Salad is a convenient and healthy choice. It features a blend of organic lettuce varieties, spinach, and rocket, offering a range of textures and flavors. Triple-washed and ready to eat.',
        price: 5.50,
        images: ['https://picsum.photos/seed/salad/800/800'],
        category: 'Vegetables',
        isOrganic: true,
        isSeasonal: false,
        stock: 110,
        rating: 4.7,
        reviews: 65,
        createdAt: new Date('2023-10-08'),
      },
  ];

const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
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
      longDescription: parsedData.description, // Keep for data consistency
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
      longDescription: parsedData.description, // Keep for data consistency
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

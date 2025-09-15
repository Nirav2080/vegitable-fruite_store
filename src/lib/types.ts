
import { ObjectId } from 'mongodb';

export interface Review {
    _id: ObjectId;
    author: string;
    avatar: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
}

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  icon?: string;
  createdAt: Date;
}

export interface Product {
  _id?: ObjectId;
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  category: string;
  brand?: string;
  isOrganic: boolean;
  isSeasonal: boolean;
  createdAt: Date;
  reviews: Review[];
  rating: number;
  variants: ProductVariant[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // Price at the time of order
  weight?: string; // To store which variant was purchased
}

export interface Order {
  _id?: ObjectId;
  id: string;
  customerName: string;
  email: string;
  date: Date;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

export interface User {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  registeredAt: Date;
  orderCount: number;
  totalSpent: number;
  mobile?: string;
  address?: string;
}

export interface Banner {
    _id?: ObjectId;
    id: string;
    supertitle: string;
    title: string;
    subtitle: string;
    image: string;
    href: string;
    isActive: boolean;
    createdAt: Date;
}

export interface CartItem extends Omit<Product, 'variants'> {
  quantity: number;
  selectedVariant: ProductVariant;
  // variants are not needed in cart item, selectedVariant holds the choice
}

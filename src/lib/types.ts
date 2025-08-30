
import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId;
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  category: 'Fruits' | 'Vegetables' | 'Organic Boxes';
  isOrganic: boolean;
  isSeasonal: boolean;
  stock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
}

export interface Blog {
  _id?: ObjectId;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // Price at the time of order
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
  avatar: string;
  registeredAt: Date;
  orderCount: number;
  totalSpent: number;
}

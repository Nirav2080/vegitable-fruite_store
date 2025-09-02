
import { ObjectId } from 'mongodb';

export interface Review {
    _id: ObjectId;
    author: string;
    avatar: string;
    rating: number;
    title: string;
    comment: string;
    date: Date;
}

export interface Product {
  _id?: ObjectId;
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'Fruits' | 'Vegetables' | 'Organic Boxes';
  isOrganic: boolean;
  isSeasonal: boolean;
  stock: number;
  createdAt: Date;
  reviews: Review[];
  rating: number;
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

export interface CartItem extends Product {
  quantity: number;
}

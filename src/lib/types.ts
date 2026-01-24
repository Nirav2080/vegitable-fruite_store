
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
  parentId?: string;
  parentName?: string;
  subcategories?: Category[];
}

export interface Product {
  _id?: ObjectId;
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string | ObjectId;
  category: string;
  brand?: string;
  unitType?: string;
  isOrganic: boolean;
  isFeatured: boolean;
  isDeal: boolean;
  isPopular: boolean;
  createdAt: Date;
  reviews: Review[];
  rating: number;
  variants: ProductVariant[];
}

export interface ProductSearchResult {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
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
  stripeSessionId?: string;
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

export interface Offer {
    _id?: ObjectId;
    id: string;
    title: string;
    description: string;
    code?: string;
    discount?: number;
    link: string;
    bgColor: string;
    isActive: boolean;
    createdAt: Date;
}

export interface CartItem extends Omit<Product, 'variants'> {
  quantity: number;
  selectedVariant: ProductVariant;
  // variants are not needed in cart item, selectedVariant holds the choice
}

export interface Attribute {
  _id?: ObjectId;
  id: string;
  name: string;
  values: string[];
  createdAt: Date;
}



export interface Product {
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
  id: string;
  customerName: string;
  email: string;
  date: Date;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

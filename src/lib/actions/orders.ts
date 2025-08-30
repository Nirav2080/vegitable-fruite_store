
'use server'

import type { Order } from '@/lib/types';
import { products } from '@/lib/data';

// Simulate a database of orders
const orders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Alice Johnson',
    email: 'alice@example.com',
    date: new Date('2024-07-28T10:30:00Z'),
    status: 'Delivered',
    total: 89.97,
    items: [
      { productId: '1001', quantity: 2, price: 6.99 },
      { productId: '1003', quantity: 1, price: 4.50 },
      { productId: '1007', quantity: 1, price: 55.00 },
    ]
  },
  {
    id: 'ORD002',
    customerName: 'Bob Williams',
    email: 'bob@example.com',
    date: new Date('2024-07-29T14:00:00Z'),
    status: 'Shipped',
    total: 13.99,
    items: [
      { productId: '1004', quantity: 1, price: 3.99 },
      { productId: '1005', quantity: 1, price: 7.50 },
    ]
  },
  {
    id: 'ORD003',
    customerName: 'Charlie Brown',
    email: 'charlie@example.com',
    date: new Date('2024-07-30T09:05:00Z'),
    status: 'Processing',
    total: 25.40,
    items: [
      { productId: '1002', quantity: 4, price: 2.50 },
      { productId: '1006', quantity: 2, price: 3.20 },
    ]
  },
  {
    id: 'ORD004',
    customerName: 'Diana Miller',
    email: 'diana@example.com',
    date: new Date('2024-07-30T11:20:00Z'),
    status: 'Pending',
    total: 5.50,
    items: [
      { productId: '1008', quantity: 1, price: 5.50 }
    ]
  },
    {
    id: 'ORD005',
    customerName: 'Ethan Davis',
    email: 'ethan@example.com',
    date: new Date('2024-07-25T18:00:00Z'),
    status: 'Cancelled',
    total: 11.49,
    items: [
      { productId: '1001', quantity: 1, price: 6.99 },
      { productId: '1003', quantity: 1, price: 4.50 },
    ]
  },
];

export async function getOrders(): Promise<Order[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return JSON.parse(JSON.stringify(orders));
}

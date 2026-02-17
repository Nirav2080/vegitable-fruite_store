
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import Link from "next/link";

export function OrdersTable({ data }: { data: Order[] }) {
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Processing': return 'secondary';
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'secondary';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  const getStatusClass = (status: Order['status']) => {
     switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)} className={getStatusClass(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(order.date), 'dd MMM yyyy')}
            </TableCell>
            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-border/60 shadow-lg">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                     <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                     </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

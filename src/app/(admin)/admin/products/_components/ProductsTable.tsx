
'use client'

import { useState } from 'react';
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteProduct } from '@/lib/actions/products';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function ProductsTable({ data }: { data: Product[] }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        if (!selectedProductId) return;
        try {
            await deleteProduct(selectedProductId);
            toast({
                title: "Success",
                description: "Product deleted successfully.",
            });
            router.refresh(); // Refresh data
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product.",
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedProductId(null);
        }
    };

    const openDeleteDialog = (id: string) => {
        setSelectedProductId(id);
        setIsDeleteDialogOpen(true);
    };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              Image
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                 <Image
                  alt={product.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://placehold.co/64x64/EEE/31343C'}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className={product.stock > 0 ? 'bg-green-100 text-green-800' : ''}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                       <Link href={`/admin/products/${product.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(product.id)} className='text-destructive focus:text-destructive'>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

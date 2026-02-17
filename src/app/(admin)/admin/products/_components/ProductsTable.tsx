
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
import { MoreHorizontal, Pencil, Trash2, ImageIcon } from "lucide-react";
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
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete product.",
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
            <TableHead>Display</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => {
            const defaultVariant = product.variants?.[0];
            const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) ?? 0;
            const inStock = totalStock > 0;

            return (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                {Array.isArray(product.images) && product.images.length > 0 ? (
                    <Image
                    alt={product.name}
                    className="aspect-square rounded-xl object-cover"
                    height="64"
                    src={product.images[0]}
                    width="64"
                    />
                ) : (
                    <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                  {product.isDeal && <Badge variant="outline">Deal</Badge>}
                  {product.isOrganic && <Badge variant="outline">Fresh</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={inStock ? "secondary" : "destructive"} className={inStock ? 'bg-green-100 text-green-800' : ''}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell>
                {defaultVariant ? `$${defaultVariant.price.toFixed(2)}` : 'N/A'}
              </TableCell>
              <TableCell>{totalStock}</TableCell>
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
                       <Link href={`/admin/products/${product.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(product.id)} className='text-destructive focus:text-destructive'>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-full bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

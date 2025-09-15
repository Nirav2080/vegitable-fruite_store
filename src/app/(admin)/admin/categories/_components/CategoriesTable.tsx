
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
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";
import type { Category } from '@/lib/types';
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
import { deleteCategory } from '@/lib/actions/categories';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function CategoriesTable({ data }: { data: Category[] }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        if (!selectedCategoryId) return;
        try {
            await deleteCategory(selectedCategoryId);
            toast({
                title: "Success",
                description: "Category deleted successfully.",
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete category. Make sure no products are using it.",
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedCategoryId(null);
        }
    };

    const openDeleteDialog = (id: string) => {
        setSelectedCategoryId(id);
        setIsDeleteDialogOpen(true);
    };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                  <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-muted">
                    {category.icon ? (
                      <Image 
                        src={category.icon}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
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
                       <Link href={`/admin/categories/${category.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(category.id)} className='text-destructive focus:text-destructive'>
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
              This action cannot be undone. This will permanently delete this category.
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

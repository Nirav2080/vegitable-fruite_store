
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
import { Pencil, Trash2, ImageIcon } from "lucide-react";
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
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete category.",
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

    const categoriesWithParents = data.map(category => {
        const parent = data.find(p => p.id === category.parentId);
        return { ...category, parentName: parent ? parent.name : null };
    });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoriesWithParents.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                  <div className="w-10 h-10 border border-border/30 rounded-xl flex items-center justify-center bg-muted">
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
              <TableCell className="text-muted-foreground">{category.parentName || '—'}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="icon" className="rounded-xl">
                       <Link href={`/admin/categories/${category.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-xl" onClick={() => openDeleteDialog(category.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-border/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

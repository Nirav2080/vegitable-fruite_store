
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
import type { Brand } from '@/lib/types';
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
import { deleteBrand } from '@/lib/actions/brands';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function BrandsTable({ data }: { data: Brand[] }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        if (!selectedBrandId) return;
        try {
            await deleteBrand(selectedBrandId);
            toast({
                title: "Success",
                description: "Brand deleted successfully.",
            });
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Error",
                description: String(error.message || "Failed to delete brand."),
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedBrandId(null);
        }
    };

    const openDeleteDialog = (id: string) => {
        setSelectedBrandId(id);
        setIsDeleteDialogOpen(true);
    };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>
                  <div className="w-12 h-12 border border-border/30 rounded-xl flex items-center justify-center bg-muted">
                    {brand.logo ? (
                      <Image 
                        src={brand.logo}
                        alt={brand.name}
                        width={48}
                        height={48}
                        className="object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
              </TableCell>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="icon" className="rounded-xl">
                       <Link href={`/admin/brands/${brand.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-xl" onClick={() => openDeleteDialog(brand.id)}>
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
              This action cannot be undone. This will permanently delete this brand. Any products associated with this brand will remain but will no longer be linked to it.
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

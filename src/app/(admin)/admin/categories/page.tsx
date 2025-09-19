
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/lib/cached-data";
import { CategoriesTable } from "./_components/CategoriesTable";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Category
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            Add, edit, or remove product categories for your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <CategoriesTable data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/lib/cached-data";
import { CategoriesTable } from "./_components/CategoriesTable";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const parents = categories.filter(c => !c.parentId).length;
  const subs = categories.filter(c => c.parentId).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} categories · {parents} parent · {subs} subcategories</p>
        </div>
        <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Category
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>Organize your products into categories for easy browsing.</CardDescription>
        </CardHeader>
        <CardContent>
            <CategoriesTable data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}

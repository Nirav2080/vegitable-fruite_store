
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getBrands } from "@/lib/cached-data";
import { BrandsTable } from "./_components/BrandsTable";

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">{brands.length} brands in your store</p>
        </div>
        <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          <Link href="/admin/brands/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Brand
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>Manage Brands</CardTitle>
          <CardDescription>Add and manage product brands for your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
            <BrandsTable data={brands} />
        </CardContent>
      </Card>
    </div>
  );
}

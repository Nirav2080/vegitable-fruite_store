
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Upload, Package, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/cached-data";
import { ProductsTable } from "./_components/ProductsTable";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const totalStock = products.reduce((acc, p) => acc + (p.variants?.reduce((a, v) => a + v.stock, 0) ?? 0), 0);
  const outOfStock = products.filter(p => (p.variants?.reduce((a, v) => a + v.stock, 0) ?? 0) === 0).length;
  const lowStock = products.filter(p => {
    const stock = p.variants?.reduce((a, v) => a + v.stock, 0) ?? 0;
    return stock > 0 && stock <= 5;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products · {totalStock} total stock</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full border-border/60 transition-all duration-300 hover:shadow-sm">
                <Link href="/admin/products/import">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                </Link>
            </Button>
            <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
                <Link href="/admin/products/new">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Product
                </Link>
            </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {(outOfStock > 0 || lowStock > 0) && (
        <div className="flex gap-3">
          {outOfStock > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
              <AlertTriangle className="h-4 w-4" />
              {outOfStock} out of stock
            </div>
          )}
          {lowStock > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
              <Package className="h-4 w-4" />
              {lowStock} low stock
            </div>
          )}
        </div>
      )}

      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage your product catalog, pricing, and inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable data={products} />
        </CardContent>
      </Card>
    </div>
  );
}

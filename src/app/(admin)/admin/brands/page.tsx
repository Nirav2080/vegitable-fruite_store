
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getBrands } from "@/lib/cached-data";
import { BrandsTable } from "./_components/BrandsTable";

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Brands</h1>
        <Button asChild>
          <Link href="/admin/brands/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Brand
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Brands</CardTitle>
          <CardDescription>
            Add, edit, or remove product brands for your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <BrandsTable data={brands} />
        </CardContent>
      </Card>
    </div>
  );
}

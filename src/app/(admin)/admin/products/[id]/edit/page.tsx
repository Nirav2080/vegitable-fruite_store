
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "../../_components/ProductForm";
import { getProductById } from "@/lib/cached-data";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string }}) {
  const product = await getProductById(params.id);
  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Product</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "../_components/ProductForm";
import { getCategories } from "@/lib/actions/categories";


export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Product</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandForm } from "../../_components/BrandForm";
import { getBrandById } from "@/lib/cached-data";
import { notFound } from "next/navigation";

export default async function EditBrandPage({ params }: { params: { id: string }}) {
  const brand = await getBrandById(params.id);
  if (!brand) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Brand</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandForm brand={brand} />
        </CardContent>
      </Card>
    </div>
  );
}

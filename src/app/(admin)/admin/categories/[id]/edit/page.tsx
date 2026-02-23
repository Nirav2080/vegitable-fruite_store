
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "../../_components/CategoryForm";
import { getCategoryById } from "@/lib/cached-data";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: { id: string }}) {
  const category = await getCategoryById(params.id);
  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Category</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  );
}

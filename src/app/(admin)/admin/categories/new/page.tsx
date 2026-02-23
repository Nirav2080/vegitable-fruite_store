
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "../_components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Category</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  );
}

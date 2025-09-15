
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "../_components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
      <Card>
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

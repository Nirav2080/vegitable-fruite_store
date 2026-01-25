
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandForm } from "../_components/BrandForm";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Brand</h1>
      <Card>
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandForm />
        </CardContent>
      </Card>
    </div>
  );
}

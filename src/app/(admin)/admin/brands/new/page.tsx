
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandForm } from "../_components/BrandForm";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight font-headline mb-6">Add New Brand</h1>
      <Card className="rounded-2xl border-border/60">
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

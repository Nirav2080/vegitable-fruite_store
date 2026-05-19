import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportForm } from "../_components/ImportForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ImportProductsPage() {
  const exampleJson = `[{"weight":"500g","price":12.99,"stock":50}]`;
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Import Products</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Bulk Product Upload</CardTitle>
          <CardDescription>
            Upload an Excel file to add new products in bulk. Duplicates are skipped. Add images later from the product edit page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Excel file structure</AlertTitle>
            <AlertDescription>
                <p>First row must be headers. Required columns:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li><strong>Name</strong> — product name</li>
                    <li><strong>Category</strong> — created automatically if missing</li>
                    <li><strong>Price</strong> or numeric <strong>isDeal</strong> column — selling price (your sheet may use isDeal for price)</li>
                </ul>
                <p className="mt-3">Optional columns:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li><strong>Description</strong></li>
                    <li><strong>Brand</strong> — created if it does not exist (skip placeholder values like &quot;Text&quot;)</li>
                    <li><strong>isFeatured</strong>, <strong>isOrganic</strong>, <strong>isDeal</strong> — TRUE/FALSE (if isDeal is a number, it is treated as price)</li>
                    <li><strong>Variants</strong> — unit label such as <code>Quantity</code>, <code>Weight (kg)</code>, <code>Each</code>; or JSON array: <code>{exampleJson}</code></li>
                    <li><strong>Stock</strong> — default 100 if omitted</li>
                </ul>
            </AlertDescription>
          </Alert>

          <ImportForm />
        </CardContent>
      </Card>
    </div>
  );
}

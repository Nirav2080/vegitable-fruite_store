
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportForm } from "../_components/ImportForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ImportProductsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Import Products</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bulk Product Upload</CardTitle>
          <CardDescription>
            Upload an Excel file to add or update products in bulk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Excel File Structure</AlertTitle>
            <AlertDescription>
                <p>Your Excel file must have a header row with the following columns:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li><strong>Name</strong> (Text): The product name.</li>
                    <li><strong>Description</strong> (Text): Product description.</li>
                    <li><strong>Category</strong> (Text): The category name. Will be created if it doesn't exist.</li>
                    <li><strong>Brand</strong> (Text, Optional): The brand name. Will be created if it doesn't exist.</li>
                    <li><strong>isFeatured</strong> (TRUE/FALSE, Optional): Show on homepage as a popular product.</li>
                    <li><strong>isOrganic</strong> (TRUE/FALSE, Optional): Show in "Fresh" sections.</li>
                    <li><strong>isDeal</strong> (TRUE/FALSE, Optional): Show in "Deals" sections.</li>
                    <li><strong>Images</strong> (Text, Optional): Comma-separated list of public image URLs.</li>
                    <li><strong>Variants</strong> (Text, JSON): A JSON string of the variants array. E.g., <code>[{"weight":"500g","price":12.99,"stock":50}]</code></li>
                </ul>
            </AlertDescription>
          </Alert>

          <ImportForm />
        </CardContent>
      </Card>
    </div>
  );
}

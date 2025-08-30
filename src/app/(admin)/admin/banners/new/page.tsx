
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BannerForm } from "../_components/BannerForm";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Banner</h1>
      <Card>
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerForm />
        </CardContent>
      </Card>
    </div>
  );
}

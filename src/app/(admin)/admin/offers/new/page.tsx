
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfferForm } from "../_components/OfferForm";

export default function NewOfferPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Offer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <OfferForm />
        </CardContent>
      </Card>
    </div>
  );
}

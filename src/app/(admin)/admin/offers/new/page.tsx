
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfferForm } from "../_components/OfferForm";

export default function NewOfferPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight font-headline mb-6">Add New Offer</h1>
      <Card className="rounded-2xl border-border/60">
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


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfferForm } from "../../_components/OfferForm";
import { getOfferById } from "@/lib/cached-data";
import { notFound } from "next/navigation";

export default async function EditOfferPage({ params }: { params: { id: string }}) {
  const offer = await getOfferById(params.id);
  if (!offer) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Offer</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <OfferForm offer={offer} />
        </CardContent>
      </Card>
    </div>
  );
}

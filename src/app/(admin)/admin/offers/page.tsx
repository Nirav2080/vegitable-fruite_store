
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getOffers } from "@/lib/cached-data";
import { OffersTable } from "./_components/OffersTable";

export default async function AdminOffersPage() {
  const offers = await getOffers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Offers</h1>
        <Button asChild>
          <Link href="/admin/offers/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Offer
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Offers</CardTitle>
          <CardDescription>
            Add, edit, or remove promotional offers from your homepage deals section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OffersTable data={offers} />
        </CardContent>
      </Card>
    </div>
  );
}

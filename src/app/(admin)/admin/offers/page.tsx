
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getOffers } from "@/lib/cached-data";
import { OffersTable } from "./_components/OffersTable";

export default async function AdminOffersPage() {
  const offers = await getOffers();
  const active = offers.filter(o => o.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">{offers.length} offers · {active} active</p>
        </div>
        <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          <Link href="/admin/offers/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Offer
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>Manage Offers</CardTitle>
          <CardDescription>Create promotional offers and discounts for your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <OffersTable data={offers} />
        </CardContent>
      </Card>
    </div>
  );
}

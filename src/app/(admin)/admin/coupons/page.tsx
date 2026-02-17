
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Ticket, Construction, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">Discount codes and promotional coupons</p>
        </div>
        <Button disabled className="rounded-full shadow-lg shadow-primary/25">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Coupon
        </Button>
      </div>

      <Card className="rounded-2xl border-border/60 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-4">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-1">Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">Coupon management is under development. For now, you can create promotional offers from the Offers page.</p>
          <Button asChild variant="outline" className="rounded-full border-border/60">
            <Link href="/admin/offers">
              Go to Offers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

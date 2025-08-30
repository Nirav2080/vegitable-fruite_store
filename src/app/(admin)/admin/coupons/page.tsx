
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdminCouponsPage() {
  return (
    <div>
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Coupon
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Coupons</CardTitle>
          <CardDescription>
            Create and manage discount codes for your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Coupon management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCouponsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Coupons</h1>
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

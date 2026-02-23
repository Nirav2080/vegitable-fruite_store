
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/lib/cached-data";
import { OrdersTable } from "./_components/OrdersTable";
import { File, Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const statusCounts = {
    Pending: orders.filter(o => o.status === 'Pending').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const statusCards = [
    { label: 'Pending', count: statusCounts.Pending, icon: Clock, gradient: 'from-yellow-500/10 to-amber-500/10', iconColor: 'text-yellow-600', borderColor: 'border-yellow-200' },
    { label: 'Processing', count: statusCounts.Processing, icon: Package, gradient: 'from-blue-500/10 to-indigo-500/10', iconColor: 'text-blue-600', borderColor: 'border-blue-200' },
    { label: 'Shipped', count: statusCounts.Shipped, icon: Truck, gradient: 'from-purple-500/10 to-violet-500/10', iconColor: 'text-purple-600', borderColor: 'border-purple-200' },
    { label: 'Delivered', count: statusCounts.Delivered, icon: CheckCircle2, gradient: 'from-emerald-500/10 to-green-500/10', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
    { label: 'Cancelled', count: statusCounts.Cancelled, icon: XCircle, gradient: 'from-red-500/10 to-rose-500/10', iconColor: 'text-red-600', borderColor: 'border-red-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
        </div>
        <Button className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <File className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusCards.map((s) => (
          <Card key={s.label} className={`rounded-2xl border-border/30 bg-gradient-to-br ${s.gradient}`}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/80 ${s.iconColor}`}>
                <s.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight leading-none">{s.count}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage and track your store&apos;s orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable data={orders} />
        </CardContent>
      </Card>
    </div>
  );
}

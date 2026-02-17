
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getDashboardData } from "@/lib/cached-data";
import {
  DollarSign, Package, Users, CreditCard, ShoppingCart, TrendingUp,
  TrendingDown, AlertTriangle, ArrowUpRight, Clock, CheckCircle2,
  Truck, XCircle, Tag, Award, BarChart3,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalesChartClient } from "./_components/SalesChartClient";

function GrowthIndicator({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-muted-foreground">No change</span>;
  const isPositive = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isPositive ? '+' : ''}{value}%
    </span>
  );
}

function getStatusBadge(status: string) {
  const map: Record<string, { className: string; icon: React.ReactNode }> = {
    Pending: { className: "border-yellow-300 bg-yellow-50 text-yellow-700", icon: <Clock className="h-3 w-3" /> },
    Processing: { className: "border-blue-300 bg-blue-50 text-blue-700", icon: <Package className="h-3 w-3" /> },
    Shipped: { className: "border-purple-300 bg-purple-50 text-purple-700", icon: <Truck className="h-3 w-3" /> },
    Delivered: { className: "border-emerald-300 bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="h-3 w-3" /> },
    Cancelled: { className: "border-red-300 bg-red-50 text-red-700", icon: <XCircle className="h-3 w-3" /> },
  };
  const s = map[status] || map.Pending;
  return (
    <Badge variant="outline" className={`gap-1 rounded-full ${s.className}`}>
      {s.icon}{status}
    </Badge>
  );
}

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const totalOrders = Object.values(data.ordersByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here&apos;s an overview of your store.</p>
      </div>

      {/* Alert Strip */}
      {(data.pendingOrders > 0 || data.lowStockProducts > 0) && (
        <div className="flex flex-wrap gap-3">
          {data.pendingOrders > 0 && (
            <Link href="/admin/orders" className="group">
              <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 transition-all hover:shadow-md hover:shadow-yellow-100">
                <Clock className="h-4 w-4" />
                {data.pendingOrders} pending order{data.pendingOrders > 1 ? 's' : ''} need attention
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          )}
          {data.lowStockProducts > 0 && (
            <Link href="/admin/products" className="group">
              <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition-all hover:shadow-md hover:shadow-red-100">
                <AlertTriangle className="h-4 w-4" />
                {data.lowStockProducts} product{data.lowStockProducts > 1 ? 's' : ''} low on stock
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold tracking-tight">${data.totalRevenue.toFixed(2)}</div>
            <div className="mt-1">
              <GrowthIndicator value={data.revenueGrowth} />
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold tracking-tight">{data.totalSales}</div>
            <div className="mt-1">
              <GrowthIndicator value={data.salesGrowth} />
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-110">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold tracking-tight">{data.totalCustomers}</div>
            <div className="mt-1">
              <GrowthIndicator value={data.customerGrowth} />
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-110">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold tracking-tight">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.totalCategories} categories · {data.totalBrands} brands
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Order Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Sales Overview
              </CardTitle>
              <CardDescription className="mt-1">Monthly revenue performance</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChartClient data={data.salesData} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Order Status
            </CardTitle>
            <CardDescription>{totalOrders} total orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Delivered', count: data.ordersByStatus.Delivered, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'Shipped', count: data.ordersByStatus.Shipped, color: 'bg-purple-500', textColor: 'text-purple-700' },
              { label: 'Processing', count: data.ordersByStatus.Processing, color: 'bg-blue-500', textColor: 'text-blue-700' },
              { label: 'Pending', count: data.ordersByStatus.Pending, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
              { label: 'Cancelled', count: data.ordersByStatus.Cancelled, color: 'bg-red-500', textColor: 'text-red-700' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className={`font-semibold ${item.textColor}`}>{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: totalOrders > 0 ? `${(item.count / totalOrders) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full border-border/60">
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.name}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right font-semibold">${order.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {data.recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No orders yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Products
            </CardTitle>
            <CardDescription>Best selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
                    ${index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-100 text-slate-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'}`}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">${product.revenue.toFixed(0)}</span>
                </div>
              ))}
              {data.topProducts.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-6">No sales data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/admin/products/new', icon: Package, label: 'Add Product', color: 'from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20', iconColor: 'text-emerald-600' },
          { href: '/admin/orders', icon: ShoppingCart, label: 'View Orders', color: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20', iconColor: 'text-blue-600' },
          { href: '/admin/categories/new', icon: Tag, label: 'Add Category', color: 'from-purple-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20', iconColor: 'text-purple-600' },
          { href: '/admin/banners/new', icon: Award, label: 'Add Banner', color: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20', iconColor: 'text-amber-600' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className={`rounded-2xl border-border/60 bg-gradient-to-br ${item.color} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}>
              <CardContent className="flex flex-col items-center justify-center py-6 gap-2">
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

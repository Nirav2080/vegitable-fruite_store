
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, ShoppingBag, Construction } from "lucide-react";

export default function AdminAnalyticsPage() {
  const features = [
    { icon: BarChart3, title: "Revenue Reports", description: "Track daily, weekly, and monthly revenue trends", color: "from-emerald-500 to-green-600" },
    { icon: TrendingUp, title: "Sales Analytics", description: "Analyze product performance and conversion rates", color: "from-blue-500 to-indigo-600" },
    { icon: Users, title: "Customer Insights", description: "Understand customer behavior and retention", color: "from-purple-500 to-violet-600" },
    { icon: ShoppingBag, title: "Inventory Reports", description: "Monitor stock levels and product movement", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">In-depth insights into your store performance</p>
      </div>

      <Card className="rounded-2xl border-border/30 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-4">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-1">Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md">The analytics dashboard is being built. In the meantime, check the Dashboard for key metrics.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.title} className="rounded-2xl border-border/30">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className={`rounded-xl bg-gradient-to-br ${f.color} p-2.5 text-white shadow-lg`}>
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

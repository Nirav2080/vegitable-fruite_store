
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getBanners } from "@/lib/cached-data";
import { BannersTable } from "./_components/BannersTable";

export default async function AdminBannersPage() {
  const banners = await getBanners();
  const active = banners.filter(b => b.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">{banners.length} banners · {active} active</p>
        </div>
        <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          <Link href="/admin/banners/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Banner
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>Manage Banners</CardTitle>
          <CardDescription>Control the hero carousel banners displayed on your homepage.</CardDescription>
        </CardHeader>
        <CardContent>
          <BannersTable data={banners} />
        </CardContent>
      </Card>
    </div>
  );
}

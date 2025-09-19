
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getBanners } from "@/lib/cached-data";
import { BannersTable } from "./_components/BannersTable";

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Button asChild>
          <Link href="/admin/banners/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Banner
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Banners</CardTitle>
          <CardDescription>
            Add, edit, or remove promotional banners from your homepage hero section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BannersTable data={banners} />
        </CardContent>
      </Card>
    </div>
  );
}

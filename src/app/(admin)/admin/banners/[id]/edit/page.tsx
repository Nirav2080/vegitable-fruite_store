
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BannerForm } from "../../_components/BannerForm";
import { getBannerById } from "@/lib/cached-data";
import { notFound } from "next/navigation";

export default async function EditBannerPage({ params }: { params: { id: string }}) {
  const banner = await getBannerById(params.id);
  if (!banner) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Banner</h1>
      <Card className="rounded-2xl border-border/30">
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerForm banner={banner} />
        </CardContent>
      </Card>
    </div>
  );
}

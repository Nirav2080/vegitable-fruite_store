
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBannersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Banners</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Banners</CardTitle>
          <CardDescription>
            Add, edit, or remove promotional banners from your homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Banner management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

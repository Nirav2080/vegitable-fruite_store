
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMenuPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Header Menu</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Header Menu</CardTitle>
          <CardDescription>
            Customize the navigation links in your website's header.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Header menu management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>
            Manage your store's general settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" defaultValue="Aotearoa Organics" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="store-email">Store Email</Label>
                    <Input id="store-email" type="email" defaultValue="contact@aotearoaorganics.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="store-currency">Currency</Label>
                    <Input id="store-currency" defaultValue="NZD" />
                </div>
                <div className="pt-2">
                    <Button type="submit">Save Settings</Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}

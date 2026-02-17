import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Store, Mail, DollarSign, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-headline">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your store preferences</p>
      </div>

      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic store information and configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="store-name" className="flex items-center gap-2"><Store className="h-4 w-4 text-muted-foreground" /> Store Name</Label>
                <Input id="store-name" defaultValue="Richmond Vege Mart" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email" className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Store Email</Label>
                <Input id="store-email" type="email" defaultValue="contact@aotearoaorganics.com" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-currency" className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Currency</Label>
                <Input id="store-currency" defaultValue="NZD" className="rounded-lg" />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button type="submit" className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

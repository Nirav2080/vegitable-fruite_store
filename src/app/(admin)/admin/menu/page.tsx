
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Menu, GripVertical } from "lucide-react";

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-headline">Header Menu</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your store&apos;s navigation</p>
      </div>

      <Card className="rounded-2xl border-border/60 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-4">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-1">Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md">Drag-and-drop menu builder for your store&apos;s header navigation is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}

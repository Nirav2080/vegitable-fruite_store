
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAttributes } from "@/lib/cached-data";
import { AttributesTable } from "./_components/AttributesTable";

export default async function AdminAttributesPage() {
  const attributes = await getAttributes();
  const totalValues = attributes.reduce((acc, a) => acc + a.values.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Attributes</h1>
          <p className="text-sm text-muted-foreground mt-1">{attributes.length} attributes · {totalValues} values</p>
        </div>
        <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
          <Link href="/admin/attributes/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Attribute
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>Manage Attributes</CardTitle>
          <CardDescription>Define attributes like size, color, or weight for product filtering.</CardDescription>
        </CardHeader>
        <CardContent>
            <AttributesTable data={attributes} />
        </CardContent>
      </Card>
    </div>
  );
}

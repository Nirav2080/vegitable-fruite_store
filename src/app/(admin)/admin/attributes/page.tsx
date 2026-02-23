
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
          <h1 className="text-3xl font-bold tracking-tight">Attributes</h1>
          <p className="text-sm text-muted-foreground mt-1">{attributes.length} attributes · {totalValues} values</p>
        </div>
        <Button asChild className="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <Link href="/admin/attributes/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Attribute
          </Link>
        </Button>
      </div>
      <Card className="rounded-2xl border-border/30">
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

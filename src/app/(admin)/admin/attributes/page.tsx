
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAttributes } from "@/lib/cached-data";
import { AttributesTable } from "./_components/AttributesTable";

export default async function AdminAttributesPage() {
  const attributes = await getAttributes();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Attributes</h1>
        <Button asChild>
          <Link href="/admin/attributes/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Attribute
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Attributes</CardTitle>
          <CardDescription>
            Define attributes like size, color, or material to use for product filtering.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <AttributesTable data={attributes} />
        </CardContent>
      </Card>
    </div>
  );
}

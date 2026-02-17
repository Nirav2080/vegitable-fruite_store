
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeForm } from "../../_components/AttributeForm";
import { getAttributeById } from "@/lib/cached-data";
import { notFound } from "next/navigation";

export default async function EditAttributePage({ params }: { params: { id: string }}) {
  const attribute = await getAttributeById(params.id);
  if (!attribute) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight font-headline mb-6">Edit Attribute</h1>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>Attribute Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AttributeForm attribute={attribute} />
        </CardContent>
      </Card>
    </div>
  );
}

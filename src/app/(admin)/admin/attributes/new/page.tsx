
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeForm } from "../_components/AttributeForm";

export default function NewAttributePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Attribute</h1>
      <Card>
        <CardHeader>
          <CardTitle>Attribute Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AttributeForm />
        </CardContent>
      </Card>
    </div>
  );
}

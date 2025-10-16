
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            This section is a placeholder for your store's analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>A detailed analytics dashboard will be implemented here soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

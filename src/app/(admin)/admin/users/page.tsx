
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/lib/cached-data";
import { UsersTable } from "./_components/UsersTable";
import { File, UserPlus } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await getUsers();
  const totalSpent = users.reduce((acc, u) => acc + u.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} customers · ${totalSpent.toFixed(2)} total spent</p>
        </div>
         <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-border/60 transition-all duration-300 hover:shadow-sm">
                <File className="mr-2 h-4 w-4" />
                Export
            </Button>
            <Button asChild className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">
                <Link href="/admin/users/new">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                </Link>
            </Button>
        </div>
      </div>
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>View and manage your customer base.</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable data={users} />
        </CardContent>
      </Card>
    </div>
  );
}

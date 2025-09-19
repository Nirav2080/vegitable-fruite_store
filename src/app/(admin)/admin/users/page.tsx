
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/lib/cached-data";
import { UsersTable } from "./_components/UsersTable";
import { File, UserPlus } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
         <div className="flex gap-2">
            <Button variant="outline">
                <File className="mr-2 h-4 w-4" />
                Export
            </Button>
            <Button asChild>
                <Link href="/admin/users/new">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                </Link>
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            View and manage your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable data={users} />
        </CardContent>
      </Card>
    </div>
  );
}


import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AccountSidebarNav } from "./_components/AccountSidebarNav";
import { CustomerAuthGuard } from "@/components/auth/CustomerAuthGuard";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerAuthGuard>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline">My Account</h1>
          <p className="text-muted-foreground">Manage your account and order history.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
              <Card>
                  <CardContent className="p-4">
                      <AccountSidebarNav />
                  </CardContent>
              </Card>
          </aside>
          <main className="md:col-span-3">
              <Card>
                  <CardContent className="p-6">
                      {children}
                  </CardContent>
              </Card>
          </main>
        </div>
      </div>
    </CustomerAuthGuard>
  );
}

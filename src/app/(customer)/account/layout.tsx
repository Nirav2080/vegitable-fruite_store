
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AccountSidebarNav } from "./_components/AccountSidebarNav";
import { CustomerAuthGuard } from "@/components/auth/CustomerAuthGuard";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerAuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Account</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
              <Card className="rounded-2xl border-border/30">
                  <CardContent className="p-4">
                      <AccountSidebarNav />
                  </CardContent>
              </Card>
          </aside>
          <main className="md:col-span-3">
              <Card className="rounded-2xl border-border/30">
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

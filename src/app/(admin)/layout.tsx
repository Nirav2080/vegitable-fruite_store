
'use client';

import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  CircleUser,
  Home,
  LogOut,
  Package,
  Package2,
  ShoppingCart,
  Users,
  BookOpen,
  Image as ImageIcon,
  Menu as MenuIcon,
  Gift,
  LineChart
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrders } from '@/lib/actions/orders';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    async function fetchOrderCount() {
      try {
        const orders = await getOrders();
        const pendingCount = orders.filter(order => order.status === 'Pending').length;
        setPendingOrdersCount(pendingCount);
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      }
    }
    fetchOrderCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      if (!isLoggedIn && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);
  
  const navItems = [
    { href: '/admin', icon: Home, label: 'Admin Dashboard' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/users', icon: Users, label: 'Customers' },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/admin/blog', icon: BookOpen, label: 'Blog' },
    { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
    { href: '/admin/menu', icon: MenuIcon, label: 'Header Menu' },
    { href: '/admin/coupons', icon: Gift, label: 'Coupons' },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isClient) {
    return (
       <div className="flex min-h-screen">
        <div className="w-64 border-r p-4">
            <Skeleton className="h-10 w-40 mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
        <div className="flex-1 p-6">
            <Skeleton className="h-12 w-1/3 mb-6" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
    );
  }
  
  const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isAdminLoggedIn') === 'true' : false;

  if (!isLoggedIn) {
      return null;
  }
  
  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={isActive(item.href)}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                       <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Can add search here */}
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

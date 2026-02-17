
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
  Image as ImageIcon,
  Menu as MenuIcon,
  Gift,
  LineChart,
  Tag,
  Star,
  Sparkles,
  Percent,
  Settings,
  Award,
  Search,
  ChevronRight,
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
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
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

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { href: '/admin', icon: Home, label: 'Dashboard' },
        { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
      ],
    },
    {
      label: 'Catalog',
      items: [
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/categories', icon: Tag, label: 'Categories' },
        { href: '/admin/brands', icon: Award, label: 'Brands' },
        { href: '/admin/attributes', icon: Sparkles, label: 'Attributes' },
      ],
    },
    {
      label: 'Sales',
      items: [
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
        { href: '/admin/users', icon: Users, label: 'Customers' },
        { href: '/admin/offers', icon: Percent, label: 'Offers' },
        { href: '/admin/coupons', icon: Gift, label: 'Coupons' },
      ],
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
        { href: '/admin/menu', icon: MenuIcon, label: 'Menu' },
      ],
    },
    {
      label: 'System',
      items: [
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
      ],
    },
  ];

  // Flatten for breadcrumb lookup
  const allNavItems = navGroups.flatMap(g => g.items);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isClient) {
    return (
       <div className="flex min-h-screen bg-muted/30">
        <div className="w-64 border-r border-border/60 p-4 bg-background">
            <Skeleton className="h-10 w-40 mb-8 rounded-xl" />
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg" />
                ))}
            </div>
        </div>
        <div className="flex-1">
            <div className="h-14 border-b border-border/60 px-6 flex items-center">
              <Skeleton className="h-6 w-48 rounded-lg" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/3 rounded-lg" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    </div>
    );
  }
  
  const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isAdminLoggedIn') === 'true' : false;

  if (!isLoggedIn) {
      return null;
  }
  
  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href));

  // Generate breadcrumb
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return null;
    const activeItem = allNavItems.find(item => isActive(item.href));
    return activeItem?.label || segments[segments.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const breadcrumb = getBreadcrumb();

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4">
          <Link href="/admin" className="flex items-center gap-2.5 px-1 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Package2 className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight leading-none">Admin Panel</span>
              <span className="text-[10px] text-muted-foreground font-medium">Store Management</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 pt-4 pb-1.5">
                {group.label}
              </p>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={isActive(item.href)}
                        className="rounded-lg transition-all duration-200"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        {item.badge && (
                          <Badge className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-red-500 text-white border-0">
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-border/40 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Dashboard
            </Link>
            {breadcrumb && breadcrumb !== 'Dashboard' && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="font-semibold text-foreground">{breadcrumb}</span>
              </>
            )}
          </nav>

          <div className="flex-1" />

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted h-9 w-9">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/60 shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold">Admin</p>
                  <p className="text-xs text-muted-foreground">admin@store.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

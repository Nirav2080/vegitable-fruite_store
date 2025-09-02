
'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, Package, Settings, LogOut } from "lucide-react";

const navItems = [
    { href: "/account/profile", label: "My Profile", icon: User },
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountSidebarNav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('isCustomerLoggedIn');
        router.push('/login');
    };

    return (
        <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    <Button 
                        variant="ghost" 
                        className={cn(
                            "w-full justify-start",
                            pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                    >
                       <item.icon className="mr-2 h-4 w-4" />
                       {item.label}
                    </Button>
                </Link>
            ))}
             <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
            >
               <LogOut className="mr-2 h-4 w-4" />
               Logout
            </Button>
        </nav>
    );
}


"use client"

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ShoppingCart, User, Menu, Heart, LogOut, Package, Settings, LogIn, UserPlus, Search, X } from "lucide-react";
import { DynamicSearch } from "@/components/search/DynamicSearch";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";


const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isClient, setIsClient] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const checkLoginStatus = () => {
        const loggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
        if (loggedIn !== isLoggedIn) {
          setIsLoggedIn(loggedIn);
        }
    };
    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('loginStateChange', checkLoginStatus);


    return () => {
        window.removeEventListener('storage', checkLoginStatus);
        window.removeEventListener('loginStateChange', checkLoginStatus);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    const event = new Event('loginStateChange');
    window.dispatchEvent(event);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center">
            <Logo className="h-8 md:h-10 w-auto text-primary" />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {mainNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
                {link.label}
            </Link>
            ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <div className="hidden md:block w-full max-w-xs">
                 <DynamicSearch />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative shrink-0 hover:bg-accent">
                    <User className="h-6 w-6" />
                    <span className="sr-only">My Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isClient && isLoggedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="flex items-center w-full">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Order History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                        <Link href="/login" className="flex items-center w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/register" className="flex items-center w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Sign Up</span>
                        </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild variant="ghost" size="icon" className="relative shrink-0 hover:bg-accent">
                <Link href="/wishlist">
                <Heart className="h-6 w-6" />
                 {isClient && wishlistCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">{wishlistCount}</Badge>
                 )}
                <span className="sr-only">Wishlist</span>
                </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="relative shrink-0 hover:bg-accent">
                <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {isClient && cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">{cartCount}</Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
                </Link>
            </Button>
            <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                    <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col p-0">
                    <SheetHeader className="p-4 border-b">
                         <div className="relative">
                            <DynamicSearch />
                         </div>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1 p-4">
                    {mainNavLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                            <Link href={link.href} className="text-lg font-medium p-2 rounded-md hover:bg-accent">
                                {link.label}
                            </Link>
                        </SheetClose>
                    ))}
                    </nav>
                </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}

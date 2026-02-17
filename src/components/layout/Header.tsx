
"use client"

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ShoppingCart, User, Menu, Heart, LogOut, Package, Settings, LogIn, UserPlus, Search, MapPin, ChevronDown } from "lucide-react";
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
      setIsLoggedIn(loggedIn);
    };

    // Initial check
    checkLoginStatus();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', checkLoginStatus);

    // Listen for custom event from the login/logout functions
    window.addEventListener('loginStateChange', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('currentUser');
    const event = new Event('loginStateChange');
    window.dispatchEvent(event);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:h-18 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center shrink-0">
          <Logo className="h-7 sm:h-8 md:h-10 w-auto text-primary" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {mainNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-foreground/70 transition-all duration-200 hover:bg-accent hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2 md:gap-4">
          <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full border-border/60 text-sm shadow-sm transition-all duration-200 hover:shadow-md">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Auckland</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>

          <div className="hidden md:flex w-full max-w-xs">
            <DynamicSearch />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative shrink-0 hover:bg-accent hidden sm:flex">
                <User className="h-5 w-5" />
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
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

          <Button asChild variant="ghost" size="icon" className="relative shrink-0 rounded-full transition-all duration-200 hover:bg-accent hover:shadow-sm">
            <Link href="/wishlist">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              {isClient && wishlistCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold rounded-full shadow-sm">{wishlistCount}</Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative shrink-0 rounded-full transition-all duration-200 hover:bg-accent hover:shadow-sm">
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {isClient && cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold rounded-full shadow-sm">{cartCount}</Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent shrink-0">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col p-0">
                <SheetHeader className="p-4 pb-0 flex flex-row items-center justify-end ">
                  <SheetClose />
                </SheetHeader>
                <div className="p-5 mt-6 pt-0">
                  <DynamicSearch />
                </div>
                <nav className="flex flex-col gap-0.5 px-3 pt-0">
                  {mainNavLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href} className="text-base font-semibold rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-accent">
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <Separator className="my-2" />
                  {isClient && isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/account" className="flex items-center gap-3 text-base font-semibold rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-accent">
                          <User className="h-4 w-4" />
                          <span>My Account</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/account/orders" className="flex items-center gap-3 text-base font-semibold rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-accent">
                          <Package className="h-4 w-4" />
                          <span>Order History</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button onClick={handleLogout} className="flex items-center gap-3 text-base font-semibold rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-accent text-destructive w-full text-left">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" className="flex items-center gap-3 text-base font-semibold rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-accent">
                          <LogIn className="h-4 w-4" />
                          <span>Login</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/register" className="flex items-center gap-3 text-base font-semibold rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-accent">
                          <UserPlus className="h-4 w-4" />
                          <span>Sign Up</span>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

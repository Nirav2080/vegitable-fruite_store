
"use client"

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ShoppingCart, User, Menu, Heart, LogOut, Package, Settings, LogIn, UserPlus } from "lucide-react";
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
import { ThemeToggle } from "@/components/theme/ThemeToggle";


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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50 transition-all duration-300">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-[4.5rem] sm:gap-3 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 transition-opacity duration-200 hover:opacity-80">
          <Logo className="h-5 min-[400px]:h-7 sm:h-8 md:h-9 w-auto text-primary" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-xl px-4 py-2 text-sm font-medium text-foreground/60 transition-all duration-200 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions group */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-1.5 lg:gap-3">
          {/* Search (desktop) */}
          <div className="hidden md:flex w-full max-w-[240px] lg:max-w-xs">
            <DynamicSearch />
          </div>

          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative shrink-0 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hidden sm:flex"
              >
                <User className="h-[1.15rem] w-[1.15rem]" />
                <span className="sr-only">My Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/40 shadow-xl shadow-black/5">
              <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">My Account</DropdownMenuLabel>
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

          {/* Wishlist */}
          <Button asChild variant="ghost" size="icon" className="relative shrink-0 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground">
            <Link href="/wishlist">
              <Heart className="h-[1.15rem] w-[1.15rem]" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm shadow-black/[0.06]">{wishlistCount}</span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          {/* Theme toggle — hidden on tiny screens; available in mobile sheet */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Cart */}
          <Button asChild variant="ghost" size="icon" className="relative shrink-0 rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground">
            <Link href="/cart">
              <ShoppingCart className="h-[1.15rem] w-[1.15rem]" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm shadow-black/[0.06]">{cartCount}</span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          {/* Mobile menu */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col p-0 w-[85vw] max-w-sm border-border/30 overflow-hidden">
                {/* Sticky close row */}
                <SheetHeader className="shrink-0 flex flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-border/20">
                  <Link href="/" onClick={() => setOpen(false)}>
                    <Logo className="h-5 w-auto text-primary" />
                  </Link>
                  <SheetClose />
                </SheetHeader>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto overscroll-contain">

                {/* Mobile search */}
                <div className="px-5 pt-4 pb-2">
                  <DynamicSearch />
                </div>

                {/* Theme toggle in mobile sheet */}
                <div className="px-5 py-3 mt-1 flex items-center justify-between border-t border-border/20">
                  <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>

                <nav className="flex flex-col gap-0.5 px-3 pb-4">
                  {mainNavLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] font-medium rounded-xl px-4 py-3.5 text-foreground/70 transition-colors duration-200 hover:bg-accent hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <Separator className="my-3" />
                  {isClient && isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/account" className="flex items-center gap-3 text-[15px] font-medium rounded-xl px-4 py-3.5 text-foreground/70 transition-colors duration-200 hover:bg-accent hover:text-foreground">
                          <User className="h-4 w-4" />
                          <span>My Account</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/account/orders" className="flex items-center gap-3 text-[15px] font-medium rounded-xl px-4 py-3.5 text-foreground/70 transition-colors duration-200 hover:bg-accent hover:text-foreground">
                          <Package className="h-4 w-4" />
                          <span>Order History</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button onClick={handleLogout} className="flex items-center gap-3 text-[15px] font-medium rounded-xl px-4 py-3.5 text-destructive w-full text-left transition-colors duration-200 hover:bg-destructive/5">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" className="flex items-center gap-3 text-[15px] font-medium rounded-xl px-4 py-3.5 text-foreground/70 transition-colors duration-200 hover:bg-accent hover:text-foreground">
                          <LogIn className="h-4 w-4" />
                          <span>Login</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/register" className="flex items-center gap-3 text-[15px] font-medium rounded-xl px-4 py-3.5 text-foreground/70 transition-colors duration-200 hover:bg-accent hover:text-foreground">
                          <UserPlus className="h-4 w-4" />
                          <span>Sign Up</span>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>

                </div>{/* end scrollable body */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

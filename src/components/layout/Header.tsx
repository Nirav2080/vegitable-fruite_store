
"use client"

import React from "react";
import Link from "next/link";
import { EcoOrganicLogo } from "@/components/icons/EcoOrganicLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, User, Menu, Heart, LogOut, Package, Settings, LogIn, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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


const mainNavLinks = [
  { href: "/products", label: "All Products" },
];

const secondaryNavLinks = [
    { href: "/offers", label: "Offer Zone" },
    { href: "/gift-cards", label: "Gift Cards" },
]

export function Header() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isClient, setIsClient] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const checkLoginStatus = () => {
        setIsLoggedIn(localStorage.getItem('isCustomerLoggedIn') === 'true');
    };
    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);

    return () => {
        window.removeEventListener('storage', checkLoginStatus);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-10 items-center justify-center px-4 text-sm">
          <p>Get Up To 50% OFF New Season Styles, Limited Time Only.</p>
        </div>
      </div>
      <Separator/>

      {/* Main Header */}
      <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-16 md:h-20 items-center justify-between gap-4 md:gap-8 px-4">
            <Link href="/" className="flex items-center">
                <EcoOrganicLogo className="h-8 md:h-10 w-auto" />
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl relative">
                <DynamicSearch />
            </div>

            <div className="flex items-center gap-1 md:gap-4">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
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
                          <Link href="/account/profile" className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
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

                <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Link href="/wishlist">
                    <Heart className="h-6 w-6" />
                     {isClient && wishlistCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">{wishlistCount}</Badge>
                     )}
                    <span className="sr-only">Wishlist</span>
                    </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Link href="/cart">
                    <ShoppingCart className="h-6 w-6" />
                    {isClient && cartCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">{cartCount}</Badge>
                    )}
                    <span className="sr-only">Shopping Cart</span>
                    </Link>
                </Button>
                 <div className="md:hidden">
                    <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <nav className="flex flex-col gap-4 mt-8">
                        <Link href="/" className="mb-4">
                           <EcoOrganicLogo className="h-10 w-auto text-foreground"/>
                        </Link>
                        {[...mainNavLinks, ...secondaryNavLinks].map((link) => (
                            <Link key={link.href} href={link.href} className="text-lg font-medium">
                            {link.label}
                            </Link>
                        ))}
                        <hr/>
                        {isClient && isLoggedIn ? (
                            <Button onClick={handleLogout}>Logout</Button>
                        ) : (
                            <Button asChild><Link href="/login">Login</Link></Button>
                        )}
                        </nav>
                    </SheetContent>
                    </Sheet>
                </div>
            </div>
          </div>
      </div>
      <Separator />

      {/* Bottom Bar */}
      <div className="bg-background hidden md:block">
         <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-6">
                <Button variant="outline" className="flex">
                    <Menu className="mr-2 h-5 w-5" />
                    All Department
                </Button>
                 <nav className="flex items-center gap-6 text-sm font-medium">
                    {mainNavLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
                        {link.label}
                    </Link>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-6">
                <nav className="flex items-center gap-6 text-sm font-medium">
                    {secondaryNavLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
                        {link.label}
                    </Link>
                    ))}
                </nav>
            </div>
         </div>
      </div>

    </header>
  );
}

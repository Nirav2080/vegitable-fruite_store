
"use client"

import React from "react";
import Link from "next/link";
import { EcoOrganicLogo } from "@/components/icons/EcoOrganicLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, User, Menu, MapPin, Truck, Heart, GitCompareArrows } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DynamicSearch } from "@/components/search/DynamicSearch";

const topNavLinks = [
  { href: "/store-locator", label: "Store Locator", icon: MapPin },
  { href: "/track-order", label: "Track Your Order", icon: Truck },
  { href: "/account", label: "My Account", icon: User },
];

const mainNavLinks = [
  { href: "/products", label: "Organic Products" },
  { href: "/products?category=Vegetables", label: "Vegetables" },
  { href: "/products?category=Fruits", label: "Fruits" },
];

const secondaryNavLinks = [
    { href: "/offers", label: "Offer Zone" },
    { href: "/gift-cards", label: "Gift Cards" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-10 items-center justify-between px-4 text-xs">
          <div className="flex-1 text-center md:text-left">
            <p>Get Up To 50% OFF New Season Styles, Limited Time Only.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Select defaultValue="en">
                    <SelectTrigger className="w-auto h-auto bg-transparent border-none p-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="en">En</SelectItem>
                    <SelectItem value="es">Es</SelectItem>
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-4 bg-primary-foreground/50" />
                <Select defaultValue="usd">
                    <SelectTrigger className="w-auto h-auto bg-transparent border-none p-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="usd">$ USD</SelectItem>
                    <SelectItem value="nzd">$ NZD</SelectItem>
                    <SelectItem value="aud">$ AUD</SelectItem>
                    </SelectContent>
                </Select>
             </div>
            <Separator orientation="vertical" className="h-4 bg-primary-foreground/50" />
            <div className="flex items-center gap-4">
              {topNavLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                   <Link href={link.href} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                  { index < topNavLinks.length -1 && <Separator orientation="vertical" className="h-4 bg-primary-foreground/50" /> }
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Separator/>

      {/* Main Header */}
      <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-20 items-center justify-between gap-4 md:gap-8 px-4">
            <Link href="/" className="flex items-center">
                <EcoOrganicLogo className="h-12 w-auto" />
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl relative">
                <DynamicSearch />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                 <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Link href="/compare">
                    <GitCompareArrows className="h-6 w-6" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">0</Badge>
                    <span className="sr-only">Compare Products</span>
                    </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Link href="/wishlist">
                    <Heart className="h-6 w-6" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">0</Badge>
                    <span className="sr-only">Wishlist</span>
                    </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Link href="/cart">
                    <ShoppingCart className="h-6 w-6" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">3</Badge>
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
                        <Button>Login</Button>
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

"use client"

import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-primary" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Input type="search" placeholder="Search products..." className="w-64 pr-10" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          <Select defaultValue="nzd">
            <SelectTrigger className="w-[80px] hidden sm:flex">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nzd">NZD</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="aud">AUD</SelectItem>
            </SelectContent>
          </Select>

          <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-xs">3</Badge>
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <User className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
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
    </header>
  );
}

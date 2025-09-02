
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Weekly Specials", href: "/products?seasonal=true" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo className="h-10 w-auto text-foreground" />
            </Link>
            <p className="max-w-sm">Delivering the freshest, locally-sourced produce from our farms to your family's table.</p>
            <div className="mt-6">
              <h4 className="font-semibold text-foreground">Stay in the loop</h4>
              <p className="text-sm mt-1">Get the latest deals and recipes delivered to your inbox.</p>
              <form className="flex gap-2 mt-4">
                <Input type="email" placeholder="Enter your email" className="bg-background"/>
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Aotearoa Organics. All Rights Reserved.</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <Link href={social.href} key={social.name} aria-label={social.name} className="hover:text-primary transition-colors">
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

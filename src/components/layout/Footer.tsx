
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Truck, CreditCard, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";

const mainLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shop", href: "/products" },
  { label: "Blog", href: "/blog" },
];

const accountLinks = [
  { label: "My Account", href: "/account" },
  { label: "Checkout", href: "/checkout" },
  { label: "Shopping Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
];

const helpfulLinks = [
    { label: "Gift-Cards", href: "/gift-cards" },
    { label: "Support", href: "/support" },
    { label: "Our Story", href: "/story" },
    { label: "FAQs", href: "/faq" },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
  { name: "Linkedin", icon: Linkedin, href: "#" },
];

const infoItems = [
    { icon: Truck, title: "Free Delivery", description: "From $50" },
    { icon: CreditCard, title: "Safe Payment", description: "Secured by Stripe" },
    { icon: ShieldCheck, title: "Money Back", description: "30-day guarantee" },
    { icon: Tag, title: "Best Prices", description: "For all products" }
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80">
        <div className="border-b border-primary-foreground/10">
            <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {infoItems.map(item => (
                    <div key={item.title} className="flex items-center gap-4">
                        <div className="bg-primary-foreground/10 p-3 rounded-full">
                            <item.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-primary-foreground">{item.title}</h4>
                            <p className="text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo className="h-8 w-auto text-white" />
            </Link>
            <p className="max-w-sm mt-4">Delivering the freshest, locally-sourced produce from our farms to your family's table.</p>
             <div className="flex gap-4 mt-6">
                {socialLinks.map((social) => (
                <Link href={social.href} key={social.name} aria-label={social.name} className="hover:text-white transition-colors p-2 bg-primary-foreground/10 rounded-full">
                    <social.icon className="h-5 w-5" />
                </Link>
                ))}
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
                <h4 className="font-semibold text-white mb-4">My Account</h4>
                <ul className="space-y-3">
                  {accountLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-white mb-4">Helpful Links</h4>
                <ul className="space-y-3">
                  {helpfulLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-white mb-4">Main Menu</h4>
                <ul className="space-y-3">
                  {mainLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Foodia. All Rights Reserved.</p>
           <div className="flex items-center gap-2">
                <p className="text-sm">We accept:</p>
                <div className="flex items-center gap-2">
                    <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6" />
                    <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-6" />
                </div>
           </div>
        </div>
      </div>
    </footer>
  );
}

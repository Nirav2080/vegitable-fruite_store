
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

const PaymentMethods = () => (
    <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" aria-labelledby="pi-visa">
            <title id="pi-visa">Visa</title>
            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1F71"/>
            <path d="M15.2 16.2c-.5.6-1.3.9-2.2.9-.9 0-1.6-.3-2.2-.8-.6-.6-.9-1.3-.9-2.3 0-1.3.6-2.3 1.8-2.9l2.4-.9c.5-.2.7-.3.7-.5 0-.2-.2-.4-.6-.4-.5 0-.9.2-1.3.5l-.4-.8c.4-.2.9-.4 1.5-.4.9 0 1.5.3 1.9.8.4.5.6 1 .6 1.7v3.2h1.2v.8h-1.2c0 .5 0 .8.2 1zm-3.6-3.3c-.4.2-.6.4-.6.8 0 .4.2.6.7.6.5 0 .9-.2 1.2-.5V12c-.4-.1-.8-.2-1.3-.2-.5 0-.8.1-1 .3zm10.2 3.3c.7 0 1.2-.3 1.5-.8V16h1.2v-4.1c0-.5-.1-.9-.4-1.1-.3-.2-.7-.3-1.2-.3-.6 0-1 .2-1.3.5l.4.8c.2-.2.5-.3.8-.3.4 0 .6.1.6.4v.4h-2.1c-.8 0-1.5.3-1.5 1.1 0 .5.3.8.8.8.4.1.7.1 1.1.2l1.1.3c.5.2.8.3.8.6 0 .3-.3.5-.8.5-.6 0-1.1-.2-1.5-.6l-.4.8c.4.3 1 .5 1.7.5zm-2-1.6c-.4-.1-.6-.2-.6-.5 0-.3.2-.4.6-.4h1.5v.8c-.4.2-.9.3-1.5.1zM29.5 6.3c.4-.3.9-.4 1.4-.4.8 0 1.4.3 1.8.7.4.4.6.9.6 1.6v4.1h1.2V8.3c0-.5-.1-.9-.3-1.1-.2-.2-.5-.3-.9-.3-.5 0-.9.1-1.3.3l.4.8c.3-.2.6-.3.9-.3.4 0 .6.1.6.4v.3h-2.1c-1.1 0-1.8.4-1.8 1.3 0 .5.3.9.8 1.1.4.2.9.3 1.5.3.6.1 1.2.2 1.7.3.5.1.8.3.8.5 0 .3-.3.5-.8.5-.7 0-1.2-.2-1.7-.6l-.4.8c.5.3 1.2.6 2.1.6.9 0 1.6-.3 2.1-.8s.7-1.1.7-1.9v-4c0-1-.4-1.8-1.1-2.3-.7-.6-1.6-.8-2.7-.8-1 0-1.9.2-2.6.5l.5.8z" fill="#fff"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" aria-labelledby="pi-mastercard">
            <title id="pi-mastercard">Mastercard</title>
            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#fff"/>
            <circle cx="15" cy="12" r="7" fill="#EB001B"/>
            <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
            <path d="M22 12c0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7 7-3.1 7-7z" fill="#FF5F00"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" aria-labelledby="pi-stripe">
            <title id="pi-stripe">Stripe</title>
            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#6772E5"/>
            <path d="M26.4 12.5v-3c0-.4-.1-.8-.4-1-.2-.2-.5-.3-.9-.3-.3 0-.6.1-.8.2l.3-.6c.3-.2.6-.3.9-.3.6 0 1.1.2 1.4.5.3.3.5.7.5 1.2v3.2h-1zm-6-3.8h1.2V8c.4.3.9.5 1.5.5.8 0 1.4-.3 1.8-.9s.6-1.3.6-2.2c0-1.2-.5-2.1-1.4-2.7-.9-.5-2.1-.8-3.5-.8h-5.2v13.2h1.2v-7.3h3.5c1.4 0 2.5-.3 3.3-.9.8-.6 1.2-1.5 1.2-2.6 0-1-.3-1.8-.9-2.4-.6-.6-1.4-.9-2.4-.9-.8 0-1.5.2-2.1.6v2.3h-1.2v-3.8zm-1.1 2.6c0 .6.2 1 .6 1.4.4.3.9.5 1.5.5h3.5c.6 0 1.1-.1 1.4-.4s.5-.6.5-1.1c0-.4-.2-.8-.5-1.1-.3-.3-.8-.4-1.4-.4h-3.5c-.6 0-1.1.1-1.5.4-.3.3-.6.7-.6 1.1zM11.5 6.3H9.8v6.3H8.6V6.3H6.9V5.2h4.6v1.1z" fill="#fff"/>
        </svg>
    </div>
);

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80">
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
          <p className="text-sm">&copy; {new Date().getFullYear()} Aotearoa Organics. All Rights Reserved.</p>
           <div className="flex items-center gap-2">
                <p className="text-sm">We accept:</p>
                <div className="flex items-center gap-2">
                    <PaymentMethods />
                </div>
           </div>
        </div>
      </div>
    </footer>
  );
}


import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function DealsSection() {
    return (
        <section className="bg-secondary/50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-lg flex flex-col justify-center" style={{backgroundColor: '#E6F4F4'}}>
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-primary">Exclusive Offer</p>
                                <h3 className="text-3xl font-bold mt-2">Best Online Deals, Free Stuff</h3>
                                <p className="text-muted-foreground mt-1">Only on this week... don't miss</p>
                            </div>
                            <div className="bg-primary text-primary-foreground text-sm font-bold w-16 h-16 rounded-full flex items-center justify-center rotate-12">
                                15% OFF
                            </div>
                         </div>
                        <Button asChild className="mt-6 self-start rounded-full">
                            <Link href="/deals">
                                Get Best Deal <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                     <div className="p-8 rounded-lg flex flex-col justify-center" style={{backgroundColor: '#E6F4F4'}}>
                        <p className="font-semibold text-primary">Regular Offer</p>
                        <h3 className="text-3xl font-bold mt-2">10% cash-back on personal care</h3>
                        <p className="text-muted-foreground mt-1">Max cashback: $12. Code: <span className="font-semibold text-primary">CARE10</span></p>
                         <Button asChild className="mt-6 self-start rounded-full">
                            <Link href="/products?category=personal-care">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

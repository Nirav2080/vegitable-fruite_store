
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function DealsSection() {
    return (
        <section className="bg-secondary/50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-lg flex flex-col justify-center" style={{backgroundColor: '#F3F7E8'}}>
                         <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground/80">Exclusive Offer</p>
                                <Badge className="bg-primary text-primary-foreground">15% OFF</Badge>
                            </div>
                            <h3 className="text-3xl font-bold mt-2">Best Online Deals, Free Stuff</h3>
                            <p className="text-muted-foreground mt-1">Only on this week... don't miss</p>
                         </div>
                        <Button asChild className="mt-6 self-start rounded-full">
                            <Link href="/deals">
                                Get Best Deal <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                     <div className="p-8 rounded-lg flex flex-col justify-center" style={{backgroundColor: '#E6F4F4'}}>
                        <p className="font-semibold text-foreground/80">Regular Offer</p>
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


import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CallToActionSection() {
    return (
        <section className="bg-accent overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="relative py-16 md:py-24">
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <p className="font-semibold text-primary">Organic & Garden Fresh</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline mt-2">Need Organic & quality product everyday?</h2>
                         <Button asChild className="mt-6 rounded-full" size="lg">
                            <Link href="/products">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="absolute -left-48 -bottom-32 z-0 opacity-20 md:opacity-100">
                         <Image
                            src="https://placehold.co/500x500/E9F5DB/34495E?text=Vegetables"
                            alt="Groceries in a bag"
                            data-ai-hint="vegetables"
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>
                    <div className="absolute -right-48 -bottom-32 z-0 opacity-20 md:opacity-100">
                         <Image
                            src="https://placehold.co/500x500/FADBD8/34495E?text=Fruits"
                            alt="Fresh vegetables in a bag"
                            data-ai-hint="fruits"
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

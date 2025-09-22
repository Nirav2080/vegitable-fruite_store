
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CallToActionSection() {
    return (
        <section className="bg-accent overflow-hidden">
            <div className="container mx-auto px-4 py-16">
                <div className="relative">
                    <div className="relative z-10 text-center">
                        <p className="font-semibold text-primary">Organic & Garden Fresh</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline mt-2">Need Organic & quality product everyday?</h2>
                         <Button asChild className="mt-6 rounded-full" size="lg">
                            <Link href="/products">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="absolute -left-32 -bottom-24 z-0 opacity-50 md:opacity-100">
                         <Image
                            src="https://picsum.photos/seed/cta-left/400/400"
                            alt="Groceries in a bag"
                            data-ai-hint="groceries bag"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                    <div className="absolute -right-32 -bottom-24 z-0 opacity-50 md:opacity-100">
                         <Image
                            src="https://picsum.photos/seed/cta-right/400/400"
                            alt="Fresh vegetables in a bag"
                            data-ai-hint="vegetables bag"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

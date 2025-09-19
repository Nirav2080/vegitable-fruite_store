
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CallToActionSection() {
    return (
        <section className="bg-accent">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 items-center gap-8">
                    <div className="relative h-64 md:h-[400px]">
                         <Image
                            src="https://picsum.photos/seed/cta-bg/800/400"
                            alt="Organic products in a bag"
                            data-ai-hint="groceries bag"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="py-12 text-center md:text-left">
                        <p className="font-semibold text-primary">Organic & Garden Fresh</p>
                        <h2 className="text-3xl font-bold font-headline mt-2">Need Organic & quality product everyday?</h2>
                         <Button asChild className="mt-6 rounded-full" size="lg">
                            <Link href="/products">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

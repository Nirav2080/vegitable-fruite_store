
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
                </div>
            </div>
        </section>
    );
}

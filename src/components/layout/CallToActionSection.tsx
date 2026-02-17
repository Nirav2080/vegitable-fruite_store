
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CallToActionSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-accent via-green-50 to-emerald-50">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-16 sm:py-20 md:py-24">
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                            Organic &amp; Garden Fresh
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight font-headline mt-3 sm:text-4xl md:text-5xl">Need Organic &amp; quality product everyday?</h2>
                         <Button asChild className="mt-8 rounded-full px-8 text-base shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30" size="lg">
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

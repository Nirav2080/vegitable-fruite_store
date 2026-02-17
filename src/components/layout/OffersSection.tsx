import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/types";
import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OffersSectionProps {
    offers: Offer[];
}

export function OffersSection({ offers }: OffersSectionProps) {
    if (!offers || offers.length === 0) {
        return null;
    }

    return (
        <section className="w-full overflow-hidden bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
                {/* Header */}
                <div className="text-left mb-8">
                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-100/60 dark:bg-amber-900/20 dark:border-amber-700/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        <Tag className="h-3 w-3" />
                        Special Offers
                    </span>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight font-headline sm:text-3xl md:text-4xl">
                        Exclusive Deals & Offers
                    </h2>
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {offers.map(offer => (
                        <Link 
                            key={offer.id} 
                            href={offer.link} 
                            className="block relative rounded-2xl overflow-hidden h-64 sm:h-72 md:h-80 group shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
                        >
                            <Image
                                src={offer.image}
                                alt={offer.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                            <div className="absolute inset-0 p-6 sm:p-8 text-white flex flex-col justify-center">
                                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-headline leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="mt-3 max-w-sm text-sm sm:text-base leading-relaxed text-white/90">
                                    {offer.description}
                                </p>
                                {offer.code && (
                                    <div className="mt-4">
                                        <p className="text-xs sm:text-sm text-white/80 mb-1">Use code:</p>
                                        <span className="inline-block font-bold text-sm sm:text-base px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                                            {offer.code}
                                        </span>
                                    </div>
                                )}
                                <span className="mt-6 inline-flex items-center text-sm sm:text-base font-semibold text-white transition-transform duration-200 group-hover:translate-x-1">
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

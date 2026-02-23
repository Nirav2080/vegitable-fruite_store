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
        <section className="w-full bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                {/* Header */}
                <div className="text-left mb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-500 dark:text-amber-400 mb-2">Special Offers</p>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Exclusive Deals & Offers
                    </h2>
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    {offers.map(offer => (
                        <Link 
                            key={offer.id} 
                            href={offer.link} 
                            className="block relative rounded-2xl overflow-hidden h-60 sm:h-72 md:h-80 group transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1"
                        >
                            <Image
                                src={offer.image}
                                alt={offer.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
                            <div className="absolute inset-0 p-6 sm:p-8 text-white flex flex-col justify-end">
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                                    {offer.description}
                                </p>
                                {offer.code && (
                                    <div className="mt-3">
                                        <span className="inline-block font-semibold text-xs px-3 py-1.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20">
                                            Code: {offer.code}
                                        </span>
                                    </div>
                                )}
                                <span className="mt-4 inline-flex items-center text-sm font-medium text-white/90 transition-transform duration-200 group-hover:translate-x-1">
                                    Shop Now <ArrowRight className="ml-1.5 h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

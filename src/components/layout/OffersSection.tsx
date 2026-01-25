import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/types";
import { ArrowRight } from "lucide-react";
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
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-8">
                {offers.map(offer => (
                    <Link key={offer.id} href={offer.link} className="block relative rounded-lg overflow-hidden h-64 group">
                        <Image
                            src={offer.image}
                            alt={offer.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                         <div className="absolute inset-0 bg-black/40" />
                        <div
                            className="absolute inset-0 p-8 text-white flex flex-col justify-center"
                        >
                            <h3 className="text-2xl font-bold font-headline">{offer.title}</h3>
                            <p className="mt-2 max-w-sm">{offer.description}</p>
                            {offer.code && (
                                <p className="mt-4 text-sm">
                                    Use code: <span className="font-bold p-2 bg-white/20 rounded-md">{offer.code}</span>
                                </p>
                            )}
                            <Button variant="link" className="mt-4 justify-start p-0 h-auto text-white hover:text-white font-semibold">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}


import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
                    <Link key={offer.id} href={offer.link}>
                        <div
                            className="p-8 rounded-lg text-foreground flex flex-col justify-center h-full transition-transform hover:scale-105"
                            style={{ backgroundColor: offer.bgColor }}
                        >
                            <h3 className="text-2xl font-bold font-headline">{offer.title}</h3>
                            <p className="mt-2">{offer.description}</p>
                            {offer.code && (
                                <p className="mt-4 text-sm">
                                    Use code: <span className="font-bold p-2 bg-background/20 rounded-md">{offer.code}</span>
                                </p>
                            )}
                            <Button variant="ghost" className="mt-4 justify-start p-0 h-auto hover:bg-transparent">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}


import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getActiveOffers } from "@/lib/cached-data";

export async function DealsSection() {
    let offers = [];
    try {
        offers = await getActiveOffers();
    } catch (error) {
        console.error("Failed to fetch active offers:", error);
        // Silently fail, this section is not critical
    }

    if (offers.length === 0) {
        return null;
    }

    return (
        <section className="bg-secondary/50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    {offers.map((offer) => (
                        <div key={offer.id} className="p-8 rounded-lg flex flex-col justify-center" style={{backgroundColor: offer.bgColor}}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-bold font-headline">{offer.title}</h3>
                                    <p className="text-muted-foreground mt-1">{offer.description}
                                        {offer.code && <span className="font-semibold text-primary"> {offer.code}</span>}
                                    </p>
                                </div>
                                {offer.discount && (
                                     <Badge className="bg-primary text-primary-foreground">{offer.discount}% OFF</Badge>
                                )}
                            </div>
                            <Button asChild className="mt-6 self-start rounded-full">
                                <Link href={offer.link}>
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

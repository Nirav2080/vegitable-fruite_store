
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Leaf, PiggyBank } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const infoCards = [
    {
        icon: Leaf,
        title: "Grow my business with FoodieCart",
        description: "Let us help your business reach more customers.",
        bgColor: "bg-pink-100/50",
    },
    {
        icon: BadgeCheck,
        title: "Advertise brand on FoodieCart",
        description: "Let us help your business reach more customers.",
        bgColor: "bg-blue-100/50",

    },
    {
        icon: PiggyBank,
        title: "Learn more about FoodieCart",
        description: "Let us help your business reach more customers.",
        bgColor: "bg-purple-100/50",
    },
]

export function InfoSection() {
    return (
        <section className="bg-background">
            <div className="container mx-auto px-4 py-16 md:py-24">
                 <div className="text-left mb-12">
                    <h2 className="text-3xl font-bold font-headline">Ready to get started?</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                   {infoCards.map(card => (
                     <div key={card.title} className={`p-8 rounded-lg text-center flex flex-col items-center ${card.bgColor}`}>
                        <div className="p-4 bg-background rounded-full mb-4">
                           <card.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold font-headline">{card.title}</h3>
                        <p className="text-muted-foreground mt-2 flex-grow">{card.description}</p>
                         <Button asChild variant="outline" className="mt-6 rounded-full bg-background">
                            <Link href="#">
                                Learn More <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                   ))}
                </div>
            </div>
        </section>
    );
}


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
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
                 <div className="text-left mb-12">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        Get Started
                    </span>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight font-headline md:text-4xl">Ready to get started?</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                   {infoCards.map(card => (
                     <div key={card.title} className={`p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${card.bgColor}`}>
                        <div className="p-4 bg-background rounded-full mb-5 shadow-sm">
                           <card.icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight font-headline">{card.title}</h3>
                        <p className="text-muted-foreground mt-2 flex-grow leading-relaxed">{card.description}</p>
                         <Button asChild variant="outline" className="mt-7 rounded-full bg-background border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
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

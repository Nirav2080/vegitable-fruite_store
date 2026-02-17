
import { Leaf, BadgeCheck, Truck, ShieldCheck } from "lucide-react";

const trustFeatures = [
    { icon: Leaf, title: "Farm Fresh Produce", description: "Sourced directly from local farms." },
    { icon: BadgeCheck, title: "Quality Checked", description: "Every item is handpicked and checked." },
    { icon: ShieldCheck, title: "Hygienic Packing", description: "Clean and safe packaging for your family." },
    { icon: Truck, title: "Fast Delivery", description: "Get your order delivered in hours." },
];

export function TrustSection() {
    return (
        <section className="bg-background py-12 sm:py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-left mb-8">
                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Our Promise
                    </span>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight font-headline sm:text-3xl md:text-4xl">
                        Why Shop With Us
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                    {trustFeatures.map(feature => (
                        <div key={feature.title} className="group text-center flex flex-col items-center rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/40 dark:from-green-950/20 dark:to-emerald-950/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                            </div>
                            <h3 className="font-extrabold tracking-tight text-base">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

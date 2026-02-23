
import { Leaf, BadgeCheck, Truck, ShieldCheck } from "lucide-react";

const trustFeatures = [
    { icon: Leaf, title: "Farm Fresh Produce", description: "Sourced directly from local farms." },
    { icon: BadgeCheck, title: "Quality Checked", description: "Every item is handpicked and checked." },
    { icon: ShieldCheck, title: "Hygienic Packing", description: "Clean and safe packaging for your family." },
    { icon: Truck, title: "Fast Delivery", description: "Get your order delivered in hours." },
];

export function TrustSection() {
    return (
        <section className="bg-background py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">Our Promise</p>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Why Shop With Us
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {trustFeatures.map(feature => (
                        <div key={feature.title} className="group text-center flex flex-col items-center rounded-2xl bg-card border border-border/30 p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.03] hover:-translate-y-0.5">
                            <div className="flex justify-center mb-4">
                                <div className="p-3.5 rounded-xl bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-primary/12">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px] leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

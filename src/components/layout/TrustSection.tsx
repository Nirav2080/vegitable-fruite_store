
import { Leaf, BadgeCheck, Truck, ShieldCheck } from "lucide-react";

const trustFeatures = [
    { icon: Leaf, title: "Farm Fresh Produce", description: "Sourced directly from local farms." },
    { icon: BadgeCheck, title: "Quality Checked", description: "Every item is handpicked and checked." },
    { icon: ShieldCheck, title: "Hygienic Packing", description: "Clean and safe packaging for your family." },
    { icon: Truck, title: "Fast Delivery", description: "Get your order delivered in hours." },
];

export function TrustSection() {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {trustFeatures.map(feature => (
                        <div key={feature.title} className="text-center flex flex-col items-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-accent text-primary">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xs">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


import { Truck } from "lucide-react";

export function DeliveryInfoBanner() {
    return (
        <div className="bg-accent/50 border-b border-border/20">
            <div className="mx-auto max-w-7xl px-4 py-2 text-center text-[13px] font-medium text-foreground/60 sm:px-6 lg:px-8">
                <p className="flex items-center justify-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                    <span>Free delivery on orders over <span className="font-semibold text-foreground/80">$50</span> — Estimated delivery: 2-4 hours</span>
                </p>
            </div>
        </div>
    );
}

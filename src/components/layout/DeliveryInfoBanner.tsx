
import { Truck } from "lucide-react";

export function DeliveryInfoBanner() {
    return (
        <div className="bg-gradient-to-r from-primary/10 via-emerald-50/80 to-teal-50/60 text-primary">
            <div className="mx-auto max-w-7xl px-4 py-2.5 text-center text-sm font-medium sm:px-6 lg:px-8">
                <p className="flex items-center justify-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
                        <Truck className="h-3.5 w-3.5" />
                    </span>
                    Free delivery on all orders over $50. Estimated delivery time: 2-4 hours.
                </p>
            </div>
        </div>
    );
}

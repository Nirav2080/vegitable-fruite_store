
import { Truck } from "lucide-react";

export function DeliveryInfoBanner() {
    return (
        <div className="bg-primary/10 text-primary">
            <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">
                <p>
                    <Truck className="inline-block mr-2 h-4 w-4" />
                    Free delivery on all orders over $50. Estimated delivery time: 2-4 hours.
                </p>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { storeInfo } from '@/lib/store-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

const { address } = storeInfo;
const fullAddress = `${address.line1}, ${address.suburb}, ${address.city} ${address.postcode}, ${address.country}`;

export function StoreInfoCard() {
  return (
    <Card className="rounded-2xl border-border/30 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Store details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium">{storeInfo.name}</p>
            <p className="text-muted-foreground mt-1 leading-relaxed break-words">{fullAddress}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium">Phone</p>
            <Link
              href={`tel:${storeInfo.phone.replace(/\s/g, '')}`}
              className="text-muted-foreground hover:text-foreground transition-colors break-all"
            >
              {storeInfo.phone}
            </Link>
          </div>
        </div>
        <div className="flex gap-3">
          <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium">Email</p>
            <Link
              href={`mailto:${storeInfo.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors break-all"
            >
              {storeInfo.email}
            </Link>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-medium mb-2">Opening hours</p>
            <ul className="space-y-2 text-muted-foreground">
              {storeInfo.hours.map((row) => (
                <li
                  key={row.days}
                  className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4"
                >
                  <span className="shrink-0">{row.days}</span>
                  <span className="sm:text-right">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


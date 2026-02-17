
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const isLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
        if (!isLoggedIn) {
          router.push(`/login?redirectTo=${pathname}`);
        } else {
          setIsVerified(true);
        }
    }
  }, [pathname, router]);

  if (!isVerified) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3 rounded-xl" />
                <Skeleton className="h-4 w-2/3 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full rounded-2xl" />
                    </div>
                     <div className="md:col-span-3">
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}


'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push(`/login?redirectTo=${pathname}`);
    } else {
      setIsVerified(true);
    }
  }, [pathname, router]);

  if (!isVerified) {
    return (
        <div className="p-6">
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full" />
                    </div>
                     <div className="md:col-span-3">
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}

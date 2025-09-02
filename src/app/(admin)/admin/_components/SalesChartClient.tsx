
'use client'

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const SalesChart = dynamic(() => 
  import('./SalesChart').then(mod => mod.SalesChart),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[350px] w-full" />
  }
);

interface SalesChartClientProps {
    data: { name: string; total: number }[];
}

export function SalesChartClient({ data }: SalesChartClientProps) {
    return <SalesChart data={data} />;
}

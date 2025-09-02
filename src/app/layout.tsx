
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout/MainLayout';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Aotearoa Organics | Fresh & Local New Zealand Produce',
  description: 'Discover the freshest fruits, vegetables, and organic boxes from local New Zealand farms. Quality produce delivered to your door.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased", ptSans.className)}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

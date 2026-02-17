import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout/MainLayout';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { PT_Sans } from 'next/font/google';
import clientPromise from '@/lib/db';

const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pt-sans' });

export const metadata: Metadata = {
  title: 'RICHMOND VEGE MART | A Symphony of Flavours',
  description: 'Discover a symphony of flavours at Richmond Vege Mart. Your source for fresh, quality produce, delivering a delightful experience with every bite.',
};

async function DatabaseWarningBanner() {
  const client = await clientPromise;
  
  if (client) {
    try {
        await client.db().command({ ping: 1 });
        return null; // Connection is good
    } catch (e) {
        // Ping failed, connection is bad
    }
  }

  // If client is null OR the ping failed, show the banner
  return (
    <div className="bg-yellow-400 text-black sticky top-0 z-[101]">
      <div className="container mx-auto px-4 py-2 text-center text-sm font-bold">
        <p>
          <strong>Database Connection Error:</strong> The website is in a read-only demo mode. Please check your <code>MONGODB_URI</code> in the <code>.env</code> file and ensure your credentials are correct.
        </p>
      </div>
    </div>
  );
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased", ptSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DatabaseWarningBanner />
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

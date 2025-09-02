
'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from '@/context/CartContext'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')

  return (
    <CartProvider>
      <div className="relative flex min-h-screen flex-col">
        {!isAdminPage && <Header />}
        <main className="flex-1">{children}</main>
        {!isAdminPage && <Footer />}
        <Toaster />
      </div>
    </CartProvider>
  )
}

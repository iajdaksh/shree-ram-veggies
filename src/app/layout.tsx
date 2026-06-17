import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Shree Ram Veggies | Fresh Vegetables & Fruits Delivery',
  description: 'Fresh, hand-picked vegetables and fruits delivered to your doorstep in Muzaffarnagar. Quality assured, same-day delivery.',
  keywords: 'vegetables, fruits, fresh produce, Muzaffarnagar, Shree Ram Veggies',
  openGraph: {
    title: 'Shree Ram Veggies',
    description: 'Fresh Vegetables & Fruits Delivery',
    url: 'https://shreeramveggies.online',
    siteName: 'Shree Ram Veggies',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

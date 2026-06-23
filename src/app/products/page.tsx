import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductsList from './ProductsList'
import Link from 'next/link'

const CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits', value: 'fruits' },
];

export default function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const activeCategory = searchParams.category || null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Our Products</h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-muted)' }}>Fresh from the farm, delivered to your doorstep.</p>
          </div>

          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => (<div key={i} className="glass-card-static h-64 animate-pulse" />))}</div>}>
            <ProductsList />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}

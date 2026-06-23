'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image_url: string | null;
  badge: string | null;
};

const CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits', value: 'fruits' },
];

const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="glass-card-static h-64 animate-pulse" />
    ))}
  </div>
);

export default function ProductsList() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*').eq('is_available', true);

    if (category) {
      query = query.eq('category', category);
    }

    query.order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts((data as Product[]) || []);
      }
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return (
      <LoadingSkeleton />
    );
  }

  if (products.length === 0) {
    return (
      <>
        <div className="flex justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href={cat.value ? `/products?category=${cat.value}` : '/products'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.value ? 'bg-[var(--accent)] text-black' : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-white/10'}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
        <div className="text-center col-span-full py-12">
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>No Products Found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                There are no products available in this category right now.
            </p>
        </div>
    )
      </>
  }

  return (
    <>
      <div className="flex justify-center gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.label}
            href={cat.value ? `/products?category=${cat.value}` : '/products'}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.value ? 'bg-[var(--accent)] text-black' : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-white/10'}`}
          >
            {cat.label}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/products/${product.id}`} className="product-card block">
              <div className="product-image">
                <img src={product.image_url || '/placeholder.png'} alt={product.name} />
                {product.badge && <span className="badge-bestseller">{product.badge}</span>}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.unit}</p>
                  <p className="font-bold" style={{ color: 'var(--accent-gold)' }}>₹{product.price}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
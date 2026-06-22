'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/cartStore'
import { Search, Filter, ShoppingCart, SlidersHorizontal, Leaf, Sparkles, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CATEGORIES = [
  { value: '', label: 'All Produce', icon: ShoppingCart },
  { value: 'vegetables', label: 'Fresh Vegetables', icon: Leaf },
  { value: 'fruits', label: 'Fresh Fruits', icon: Sparkles },
]

const PRODUCT_ICONS: Record<string, any> = {
  vegetables: Leaf, fruits: Sparkles
}

const DEMO_PRODUCTS = [
  { id: '1', name: 'Fresh Potato', price: 30, unit: '1 kg', category: 'vegetables', image_url: null, badge: 'bestseller', description: 'Fresh daily sourced potatoes.', is_available: true, stock: 100 },
  { id: '2', name: 'Red Onion', price: 40, unit: '1 kg', category: 'vegetables', image_url: null, badge: null, description: 'Crisp and fresh red onions from local farms.', is_available: true, stock: 80 },
  { id: '3', name: 'Tomato', price: 50, unit: '1 kg', category: 'vegetables', image_url: null, badge: 'fresh', description: 'Juicy red tomatoes sourced directly from the mandi.', is_available: true, stock: 50 },
  { id: '4', name: 'Green Chilli', price: 20, unit: '250g', category: 'vegetables', image_url: null, badge: null, description: 'Spicy fresh green chillies.', is_available: true, stock: 40 },
  { id: '5', name: 'Cauliflower', price: 45, unit: '1 pc', category: 'vegetables', image_url: null, badge: null, description: 'Fresh, compact, and clean cauliflower.', is_available: true, stock: 30 },
  { id: '6', name: 'Carrot', price: 35, unit: '500g', category: 'vegetables', image_url: null, badge: null, description: 'Sweet and crunchy fresh carrots.', is_available: true, stock: 60 },
  { id: '7', name: 'Fresh Apple (Shimla)', price: 150, unit: '1 kg', category: 'fruits', image_url: null, badge: 'premium', description: 'Sweet and crunchy fresh apples.', is_available: true, stock: 25 },
  { id: '8', name: 'Banana (Robusta)', price: 60, unit: '1 Dozen', category: 'fruits', image_url: null, badge: 'popular', description: 'Fresh, perfectly ripe bananas.', is_available: true, stock: 20 },
  { id: '9', name: 'Pomegranate', price: 180, unit: '1 kg', category: 'fruits', image_url: null, badge: null, description: 'Ruby red, sweet and juicy pomegranates.', is_available: true, stock: 70 },
  { id: '10', name: 'Papaya', price: 50, unit: '1 pc', category: 'fruits', image_url: null, badge: null, description: 'Sweet and ripe papaya.', is_available: true, stock: 45 },
]

type Product = typeof DEMO_PRODUCTS[0]

const ProductCard = ({ p, i, handleAdd }: { p: Product, i: number, handleAdd: (p: Product) => void }) => {
  const Icon = PRODUCT_ICONS[p.category] || Package;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }} viewport={{ once: true }}
      className="glass-card p-5 flex flex-col h-full">
      <div className="h-36 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
        style={{ background: 'var(--bg-tertiary)' }}>
        {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : (
          <Icon size={48} style={{ color: 'var(--accent)' }} />
        )}
        {p.badge && (
          <span className={`badge ${p.badge === 'bestseller' || p.badge === 'popular' || p.badge === 'premium' ? 'badge-amber' : 'badge-green'}`}
            style={{ position: 'absolute', top: 8, right: 8, textTransform: 'capitalize' }}>
            {p.badge}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
        <p className="text-xs mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-baseline">
            <span className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>₹{p.price}</span>
            <span className="text-xs ml-1 leading-none" style={{ color: 'var(--text-muted)' }}>/{p.unit}</span>
          </div>
          <button onClick={() => handleAdd(p)}
            className="flex items-center gap-1.5 btn-primary text-xs px-3 py-1.5 rounded-full">
            <ShoppingCart size={13} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const catParam = searchParams.get('cat') || ''
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [filtered, setFiltered] = useState<Product[]>(DEMO_PRODUCTS)
  const [category, setCategory] = useState(catParam)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    supabase.from('products').select('*').eq('is_available', true)
      .then(({ data }) => { if (data && data.length > 0) setProducts(data as any) })
  }, [])

  useEffect(() => {
    let list = [...products]
    if (category) list = list.filter(p => p.category === category)
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price)
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    setFiltered(list)
  }, [products, category, search, sortBy])

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, image_url: p.image_url })
    toast.success(`${p.name} added!`)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Our Products</h1>
            <p style={{ color: 'var(--text-muted)' }}>Fresh vegetables and fruits delivered to your door every day</p>
          </div>

          {/* Filters */}
          <div className="glass-card-static p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                  className="glass-input !pl-10" />
              </div>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="glass-input" style={{ width: 'auto', minWidth: 160 }}>
                <option value="default">Sort: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === c.value ? 'btn-primary' : 'btn-secondary'}`}>
                  <c.icon size={16} /> {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} handleAdd={handleAdd} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="flex justify-center mb-5">
                <Search size={64} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>No products found</p>
              <button onClick={() => { setSearch(''); setCategory('') }} className="btn-primary mt-4 rounded-full">Clear Filters</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

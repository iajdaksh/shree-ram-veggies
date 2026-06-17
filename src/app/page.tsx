'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/cartStore'
import { ShoppingCart, Truck, Store, Star, Shield, Leaf, ArrowRight, CheckCircle, GlassWater, Package, Database, Droplet, Cake, Sparkles, Tractor } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CATEGORIES = [
  { name: 'Fresh Vegetables', icon: Leaf, href: '/products?cat=vegetables', count: '50+ items' },
  { name: 'Fresh Fruits', icon: Sparkles, href: '/products?cat=fruits', count: '15+ items' },
  { name: 'Leafy Greens', icon: Tractor, href: '/products?cat=vegetables', count: 'Spinach, etc.' },
  { name: 'Root Vegetables', icon: Database, href: '/products?cat=vegetables', count: 'Potato, Onion' },
  { name: 'Seasonal Picks', icon: Star, href: '/products', count: 'Limited' },
  { name: 'All Produce', icon: ShoppingCart, href: '/products', count: 'View All' },
]

const DEMO_PRODUCTS = [
  { id: '1', name: 'Fresh Potato', price: 30, unit: '1 kg', category: 'vegetables', badge: 'Bestseller', description: 'Fresh daily sourced potatoes.' },
  { id: '7', name: 'Fresh Apple (Shimla)', price: 150, unit: '1 kg', category: 'fruits', badge: 'Premium', description: 'Sweet and crunchy fresh apples.' },
  { id: '3', name: 'Tomato', price: 50, unit: '1 kg', category: 'vegetables', badge: 'Fresh Daily', description: 'Juicy red tomatoes sourced directly from the mandi.' },
  { id: '8', name: 'Banana (Robusta)', price: 60, unit: '1 Dozen', category: 'fruits', badge: 'Popular', description: 'Fresh, perfectly ripe bananas.' },
  { id: '2', name: 'Red Onion', price: 40, unit: '1 kg', category: 'vegetables', badge: null, description: 'Crisp and fresh red onions from local farms.' },
  { id: '5', name: 'Cauliflower', price: 45, unit: '1 pc', category: 'vegetables', badge: null, description: 'Fresh, compact, and clean cauliflower.' },
]

const ICONS: Record<string, any> = { vegetables: Leaf, fruits: Sparkles }

const FEATURES = [
  { icon: Leaf, title: 'Farm Fresh', desc: 'Sourced from local farms & mandis daily' },
  { icon: Shield, title: 'Quality Assured', desc: 'Hand-picked and sorted for quality' },
  { icon: Truck, title: 'Same Day Delivery', desc: 'Order before 10 AM for same-day delivery' },
  { icon: Star, title: '5000+ Families', desc: 'Trusted across Muzaffarnagar for 20+ years' },
]

export default function HomePage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    supabase.from('products').select('*').eq('is_featured', true).eq('is_available', true).limit(6)
      .then(({ data }) => { if (data && data.length > 0) setProducts(data as any) })
  }, [])

  const add = (p: typeof DEMO_PRODUCTS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, image_url: null })
    toast.success(`${p.name} added to cart`)
  }

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section style={{ background: 'var(--bg-base)' }} className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                  style={{ background:'var(--success-bg)', color:'var(--success)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                  Fresh delivery available for pincode 251001
                </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-tight mb-5 tracking-tight"
                style={{ color: 'var(--text-primary)' }}>
                  Fresh vegetables,<br />
                  <span style={{ color: 'var(--accent)' }}>delivered fresh</span><br />
                  to your door.
                </h1>
                <p className="text-lg mb-8 max-w-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  From local farms and mandis to your kitchen — fresh vegetables, fruits & more. Handpicked daily for maximum freshness.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/products" className="btn btn-primary btn-lg">
                    Shop Products <ArrowRight size={16} />
                  </Link>
                  <Link href="/about" className="btn btn-secondary btn-lg">Learn our story</Link>
                </div>
                <div className="flex flex-wrap gap-5 mt-8">
                  {['Locally Sourced', 'Same-day delivery', 'Cash on delivery', 'Freshly Picked'].map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }} className="py-12">
          <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i*0.07 }} viewport={{ once:true }} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-light)' }}>
                  <f.icon size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="py-16 max-w-6xl mx-auto px-5">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Browse by category
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Made fresh every morning</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }}
                transition={{ delay: i*0.06 }} viewport={{ once:true }}>
                <Link href={cat.href}
                  className="card p-4 text-center block group"
                  style={{ textDecoration: 'none' }}>
                  <div className="flex justify-center mb-3">
                    <cat.icon size={28} style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{cat.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="pb-16 max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between mb-8">
            <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Featured products
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Freshest picks from today's batch</p>
            </div>
            <Link href="/products" className="btn btn-secondary btn-sm">
              All products <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i*0.06 }} viewport={{ once:true }}
                className="card p-5 flex flex-col h-full">
                <div className="h-32 rounded-lg flex items-center justify-center mb-4 relative"
                  style={{ background: 'var(--bg-subtle)' }}>
                  {(() => {
                    const Icon = ICONS[p.category] || Leaf;
                    return <Icon size={48} style={{ color: 'var(--accent)' }} />
                  })()}
                  {p.badge && (
                    <span className="badge badge-accent absolute top-2 right-2 text-xs">{p.badge}</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <p className="text-xs mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>₹{p.price}</span>
                      <span className="text-xs ml-1 leading-none" style={{ color: 'var(--text-muted)' }}>/{p.unit}</span>
                    </div>
                    <button onClick={() => add(p)}
                      className="flex items-center gap-1.5 btn-primary text-xs px-3 py-1.5 rounded-full">
                      <ShoppingCart size={13} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── DELIVERY SECTION ── */}
        <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }} className="py-16">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  Two ways to get your veggies
                </h2>
                <div className="space-y-3">
                  {[
                    { icon: Truck, title: 'Home Delivery', desc: 'Free above ₹200 · Same day if ordered before 10 AM', sub: '₹20 below ₹200', ok: true },
                    { icon: Store, title: 'Store Pickup',  desc: 'Pick up at our local dairy center. Always free.', sub: 'Open 5 AM – 9 PM daily', ok: true },
                  ].map(opt => (
                    <div key={opt.title} className="card-flat p-4 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'var(--accent-light)' }}>
                        <opt.icon size={16} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{opt.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--success)' }}>{opt.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Tractor size={64} style={{ color: 'var(--accent)' }} className="anim-float" />
                </div>
              <p className="font-serif font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  Mandi to doorstep
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                  Hand-picked from the mandi and local farmers, sorted and packed every morning.
                </p>
                <Link href="/products" className="btn btn-primary">Order Now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-16 max-w-6xl mx-auto px-5">
          <h2 className="font-serif text-2xl font-semibold tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Trusted by families across Muzaffarnagar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Priya Sharma', area: 'Gandhi Nagar', text: 'The vegetables are always so fresh and crisp. Much better than the supermarket!', rating: 5 },
              { name: 'Rajesh Gupta', area: 'Kukra', text: 'Our family has been ordering from Shree Ram Veggies for a year. The quality is consistently excellent!', rating: 5 },
              { name: 'Sunita Verma', area: 'Haripuram', text: 'The fruits are so juicy and sweet. My kids love the apples and bananas.', rating: 5 },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i*0.09 }} viewport={{ once:true }}
                className="card p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill(0).map((_,j) => (
                    <Star key={j} size={13} fill="#C96A2A" style={{ color: '#C96A2A' }} />
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.area}, Muzaffarnagar</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: 'var(--accent-light)', borderTop: '1px solid rgba(201,106,42,0.12)' }} className="py-16">
          <div className="max-w-6xl mx-auto px-5 text-center">
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
              <p className="font-serif text-3xl font-semibold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Get your daily veggies delivered
              </p>
              <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Create a free account to place orders, save your address and track deliveries.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/auth" className="btn btn-primary btn-lg">Create free account</Link>
                <Link href="/products" className="btn btn-secondary btn-lg">Browse products</Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

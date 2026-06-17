'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Truck, Store, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Banknote, ShoppingCart, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [deliveryType, setDeliveryType] = useState<'home_delivery' | 'pickup'>('home_delivery')
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)

  const subtotal = totalPrice()
  const deliveryFee = deliveryType === 'home_delivery' ? (subtotal < 200 ? 20 : 0) : 0
  const total = subtotal + deliveryFee

  const handleCheckout = async () => {
    if (!user) { router.push('/auth'); return }
    if (items.length === 0) { toast.error('Cart is empty'); return }

    setPlacing(true)
    try {
      const orderNumber = `AD${Date.now().toString().slice(-8)}`
      const orderItems = items.map(i => ({
        product_id: i.id,
        product_name: i.name,
        quantity: i.quantity,
        price: i.price,
        unit: i.unit,
      }))

      const { data, error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        user_id: user.id,
        items: orderItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
        delivery_type: deliveryType,
        payment_method: 'cod',
        notes: notes || null,
      }).select().single()

      if (error) throw error

      // Send notification (non-blocking)
      fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.id, orderNumber, userEmail: user.email, total, deliveryType }),
      }).catch(() => {})

      clearCart()
      toast.success(`Order #${orderNumber} placed! 🎉`)
      router.push(`/account/orders?success=${orderNumber}`)
    } catch (err: any) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-sm mx-4">
            <div className="flex justify-center mb-6">
              <ShoppingCart size={64} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Add some fresh vegetables and fruits to get started</p>
            <Link href="/products" className="btn btn-primary">
              <ShoppingBag size={16} /> Browse Products
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover rounded-xl" alt={item.name} />
                    : <Leaf size={32} style={{ color: 'var(--accent)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>₹{item.price} / {item.unit}</p>
                    <p className="font-bold text-sm" style={{ color: 'var(--accent)' }}>₹{item.price * item.quantity}</p>
                  </div>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                    <span className="font-bold w-6 text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="qty-btn" style={{ color: 'var(--danger)' }}>
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-5">
              {/* Delivery Type */}
              <div className="glass-card-static p-5">
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Delivery Option</h3>
                <div className="space-y-3">
                  {[
                    { value: 'home_delivery', icon: Truck, label: 'Home Delivery', desc: subtotal < 200 ? '₹20 delivery charge' : 'FREE delivery', highlight: subtotal >= 200 },
                    { value: 'pickup', icon: Store, label: 'Store Pickup', desc: 'Free • Haripuram Kukra', highlight: true },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setDeliveryType(opt.value as any)}
                      className={`w-full p-4 rounded-xl text-left flex items-start gap-3 transition-all border ${deliveryType === opt.value ? 'border-[color:var(--border-strong)]' : 'border-transparent'}`}
                      style={{ background: deliveryType === opt.value ? 'var(--bg-tertiary)' : 'var(--bg-subtle)' }}>
                      <opt.icon size={18} style={{ color: 'var(--accent)', marginTop: 2 }} />
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{opt.label}</div>
                        <div className="text-xs" style={{ color: opt.highlight ? 'var(--accent)' : 'var(--text-muted)' }}>{opt.desc}</div>
                      </div>
                      {deliveryType === opt.value && (
                        <span className="ml-auto font-bold" style={{ color: 'var(--accent)' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="glass-card-static p-5">
                <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Order Notes (Optional)</h3>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  className="glass-input resize-none text-sm" />
              </div>

              {/* Summary */}
              <div className="glass-card-static p-5">
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>Subtotal</span><span>₹{subtotal}</span>
                  </div>
                      <div className="flex justify-between" style={{ color: deliveryFee === 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    <span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="section-divider my-3" />
                  <div className="flex justify-between font-bold text-base">
                    <span style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span style={{ color: 'var(--accent)' }}>₹{total}</span>
                  </div>
                  <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Banknote size={14} /> Cash on Delivery
                  </p>
                </div>
                <button onClick={handleCheckout} disabled={placing}
                  className="glass-card w-full mt-5 flex items-center justify-center gap-3 py-4 text-base font-bold transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'rgba(142, 182, 155, 0.4)', color: 'var(--text-primary)' }}>
                  {placing ? (
                    <><span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />Placing Order...</>
                  ) : (
                    <><ArrowRight size={20} />Place Order</>
                  )}
                </button>
                {!user && (
                  <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                    <Link href="/auth" style={{ color: 'var(--accent)' }}>Sign in</Link> to place your order
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

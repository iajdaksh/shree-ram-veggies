'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Package, Truck, Store, CheckCircle, Clock, X } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

type Order = {
  id: string
  order_number: string
  items: any[]
  subtotal: number
  delivery_fee: number
  total: number
  status: string
  delivery_type: string
  notes: string | null
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'status-pending', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'status-confirmed', icon: CheckCircle },
  out_for_delivery: { label: 'Out for Delivery', color: 'status-out_for_delivery', icon: Truck },
  delivered: { label: 'Delivered', color: 'status-delivered', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'status-cancelled', icon: X },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const successOrder = searchParams.get('success')

  useEffect(() => {
    if (!user) return
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || [])
        setLoading(false)
      })
  }, [user])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {successOrder && (
        <div className="glass-card-static p-4 mb-5 flex items-center gap-3" style={{ borderColor: '#22C55E', borderWidth: 1 }}>
          <CheckCircle size={20} color="#22C55E" />
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Order #{successOrder} placed successfully!</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>We'll notify you when it's confirmed.</p>
          </div>
        </div>
      )}

      <div className="glass-card-static p-6 mb-5">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Orders</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track all your orders here</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass-card-static p-5 h-24 animate-pulse" style={{ background: 'var(--glass-bg)' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>No orders yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isExpanded = expanded === order.id
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="glass-card-static overflow-hidden">
                <button className="w-full p-5 text-left flex items-center justify-between gap-4"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--gradient-accent)' }}>
                      {order.delivery_type === 'pickup' ? <Store size={18} color="#0D0800" /> : <Truck size={18} color="#0D0800" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Order #{order.order_number}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {format(new Date(order.created_at), 'dd MMM yyyy, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={sc.color}>{sc.label}</span>
                    <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>₹{order.total}</span>
                  </div>
                </button>

                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="px-5 pb-5 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item: any, j: number) => (
                        <div key={j} className="flex justify-between text-sm">
                          <span style={{ color: 'var(--text-secondary)' }}>{item.product_name} × {item.quantity}</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="section-divider mt-3 mb-3" />
                      <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>Delivery</span><span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span style={{ color: 'var(--text-primary)' }}>Total</span>
                        <span style={{ color: 'var(--accent-gold)' }}>₹{order.total}</span>
                      </div>
                      <div className="flex gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>🚚 {order.delivery_type === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</span>
                        <span>💵 Cash on Delivery</span>
                      </div>
                      {order.notes && (
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📝 {order.notes}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

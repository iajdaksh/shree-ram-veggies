'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Filter, RefreshCw, Truck, Store } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

type Order = {
  id: string
  order_number: string
  user_id: string
  items: any[]
  subtotal: number
  delivery_fee: number
  total: number
  status: string
  delivery_type: string
  notes: string | null
  created_at: string
}

const STATUSES = ['all', 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled']
const STATUS_NEXT: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filtered, setFiltered] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  useEffect(() => {
    let list = [...orders]
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter)
    if (search) list = list.filter(o => o.order_number.toLowerCase().includes(search.toLowerCase()))
    setFiltered(list)
  }, [orders, statusFilter, search])

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId)
    if (error) { toast.error('Update failed'); return }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    toast.success(`Order marked as ${newStatus.replace('_', ' ')}`)
  }

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Cancel this order?')) return
    await updateStatus(orderId, 'cancelled')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Orders</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} orders found</p>
        </div>
        <button onClick={fetchOrders} className="btn-glass flex items-center gap-2 text-sm">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card-static p-4 mb-6 space-y-3">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search order number..." value={search} onChange={e => setSearch(e.target.value)}
            className="glass-input pl-9 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'btn-primary' : 'btn-glass'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="glass-card-static h-16 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card-static p-16 text-center">
          <div className="text-5xl mb-3">📦</div>
          <p style={{ color: 'var(--text-muted)' }}>No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }} className="glass-card-static overflow-hidden">
              {/* Row */}
              <div className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--gradient-accent)' }}>
                  {order.delivery_type === 'pickup' ? <Store size={16} color="#0D0800" /> : <Truck size={16} color="#0D0800" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>#{order.order_number}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>₹{order.total}</span>
                <span className={`status-${order.status}`}>{order.status.replace('_', ' ')}</span>
                {/* Action button */}
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  {STATUS_NEXT[order.status] && (
                    <button onClick={() => updateStatus(order.id, STATUS_NEXT[order.status])}
                      className="btn-primary text-xs px-3 py-1.5 whitespace-nowrap">
                      → {STATUS_NEXT[order.status].replace('_', ' ')}
                    </button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button onClick={() => cancelOrder(order.id)}
                      className="text-xs px-3 py-1.5 rounded-xl border transition-all"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === order.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="px-4 pb-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Items</p>
                      {order.items?.map((item: any, j: number) => (
                        <div key={j} className="flex justify-between text-sm py-1">
                          <span style={{ color: 'var(--text-secondary)' }}>{item.product_name} × {item.quantity} ({item.unit})</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Details</p>
                      <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span style={{ color: 'var(--text-primary)' }}>₹{order.subtotal}</span></div>
                      <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Delivery</span><span style={{ color: order.delivery_fee === 0 ? '#22C55E' : 'var(--text-primary)' }}>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span></div>
                      <div className="flex justify-between font-bold"><span style={{ color: 'var(--text-primary)' }}>Total</span><span style={{ color: 'var(--accent-gold)' }}>₹{order.total}</span></div>
                      <div className="flex justify-between pt-1"><span style={{ color: 'var(--text-muted)' }}>Type</span><span style={{ color: 'var(--text-secondary)' }}>{order.delivery_type === 'pickup' ? '🏪 Store Pickup' : '🚚 Home Delivery'}</span></div>
                      {order.notes && <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Notes</span><span style={{ color: 'var(--text-secondary)' }}>{order.notes}</span></div>}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

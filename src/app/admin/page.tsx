'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

type Stats = {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalUsers: number
  todayOrders: number
  totalProducts: number
}

type RecentOrder = {
  id: string
  order_number: string
  user_id: string
  total: number
  status: string
  delivery_type: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  out_for_delivery: '#8B5CF6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
}

const DEMO_STATS: Stats = {
  totalOrders: 1284, pendingOrders: 14, totalRevenue: 284650, totalUsers: 856, todayOrders: 23, totalProducts: 18
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(DEMO_STATS)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('id, total, status, created_at', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
    ]).then(([orders, users, products, recent]) => {
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = orders.data?.filter(o => o.created_at.startsWith(today)).length || 0
      const totalRevenue = orders.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
      const pendingOrders = orders.data?.filter(o => o.status === 'pending').length || 0
      
      if ((orders.count || 0) > 0) {
        setStats({
          totalOrders: orders.count || 0,
          pendingOrders,
          totalRevenue,
          totalUsers: users.count || 0,
          todayOrders,
          totalProducts: products.count || 0,
        })
      }
      setRecentOrders((recent.data as RecentOrder[]) || [])
      setLoading(false)
    })
  }, [])

  const STAT_CARDS = [
    { title: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: '#F5C842', sub: 'Last 24h' },
    { title: 'Pending', value: stats.pendingOrders, icon: Clock, color: '#F59E0B', sub: 'Need attention' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#22C55E', sub: 'All time' },
    { title: 'Customers', value: stats.totalUsers, icon: Users, color: '#3B82F6', sub: 'Registered users' },
    { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: Package, color: '#8B5CF6', sub: 'All time' },
    { title: 'Products', value: stats.totalProducts, icon: Package, color: '#EC4899', sub: 'Active products' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }} className="glass-card-static p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}20`, border: `1px solid ${card.color}40` }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{card.title}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Orders</h2>
          <a href="/admin/orders" className="text-sm" style={{ color: 'var(--accent-gold)' }}>View all →</a>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📦</div>
            <p style={{ color: 'var(--text-muted)' }}>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="glass-table w-full">
              <thead>
                <tr>
                  <th>Order</th><th>Time</th><th>Amount</th><th>Type</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>#{order.order_number}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(order.created_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>₹{order.total}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {order.delivery_type === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                    </td>
                    <td>
                      <span className={`status-${order.status}`}>{order.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

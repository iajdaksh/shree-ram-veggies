'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

const ADMIN_LINKS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && profile && profile.role !== 'admin') router.push('/')
    if (!loading && !profile) router.push('/auth')
  }, [profile, loading])

  if (loading || !profile) return null
  if (profile.role !== 'admin') return null

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col p-4" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'var(--gradient-accent)' }}>🥬</div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--accent-gold)' }}>Admin Panel</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Shree Ram Veggies</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {ADMIN_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`sidebar-item ${pathname === link.href ? 'active' : ''}`}>
              <link.icon size={16} />{link.label}
              {pathname === link.href && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <Link href="/" className="sidebar-item"><Home size={16} />View Site</Link>
          <button onClick={signOut} className="sidebar-item w-full text-left" style={{ color: 'var(--danger)' }}>
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={pathname}>
          {children}
        </motion.div>
      </main>
    </div>
  )
}

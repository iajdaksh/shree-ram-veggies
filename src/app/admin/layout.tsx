'use client'
import { useEffect, FC } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, ChevronRight, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCursor from '@/components/CustomCursor'

const ADMIN_LINKS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  isButton?: boolean;
  className?: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({ href, icon: Icon, label, isActive, onClick, isButton, className = '' }) => {
  const content = (
    <>
      <Icon size={16} className={isActive ? 'text-white' : 'text-[var(--text-muted)]'} />
      <span className="font-medium">{label}</span>
      {isActive && <ChevronRight size={14} className="ml-auto" />}
    </>
  );

  const classes = `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-white/10 text-white' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
  } ${className}`;

  if (isButton) {
    return <button onClick={onClick} className={`w-full text-left ${classes}`}>{content}</button>;
  }

  return <Link href={href} className={classes}>{content}</Link>;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return;
    if (!profile) router.push('/auth');
    else if (profile.role !== 'admin') router.push('/');
  }, [profile, loading, router])

  if (loading || !profile || profile.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}><span className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--accent)' }} /></div>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <CustomCursor />
      {/* Sidebar */}
      <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col p-4" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)' }}>
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
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}
        </nav>

        <div className="space-y-1 mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <SidebarLink href="/" icon={Home} label="View Site" isActive={false} />
          <SidebarLink
            href="#"
            icon={LogOut}
            label="Sign Out"
            isActive={false}
            isButton
            onClick={logout}
            className="!text-red-500 hover:!bg-red-500/10 hover:!text-red-400"
          />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} key={pathname}>{children}</motion.div></AnimatePresence>
      </main>
    </div>
  )
}

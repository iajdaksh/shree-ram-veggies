'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/lib/cartStore'
import { ShoppingCart, Menu, X, User, LogOut, Settings, Package, MapPin, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCursor from './CustomCursor'

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/products', label: 'Products' },
  { href: '/about',    label: 'About'    },
  { href: '/contact',  label: 'Contact'  },
]

export default function Navbar() {
  const pathname   = usePathname()
  const { user, profile, logout, isAdmin } = useAuth()
  const totalItems = useCartStore(s => s.totalItems())
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isMounted,    setIsMounted]    = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false) }, [pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <CustomCursor />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav ${scrolled ? 'py-3' : 'py-4'}`}>
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Leaf size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                Shree Ram Veggies
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)', background: active ? 'var(--accent-light)' : 'transparent' }}>
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart" className="btn btn-icon btn-secondary relative">
              <ShoppingCart size={15} style={{ color: 'var(--text-secondary)' }} />
              {isMounted && totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {/* User menu */}
            {profile ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="btn btn-icon btn-secondary relative">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold"
                    style={{ color: 'var(--accent)' }}>
                    {profile?.avatar_url || user?.user_metadata?.avatar_url || user?.image
                      ? <img src={profile?.avatar_url || user?.user_metadata?.avatar_url || user?.image} className="w-full h-full object-cover" alt="avatar" />
                      : <User size={14} style={{ color: 'var(--accent)' }} />
                    }
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.12 }}
                      className="glass-card absolute right-0 mt-2 w-52 p-2 z-50 flex flex-col gap-0.5 shadow-xl">
                      {[
                        { href: '/account',           icon: User,     label: 'My Account' },
                        { href: '/account/orders',    icon: Package,  label: 'My Orders'  },
                        { href: '/account/addresses', icon: MapPin,   label: 'Addresses'  },
                        ...(isAdmin ? [{ href: '/admin', icon: Settings, label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link key={item.href} href={item.href}
                          className="nav-item text-sm w-full flex items-center gap-3 px-3 py-2 rounded-md">
                          <item.icon size={15} style={{ color: 'var(--text-muted)' }} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                      <div className="h-px w-full my-1" style={{ background: 'var(--border-light)' }} />
                      <button onClick={logout}
                        className="nav-item text-sm w-full flex items-center gap-3 px-3 py-2 rounded-md" style={{ color: 'var(--danger)' }}>
                        <LogOut size={15} />
                        <span className="font-medium">Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth" className="btn btn-secondary" style={{ height: '34px', padding: '0 14px', borderRadius: 'var(--radius-md)' }}>
                <User size={15} /> Sign in
              </Link>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-icon btn-secondary md:hidden">
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0, scale: 0.98 }} animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
              className="md:hidden px-4 pt-3 pb-2 origin-top">
              <div className="glass-card p-2 flex flex-col gap-1">
                {NAV_LINKS.map(link => {
                  const active = pathname === link.href
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                      className={`nav-item w-full ${active ? 'active' : ''}`}>
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div style={{ height: 64 }} />
    </>
  )
}

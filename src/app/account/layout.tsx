'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Package, MapPin, User, Star, LogOut, Home, Settings } from 'lucide-react'
import Navbar from '@/components/Navbar'

const ACCOUNT_LINKS = [
  { href: '/account', icon: User, label: 'Profile' },
  { href: '/account/orders', icon: Package, label: 'My Orders' },
  { href: '/account/addresses', icon: MapPin, label: 'Addresses' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-16 flex justify-center items-start">
          <span className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--accent)' }} />
        </div>
      </>
    )
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="glass-card p-5 sticky top-24 shadow-lg">
                {/* Profile card */}
                <div className="text-center mb-5 pb-5 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold overflow-hidden"
                    style={{ background: 'var(--gradient-accent)', color: '#0D0800' }}>
                    {profile?.avatar_url || user?.user_metadata?.avatar_url || user?.image
                      ? <img src={profile?.avatar_url || user?.user_metadata?.avatar_url || user?.image} className="w-full h-full object-cover" alt="avatar" />
                      : (profile?.full_name?.[0] || user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{profile?.full_name || user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{profile?.email || user?.email}</p>
                </div>
                {/* Links */}
                <nav className="space-y-1.5 mt-2">
                  {ACCOUNT_LINKS.map(link => (
                    <Link key={link.href} href={link.href} className="sidebar-item flex items-center gap-3 w-full px-3 py-2.5 rounded-md transition-colors hover:bg-white/5">
                      <link.icon size={18} style={{ color: 'var(--text-muted)' }} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                  <div className="h-px w-full my-3" style={{ background: 'var(--border-light)' }} />
                  <Link href="/" className="sidebar-item flex items-center gap-3 w-full px-3 py-2.5 rounded-md transition-colors hover:bg-white/5">
                    <Home size={18} style={{ color: 'var(--text-muted)' }} />
                    <span className="font-medium">Home</span>
                  </Link>
                  <button onClick={signOut} className="sidebar-item flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left transition-colors hover:bg-white/5" style={{ color: 'var(--danger)' }}>
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>
            {/* Content */}
            <div className="md:col-span-3">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

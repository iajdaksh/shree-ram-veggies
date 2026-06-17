import Link from 'next/link'
import { MapPin, Phone, Mail, Leaf, MessageCircle, Heart } from 'lucide-react'

const PRODUCT_LINKS = [
  { label: 'Fresh Vegetables', href: '/products?cat=vegetables' },
  { label: 'Fresh Fruits', href: '/products?cat=fruits' },
  { label: 'Seasonal Picks', href: '/products?cat=seasonal' },
  { label: 'Bestsellers', href: '/products?badge=bestseller' },
  { label: 'All Produce', href: '/products' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)' }} className="mt-20">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                <Leaf size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                Shree Ram Veggies
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Fresh vegetables and fruits from Muzaffarnagar. Trusted by families since 2000.
            </p>
            <div className="space-y-2">
              <a href="https://wa.me/91XXXXXXXXXX" className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                <MessageCircle size={13} /> WhatsApp
              </a>
              <a href="mailto:hello@shreeramveggies.online" className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                <Mail size={13} /> Email us
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>Products</p>
            {PRODUCT_LINKS.map(item => (
              <Link key={item.label} href={item.href}
                className="block text-sm py-1 text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>Company</p>
            {[
              { label: 'About',    href: '/about'   },
              { label: 'Contact',  href: '/contact' },
              { label: 'Terms',    href: '/terms'   },
              { label: 'Privacy',  href: '/privacy' },
              { label: 'Refunds',  href: '/refund'  },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="block text-sm py-1 text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>Find Us</p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Haripuram Kukra Locality Gandhi Nagar,<br />Muzaffarnagar, UP — 251001</p>
              </div>
              <div className="flex gap-2">
                <Phone size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>+91 XXXXX XXXXX</p>
              </div>
              <div className="card-subtle p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <p className="font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>Open daily</p>
                5:00 AM – 9:00 PM
              </div>
            </div>
          </div>
        </div>

        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'var(--text-faint)' }}>
          <p>© {new Date().getFullYear()} Shree Ram Veggies. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={12} fill="var(--accent)" style={{ color: 'var(--accent)' }} /> in Muzaffarnagar
          </p>
        </div>
      </div>
    </footer>
  )
}

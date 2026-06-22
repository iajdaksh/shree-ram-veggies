import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Lock } from 'lucide-react'
import { format } from 'date-fns'

const getCurrentDate = () => {
  // This will format the date as "Month Year", e.g., "June 2024"
  return format(new Date(), 'MMMM yyyy')
}

export default function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide when creating an account (name, email, phone number), placing orders (delivery address, order details), and using our services (browsing behaviour, device information). We use Google OAuth for sign-in, which shares your name and email with us.' },
    { title: '2. How We Use Your Information', content: 'Your information is used to: process and deliver your orders; send order confirmations and status updates via email and WhatsApp; improve our products and services; communicate offers and promotions (only with your consent); comply with legal obligations.' },
    { title: '3. WhatsApp Notifications', content: 'If you provide your WhatsApp number, we will send order updates and delivery notifications to that number. You can opt out at any time by updating your account settings or contacting us.' },
    { title: '4. Data Storage & Security', content: 'Your data is stored securely using Supabase (PostgreSQL) with industry-standard encryption. We implement appropriate technical measures to protect against unauthorized access, alteration, or disclosure of your personal data.' },
    { title: '5. Sharing of Information', content: 'We do not sell, rent, or trade your personal information to third parties. We may share data with service providers who assist in our operations (e.g., payment gateways, delivery partners) under strict confidentiality agreements.' },
    { title: '6. Cookies', content: 'Our website uses cookies to maintain your session, remember your cart, and improve your experience. You can control cookie settings through your browser. Disabling cookies may affect certain functionality.' },
    { title: '7. Your Rights', content: 'You have the right to: access the personal information we hold about you; request correction of inaccurate data; request deletion of your account and data; withdraw consent for marketing communications at any time.' },
    { title: '8. Children\'s Privacy', content: 'Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children.' },
    { title: '9. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on our website. Continued use of our services after changes constitutes acceptance.' },
    { title: '10. Contact Us', content: 'For any privacy-related queries or to exercise your rights, contact us at: hello@shreeramveggies.online | Shree Ram Veggies, Haripuram Kukra Locality Gandhi Nagar, Muzaffarnagar, UP — 251001.' },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="glass-card-static p-8 mb-6">
            <div className="mb-4">
              <Lock size={40} style={{ color: 'var(--accent)' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: {getCurrentDate()} · We respect and protect your privacy.</p>
          </div>
          <div className="space-y-4">
            {sections.map(s => (
              <div key={s.title} className="glass-card-static p-6">
                <h2 className="font-bold mb-3" style={{ color: 'var(--accent)' }}>{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

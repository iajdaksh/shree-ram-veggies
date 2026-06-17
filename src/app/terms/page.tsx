import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using the Shree Ram Veggies website (shreeramveggies.online), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
    },
    {
      title: '2. Products & Orders',
      content: 'All products are subject to availability. We reserve the right to limit quantities. Prices are subject to change without prior notice. Orders are confirmed only after payment verification or admin approval for Cash on Delivery orders. Images shown are for representation purposes only.',
    },
    {
      title: '3. Delivery Policy',
      content: 'Home delivery is available in select areas of Muzaffarnagar. Orders placed before 10:00 AM will be delivered the same day. Delivery charges of ₹20 apply for orders below ₹200. Free delivery for orders above ₹200. Store pickup is always free of charge.',
    },
    {
      title: '4. Payment',
      content: 'We currently accept Cash on Delivery (COD) only. Online payment options will be added soon. Please ensure you have the exact amount ready at the time of delivery.',
    },
    {
      title: '5. Cancellation Policy',
      content: 'Orders can be cancelled before they are dispatched. Once the order is marked "Out for Delivery", cancellation is not possible. To cancel, please contact us immediately via WhatsApp or phone.',
    },
    {
      title: '6. Account Responsibilities',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate personal information during registration. We reserve the right to terminate accounts that violate these terms.',
    },
    {
      title: '7. Intellectual Property',
      content: 'All content on this website including text, images, logos, and design elements are the property of Shree Ram Veggies. Unauthorized reproduction or distribution is strictly prohibited.',
    },
    {
      title: '8. Limitation of Liability',
      content: 'Shree Ram Veggies is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the value of the order placed.',
    },
    {
      title: '9. Governing Law',
      content: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Muzaffarnagar, Uttar Pradesh.',
    },
    {
      title: '10. Contact',
      content: 'For any queries regarding these Terms, contact us at hello@shreeramveggies.online or visit us at Haripuram Kukra Locality Gandhi Nagar, Muzaffarnagar, UP — 251001.',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="glass-card-static p-8 mb-6">
            <div className="mb-4">
              <FileText size={40} style={{ color: 'var(--accent)' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Terms & Conditions</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: December 2024 · Effective for all users of shreeramveggies.online</p>
          </div>

          <div className="space-y-4">
            {sections.map((s) => (
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

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Undo2 } from 'lucide-react'
import { format } from 'date-fns'

const getCurrentDate = () => {
  // This will format the date as "Month Year", e.g., "June 2024"
  return format(new Date(), 'MMMM yyyy')
}

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="glass-card-static p-8 mb-6">
            <div className="mb-4">
              <Undo2 size={40} style={{ color: 'var(--accent)' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Refund & Return Policy</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: {getCurrentDate()}</p>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Our Commitment', content: 'At Shree Ram Veggies, we stand behind the quality of every product we deliver. If you are not satisfied, we will make it right.' },
              { title: 'Eligible Refunds', content: 'Refunds are applicable in the following cases: (1) Wrong product delivered; (2) Product is spoiled or of poor quality at time of delivery; (3) Order not delivered but marked as delivered; (4) Quantity is less than what was ordered.' },
              { title: 'How to Request a Refund', content: 'Contact us within 2 hours of delivery via WhatsApp (+91 XXXXX XXXXX) or email (hello@shreeramveggies.online). Share your order number and a photo of the issue. Our team will review and respond within 4 hours.' },
              { title: 'Refund Process', content: 'Since we currently operate on Cash on Delivery, refunds are processed as: (1) Credit to your next order; (2) Cash refund with next delivery; (3) Free replacement with next available delivery slot.' },
              { title: 'Non-Refundable Cases', content: 'Refunds will not be provided for: Change of mind after delivery; Improper storage by the customer after delivery; Orders cancelled after dispatch.' },
              { title: 'Cancellation Before Delivery', content: 'Orders can be cancelled for a full credit note if cancelled before dispatch. Contact us immediately on WhatsApp to cancel.' },
            ].map(s => (
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

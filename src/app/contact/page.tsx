'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle, PhoneCall } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    toast.success('Message sent! We\'ll reply within 24 hours.')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="orb orb-gold w-80 h-80 -top-20 right-0 absolute" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-center mb-5">
                <PhoneCall size={64} style={{ color: 'var(--accent)' }} />
              </div>
              <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Get In Touch</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Have a question, feedback, or want to place a bulk order? We'd love to hear from you.</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Info */}
            <div className="space-y-5 h-full">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Contact Information</h2>

                <div className="space-y-4 mb-6 flex-1">
                  {[
                    { icon: MapPin, title: 'Our Address', lines: ['Haripuram Kukra Locality Gandhi Nagar', 'Muzaffarnagar, UP — 251001'] },
                    { icon: Phone, title: 'Call Us', lines: ['+91 XXXXX XXXXX', 'Mon–Sun, 5 AM – 9 PM'] },
                    { icon: Mail, title: 'Email Us', lines: ['hello@shreeramveggies.online', 'Reply within 24 hours'] },
                    { icon: Clock, title: 'Business Hours', lines: ['Monday – Sunday', '5:00 AM – 9:00 PM'] },
                  ].map(item => (
                    <div key={item.title} className="glass-card p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--bg-tertiary)' }}>
                        <item.icon size={18} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                        {item.lines.map(line => <p key={line} className="text-sm" style={{ color: 'var(--text-muted)' }}>{line}</p>)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <a href="https://wa.me/91XXXXXXXXXX?text=Hello%20Shree%20Ram%20Veggies%2C%20I%20have%20a%20query"
                  target="_blank" rel="noopener"
                  className="glass-card w-full flex items-center justify-center gap-3 py-4 text-base font-bold transition-all hover:brightness-110"
                  style={{ background: 'rgba(142, 182, 155, 0.4)', color: 'var(--text-primary)' }}>
                  <MessageCircle size={20} /> Chat on WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send a Message</h2>
              {sent ? (
                <div className="glass-card-static p-7 text-center py-10 flex-1 flex flex-col items-center justify-center">
                  <CheckCircle size={56} className="mx-auto mb-4" style={{ color: 'var(--success)' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                    className="glass-card mt-5 px-6 py-2.5 text-sm font-bold transition-all hover:brightness-110"
                    style={{ background: 'rgba(142, 182, 155, 0.3)' }}>Send Another</button>
                </div>
              ) : (
                <>
                  <div className="glass-card-static p-7 mb-6 flex-1">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name *</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name" className="glass-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email *</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com" className="glass-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Phone</label>
                        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX" className="glass-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Message *</label>
                        <textarea rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                          placeholder="Your question or message..." className="glass-input resize-none" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={sending}
                    className="glass-card w-full flex items-center justify-center gap-3 py-4 text-base font-bold transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'rgba(142, 182, 155, 0.4)', color: 'var(--text-primary)' }}>
                    {sending
                      ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : <Send size={20} />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>Our Location</h2>
            <div className="glass-card p-2">
              <div className="overflow-hidden rounded-xl" style={{ height: 350, background: 'var(--bg-tertiary)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13892.42983579168!2d77.68943785!3d29.48673865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c1b379446a855%3A0x44847a6d735a4e58!2sHaripuram%2C%20Muzaffarnagar%2C%20Uttar%20Pradesh%20251001!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  width="100%" height="350" style={{ border: 0, filter: 'grayscale(0.3) opacity(0.8) contrast(1.1)' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Shree Ram Veggies Location"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

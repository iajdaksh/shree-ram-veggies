'use client'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Award, Leaf, Heart, Users, Star, GlassWater, Tractor, Briefcase, FlaskConical, Medal, Home, CheckCircle, Building } from 'lucide-react'

const TIMELINE = [
  { year: '2000', title: 'Founded', desc: 'Shree Ram Veggies was started by Ramachandra Prajapati, sourcing fresh vegetables from local farmers and the Sabji Mandi.' },
  { year: '2010', title: 'Expanded', desc: 'Expanded our sourcing network to bring a wider variety of seasonal fruits and vegetables to our customers.' },
  { year: '2015', title: 'Quality Focus', desc: 'Established strict daily quality checks to ensure only the best produce reaches your kitchen.' },
  { year: '2020', title: 'Online Delivery', desc: 'Started online home delivery during COVID-19 to serve families safely at their doorstep.' },
  { year: '2024', title: 'Digital Platform', desc: 'Full e-commerce platform for seamless ordering of daily fresh vegetables and fruits.' },
]

const VALUES = [
  { icon: Leaf, title: 'Fresh Daily', desc: 'Handpicked every morning from the mandi and local farmers for maximum freshness.' },
  { icon: Heart, title: 'Family First', desc: 'We deliver the same quality of vegetables we would cook for our own family.' },
  { icon: Award, title: 'Quality Checked', desc: 'Every vegetable and fruit is sorted and graded before delivery.' },
  { icon: Users, title: 'Community', desc: 'We support local farmers and vendors in our community.' },
]

const TEAM = [
  { name: 'Ramachandra Prajapati', role: 'Founder & Owner', icon: Tractor, desc: '20+ years of trust. Started with a vision to provide the freshest vegetables to local homes.' },
  { name: 'Sunil Sharma', role: 'Operations Manager', icon: Briefcase, desc: 'Manages daily sourcing from Sabji Mandi and ensures on-time morning delivery.' },
  { name: 'Priya Sharma', role: 'Quality Head', icon: FlaskConical, desc: 'Oversees daily sorting, grading, and packing of fresh produce.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">

        {/* Hero */}
        <section className="relative overflow-hidden py-20" style={{ background: 'var(--gradient-hero)' }}>
          <div className="orb orb-gold w-96 h-96 -top-20 -right-20 absolute" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-center mb-5">
                <Leaf size={64} style={{ color: 'var(--accent)' }} />
              </div>
              <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                About <span className="shimmer-text">Shree Ram</span> Veggies
              </h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Since 2000, we&apos;ve been delivering the freshest vegetables and fruits to the families of Muzaffarnagar — with love, dedication, and uncompromising quality.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Stats */}
          <section className="py-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: '20+', label: 'Years of Trust', icon: Medal },
                { value: '5000+', label: 'Happy Families', icon: Users },
                { value: '50+', label: 'Local Farmers', icon: Tractor },
                { value: '4.9★', label: 'Average Rating', icon: Star },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="glass-card p-6 text-center">
                  <div className="flex justify-center mb-3 text-3xl"><s.icon size={32} style={{ color: 'var(--accent)' }} /></div>
                  <div className="text-3xl font-bold shimmer-text mb-1">{s.value}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Our Story */}
          <section className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <p>It all began in 2000 when <strong style={{ color: 'var(--accent)' }}>Ramachandra Prajapati</strong> recognized the need for fresh, high-quality vegetables delivered directly to homes. Instead of expecting families to navigate crowded markets, he decided to bring the market to them.</p>
                  <p>We do not own agricultural land; instead, we have built strong relationships with local farmers and the main Sabji Mandi. Every morning, before the city wakes up, our team is at the market handpicking the best produce available.</p>
                  <p>This fresh produce is then carefully sorted, graded, and delivered to over 5,000 families across the city. Whether it&apos;s daily vegetables or seasonal fruits, we ensure you get the very best, straight to your kitchen.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="glass-card p-8 text-center">
                <div className="flex justify-center mb-5">
                  <Home size={80} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Our Sourcing</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Sabji Mandi & Local Farmers, Muzaffarnagar</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Daily', 'Fresh Picked'],
                    ['Handpicked', 'Selection'],
                    ['Quality', 'Sorted & Graded'],
                    ['Morning', 'Delivery'],
                  ].map(([val, label]) => (
                    <div key={label} className="glass-card p-3">
                      <div className="font-bold" style={{ color: 'var(--accent)' }}>{val}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Our Values */}
          <section className="py-12" id="values">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--gradient-accent)' }}>
                    <v.icon size={22} color="#051f20" />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Owner & Team */}
          <section className="py-12" id="owner">
            <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>Meet the Team</h2>
            <p className="text-center mb-10" style={{ color: 'var(--text-muted)' }}>The people behind your daily greens</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className={`glass-card p-7 text-center ${i === 0 ? 'animate-glow' : ''}`}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--gradient-accent)' }}>
                    <member.icon size={32} style={{ color: '#051f20' }} />
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>{member.role}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{member.desc}</p>
                  {i === 0 && (
                    <div className="mt-4 flex justify-center">
                      <span className="badge-bestseller">Founder</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="py-12" id="farm">
            <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: 'var(--text-primary)' }}>Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px" style={{ background: 'var(--glass-border)' }} />
              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-1 glass-card p-5 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <p className="font-bold" style={{ color: 'var(--accent)' }}>{item.title}</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm z-10 shrink-0"
                      style={{ background: 'var(--gradient-accent)', color: '#051f20' }}>
                      {item.year.slice(2)}
                    </div>
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section className="py-12">
            <div className="glass-card-static p-8 text-center">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Certifications & Compliance</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { icon: Award, label: 'Quality Assured', sub: 'Handpicked Daily' },
                  { icon: CheckCircle, label: 'Freshness Guaranteed', sub: 'Morning Delivery' },
                  { icon: Leaf, label: 'Local Produce', sub: 'From Local Farmers' },
                  { icon: Building, label: 'Mandi Sourced', sub: 'Best Market Rates' },
                ].map(cert => (
                  <div key={cert.label} className="glass-card p-5 text-center min-w-[140px]">
                    <div className="flex justify-center mb-3">
                      <cert.icon size={32} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{cert.label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{cert.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { User, Phone, Mail, MessageCircle, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AccountPage() {
  const { profile, user } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '')
      setPhone(profile.phone || '')
      setWhatsapp(profile.whatsapp_number || '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: name,
      phone,
      whatsapp_number: whatsapp,
    }).eq('id', user.id)
    setSaving(false)
    if (error) toast.error('Failed to save')
    else toast.success('Profile updated!')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="glass-card-static p-6 mb-5">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Profile</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your personal information</p>
      </div>

      <div className="glass-card-static p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Full Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="glass-input pl-10" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={profile?.email || ''} disabled className="glass-input pl-10 opacity-60 cursor-not-allowed" />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Phone Number
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
              className="glass-input pl-10" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            WhatsApp Number
          </label>
          <div className="relative">
            <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#25D366' }} />
            <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 XXXXX XXXXX"
              className="glass-input pl-10" />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Order updates will be sent to this number</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>
    </motion.div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { User, Phone, Mail, MessageCircle, Save, Lock, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AccountPage() {
  const { profile, user, refreshProfile } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [saving, setSaving] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPass, setChangingPass] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '')
      setPhone(profile.phone || '')
      setWhatsapp(profile.whatsapp_number || '')
    } else if (user) {
      setName(user.user_metadata?.full_name || '')
    }
  }, [profile, user])

  const handleSave = async () => {
    const targetEmail = profile?.email || user?.email
    if (!targetEmail) return

    setSaving(true)
    
    const res = await fetch('/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: profile?.id,
        email: targetEmail,
        full_name: name,
        phone,
        whatsapp_number: whatsapp
      })
    })

    if (!res.ok) {
      setSaving(false)
      toast.error(`API Error: ${res.status}. Server restart required.`)
      return
    }

    const json = await res.json()

    setSaving(false)
    if (!json.success) toast.error(json.error || 'Failed to save')
    else {
      toast.success('Profile updated!')
      if (refreshProfile) refreshProfile()
    }
  }

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setChangingPass(true)
    // Placeholder: Password reset with NextAuth requires backend API logic
    setTimeout(() => {
      toast.success('Password update requested! (Backend integration required)')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setChangingPass(false)
    }, 1000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requires admin approval. Please contact support.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass-card-static p-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Profile</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your personal information</p>
      </div>

      {/* Personal Details */}
      <div className="glass-card-static p-6">
        <h3 className="font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="glass-input !pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={profile?.email || user?.email || ''} disabled className="glass-input !pl-10 opacity-60 cursor-not-allowed" />
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
                className="glass-input !pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              WhatsApp Number
            </label>
            <div className="relative">
              <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 XXXXX XXXXX"
                className="glass-input !pl-10" />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Order updates will be sent to this number</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Security / Password Change */}
      <div className="glass-card-static p-6">
        <h3 className="font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Old Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" className="glass-input !pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              New Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="glass-input !pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Confirm Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="glass-input !pl-10" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handlePasswordChange} disabled={changingPass || !oldPassword || !newPassword || !confirmPassword} className="btn btn-secondary">
            {changingPass ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Lock size={16} />}
            Update Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card-static p-6" style={{ borderColor: 'rgba(229, 107, 107, 0.3)' }}>
        <h3 className="font-bold mb-2" style={{ color: 'var(--danger)' }}>Danger Zone</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button onClick={handleDeleteAccount} className="btn btn-danger">
          <Trash2 size={16} /> Delete Account
        </button>
      </div>
    </motion.div>
  )
}

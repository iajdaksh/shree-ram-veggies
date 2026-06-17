'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Plus, MapPin, Trash2, Star, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type Address = {
  id: string
  label: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
}

const BLANK: Omit<Address, 'id'> = {
  label: 'Home', address_line1: '', address_line2: '', city: 'Muzaffarnagar', state: 'Uttar Pradesh', pincode: '', is_default: false
}

export default function AddressesPage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...BLANK })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false })
      .then(({ data }) => setAddresses((data as Address[]) || []))
  }, [user])

  const handleSave = async () => {
    if (!form.address_line1 || !form.city || !form.pincode) { toast.error('Fill all required fields'); return }
    setSaving(true)
    try {
      if (editId) {
        await supabase.from('addresses').update({ ...form }).eq('id', editId)
        setAddresses(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a))
        toast.success('Address updated!')
      } else {
        const { data, error } = await supabase.from('addresses').insert({ ...form, user_id: user!.id }).select().single()
        if (error) throw error
        setAddresses(prev => [...prev, data as Address])
        toast.success('Address added!')
      }
      setShowForm(false)
      setEditId(null)
      setForm({ ...BLANK })
    } catch { toast.error('Failed to save address') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
    toast.success('Address removed')
  }

  const setDefault = async (id: string) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user!.id)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })))
  }

  const openEdit = (addr: Address) => {
    setForm({ label: addr.label, address_line1: addr.address_line1, address_line2: addr.address_line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, is_default: addr.is_default })
    setEditId(addr.id)
    setShowForm(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="glass-card-static p-6 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Delivery Addresses</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your saved addresses</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...BLANK }) }}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card-static p-6 mb-5 overflow-hidden">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{editId ? 'Edit Address' : 'New Address'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Label</label>
                <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="glass-input">
                  {['Home', 'Work', 'Other'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Pincode *</label>
                <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="251001" className="glass-input" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Address Line 1 *</label>
                <input value={form.address_line1} onChange={e => setForm({ ...form, address_line1: e.target.value })} placeholder="House no, Street, Area" className="glass-input" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Address Line 2</label>
                <input value={form.address_line2 || ''} onChange={e => setForm({ ...form, address_line2: e.target.value })} placeholder="Landmark (optional)" className="glass-input" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>City *</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="glass-input" />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>State</label>
                <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="glass-input" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
                Save Address
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null) }} className="btn-glass">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {addresses.length === 0 && !showForm && (
          <div className="glass-card-static p-12 text-center">
            <div className="text-5xl mb-4">📍</div>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>No addresses saved</p>
            <p className="text-sm mt-1 mb-5" style={{ color: 'var(--text-muted)' }}>Add your delivery address to speed up checkout</p>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus size={15} /> Add Address
            </button>
          </div>
        )}
        {addresses.map((addr, i) => (
          <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} className="glass-card-static p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: addr.is_default ? 'var(--gradient-accent)' : 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                  <MapPin size={15} color={addr.is_default ? '#0D0800' : 'var(--accent-gold)'} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{addr.label}</p>
                    {addr.is_default && <span className="badge-bestseller">Default</span>}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{addr.city}, {addr.state} — {addr.pincode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!addr.is_default && (
                  <button onClick={() => setDefault(addr.id)} className="qty-btn" title="Set as default">
                    <Star size={13} />
                  </button>
                )}
                <button onClick={() => openEdit(addr)} className="qty-btn"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(addr.id)} className="qty-btn" style={{ color: 'var(--danger)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

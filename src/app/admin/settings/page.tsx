'use client'
import { useState } from 'react'
import { Save, Store, Bell, Truck, MapPin, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    dairy_name: 'Shree Ram Veggies',
    phone: '+91 XXXXX XXXXX',
    whatsapp: '+91 XXXXX XXXXX',
    email: 'hello@shreeramveggies.online',
    address: 'Haripuram Kukra Locality Gandhi Nagar, Muzaffarnagar, UP — 251001',
    delivery_charge: '20',
    free_delivery_above: '200',
    min_order: '50',
    delivery_zones: 'Muzaffarnagar City, Haripuram, Kukra, Gandhi Nagar',
    pickup_hours: '5:00 AM – 9:00 PM',
    delivery_hours: '6:00 AM – 8:00 PM',
    order_cutoff: '10:00 AM',
    notify_email: true,
    notify_whatsapp: true,
    admin_email: 'admin@shreeramveggies.online',
    maintenance_mode: false,
  })

  const save = (section: string) => {
    toast.success(`${section} settings saved!`)
  }

  const Field = ({ label, field, type = 'text', full = false }: { label: string; field: keyof typeof settings; type?: string; full?: boolean }) => (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</label>
      {type === 'textarea' ? (
        <textarea value={settings[field] as string} onChange={e => setSettings({ ...settings, [field]: e.target.value })}
          rows={2} className="glass-input resize-none text-sm" />
      ) : type === 'toggle' ? (
        <label className="flex items-center gap-3 cursor-pointer mt-2">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={settings[field] as boolean}
              onChange={e => setSettings({ ...settings, [field]: e.target.checked })} />
            <div className="w-10 h-5 rounded-full transition-colors"
              style={{ background: settings[field] ? 'var(--accent)' : 'var(--bg-subtle)', border: '1px solid var(--border-medium)' }}>
              <div className="w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5"
                style={{ transform: settings[field] ? 'translateX(21px)' : 'translateX(2px)' }} />
            </div>
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{settings[field] ? 'Enabled' : 'Disabled'}</span>
        </label>
      ) : (
        <input type={type} value={settings[field] as string} onChange={e => setSettings({ ...settings, [field]: e.target.value })}
          className="glass-input text-sm" />
      )}
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Configure your store settings</p>
      </div>

      <div className="space-y-6">
        {/* Store Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
            <Store size={16} color="#051f20" />
            </div>
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Store Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name" field="dairy_name" />
            <Field label="Phone Number" field="phone" />
            <Field label="WhatsApp Number" field="whatsapp" />
            <Field label="Email" field="email" type="email" />
            <Field label="Address" field="address" full />
          </div>
          <button onClick={() => save('Store')} className="btn-primary flex items-center gap-2 text-sm mt-5">
            <Save size={15} /> Save Store Info
          </button>
        </motion.div>

        {/* Delivery Settings */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
            <Truck size={16} color="#051f20" />
            </div>
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Delivery Settings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Delivery Charge (₹)" field="delivery_charge" type="number" />
            <Field label="Free Delivery Above (₹)" field="free_delivery_above" type="number" />
            <Field label="Minimum Order (₹)" field="min_order" type="number" />
            <Field label="Order Cutoff Time" field="order_cutoff" />
            <Field label="Delivery Hours" field="delivery_hours" />
            <Field label="Pickup Hours" field="pickup_hours" />
            <Field label="Delivery Zones (comma separated)" field="delivery_zones" full />
          </div>
          <button onClick={() => save('Delivery')} className="btn-primary flex items-center gap-2 text-sm mt-5">
            <Save size={15} /> Save Delivery Settings
          </button>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
            <Bell size={16} color="#051f20" />
            </div>
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Notification Settings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Admin Notification Email" field="admin_email" type="email" />
            <div />
            <Field label="Email Notifications" field="notify_email" type="toggle" />
            <Field label="WhatsApp Notifications" field="notify_whatsapp" type="toggle" />
          </div>
          <button onClick={() => save('Notification')} className="btn-primary flex items-center gap-2 text-sm mt-5">
            <Save size={15} /> Save Notification Settings
          </button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card-static p-6" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertTriangle size={18} style={{ color: 'var(--danger)' }} /> Maintenance Mode
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>When enabled, the store will show a "temporarily unavailable" message to customers. Admin can still access the panel.</p>
          <Field label="Maintenance Mode" field="maintenance_mode" type="toggle" />
        <button onClick={() => save('Maintenance')} className="btn-primary flex items-center gap-2 text-sm mt-4">
            <Save size={15} /> Save
          </button>
        </motion.div>
      </div>
    </div>
  )
}

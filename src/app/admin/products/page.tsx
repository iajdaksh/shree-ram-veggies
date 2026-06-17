'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Star, Leaf, Sparkles, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

type Product = {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  image_url: string | null
  stock: number
  is_available: boolean
  is_featured: boolean
  badge: string | null
}

const BLANK: Omit<Product, 'id'> = {
  name: '', description: '', price: 0, unit: '1 kg', category: 'vegetables',
  image_url: null, stock: 100, is_available: true, is_featured: false, badge: null
}

const CATEGORIES = ['vegetables', 'fruits', 'seasonal']
const UNITS = ['1 kg', '500g', '250g', '100g', '1 Dozen', '1 pc', '1 Bunch']

const PRODUCT_ICONS: Record<string, any> = {
  vegetables: Leaf, fruits: Sparkles, seasonal: Star
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...BLANK })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts((data as Product[]) || []); setLoading(false) })
  }, [])

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price required'); return }
    setSaving(true)
    try {
      if (editId) {
        const { error } = await supabase.from('products').update({ ...form }).eq('id', editId)
        if (error) throw error
        setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p))
        toast.success('Product updated!')
      } else {
        const { data, error } = await supabase.from('products').insert({ ...form }).select().single()
        if (error) throw error
        setProducts(prev => [data as Product, ...prev])
        toast.success('Product added!')
      }
      setShowForm(false); setEditId(null); setForm({ ...BLANK })
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const toggleAvailable = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_available: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_available: !current } : p))
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_featured: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: !current } : p))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product deleted')
  }

  const openEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: p.price, unit: p.unit, category: p.category, image_url: p.image_url, stock: p.stock, is_available: p.is_available, is_featured: p.is_featured, badge: p.badge })
    setEditId(p.id); setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Products</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{products.length} products in catalog</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...BLANK }) }}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card-static p-6 mb-6 overflow-hidden">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{editId ? 'Edit Product' : 'New Product'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-xs">Product Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fresh Potato" className="glass-input mt-1" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-xs">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="glass-input mt-1 resize-none" />
              </div>
              <div>
                <label className="label-xs">Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="glass-input mt-1" />
              </div>
              <div>
                <label className="label-xs">Unit</label>
                <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="glass-input mt-1">
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="glass-input mt-1">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">Stock Qty</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} className="glass-input mt-1" />
              </div>
              <div>
                <label className="label-xs">Badge (optional)</label>
                <select value={form.badge || ''} onChange={e => setForm({ ...form, badge: e.target.value || null })} className="glass-input mt-1">
                  <option value="">None</option>
                  {['fresh', 'bestseller', 'popular', 'premium', 'new', 'seasonal'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">Image URL (optional)</label>
                <input value={form.image_url || ''} onChange={e => setForm({ ...form, image_url: e.target.value || null })} placeholder="https://..." className="glass-input mt-1" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} className="rounded" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
                {editId ? 'Save Changes' : 'Add Product'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null) }} className="btn-secondary">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-card-static h-16 animate-pulse" />)}</div>
      ) : (
        <div className="glass-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }} className="transition-colors hover:brightness-110">
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-tertiary)' }}>
                          {(() => { 
                            const Icon = PRODUCT_ICONS[p.category] || Package; 
                            return <Icon size={20} style={{ color: 'var(--accent)' }} /> 
                          })()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.unit}</p>
                        </div>
                        {p.is_featured && <Star size={12} fill="currentColor" style={{ color: 'var(--accent)' }} />}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="text-xs capitalize px-2 py-1 rounded-lg font-bold" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 700 }}>₹{p.price}</td>
                    <td style={{ padding: '12px 16px', color: p.stock < 10 ? 'var(--danger)' : 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.stock}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggleAvailable(p.id, p.is_available)} className="flex items-center gap-1.5 text-xs">
                        {p.is_available
                          ? <ToggleRight size={20} style={{ color: 'var(--success)' }} />
                          : <ToggleLeft size={20} style={{ color: 'var(--text-muted)' }} />}
                        <span style={{ color: p.is_available ? 'var(--success)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {p.is_available ? 'Active' : 'Hidden'}
                        </span>
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="qty-btn"><Edit2 size={13} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="qty-btn" style={{ color: 'var(--danger)' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <Package size={48} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ color: 'var(--text-muted)' }}>No products yet. Add your first product!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminPromos() {
  const [promos, setPromos] = useState<any[]>([])
  const [newPromo, setNewPromo] = useState({ code: '', discount_type: 'percent', discount_value: '', min_cart_value: '0', auto_apply: false })

  useEffect(() => {
    fetchPromos()
  }, [])

  const fetchPromos = async () => {
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false })
    if (data) setPromos(data)
  }

  const addPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('promo_codes').insert({
      code: newPromo.code.toUpperCase(),
      discount_type: newPromo.discount_type,
      discount_value: parseFloat(newPromo.discount_value),
      min_cart_value: parseFloat(newPromo.min_cart_value),
      auto_apply: newPromo.auto_apply
    })

    if (error) {
      toast.error('Failed to create promo code')
    } else {
      toast.success('Promo code created!')
      setNewPromo({ code: '', discount_type: 'percent', discount_value: '', min_cart_value: '0', auto_apply: false })
      fetchPromos()
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from('promo_codes').update({ is_active: !currentStatus }).eq('id', id)
    fetchPromos()
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Manage Promo Codes</h1>
      
      <form onSubmit={addPromo} className="glass-card-static p-4 mb-8 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div>
          <label className="text-xs mb-1 block">Code</label>
          <input required type="text" className="input input-sm w-full" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value})} placeholder="e.g. SUMMER10" />
        </div>
        <div>
          <label className="text-xs mb-1 block">Type</label>
          <select className="input input-sm w-full" value={newPromo.discount_type} onChange={e => setNewPromo({...newPromo, discount_type: e.target.value})}>
            <option value="percent">% Discount</option>
            <option value="fixed">Flat ₹ Discount</option>
          </select>
        </div>
        <div>
          <label className="text-xs mb-1 block">Value</label>
          <input required type="number" className="input input-sm w-full" value={newPromo.discount_value} onChange={e => setNewPromo({...newPromo, discount_value: e.target.value})} placeholder="10" />
        </div>
        <div>
          <label className="text-xs mb-1 block">Min Order (₹)</label>
          <input required type="number" className="input input-sm w-full" value={newPromo.min_cart_value} onChange={e => setNewPromo({...newPromo, min_cart_value: e.target.value})} />
        </div>
        <div>
          <label className="text-xs flex items-center gap-2 mb-2"><input type="checkbox" checked={newPromo.auto_apply} onChange={e => setNewPromo({...newPromo, auto_apply: e.target.checked})} /> Auto Apply</label>
          <button type="submit" className="btn btn-primary btn-sm w-full">Create</button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left">
          <thead style={{ background: 'var(--bg-tertiary)' }}>
            <tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Auto</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {promos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td className="p-2 font-bold">{p.code}</td>
                <td className="p-2">{p.discount_type}</td>
                <td className="p-2">{p.discount_type === 'percent' ? `${p.discount_value}%` : `₹${p.discount_value}`}</td>
                <td className="p-2">₹{p.min_cart_value}</td>
                <td className="p-2">{p.auto_apply ? 'Yes' : 'No'}</td>
                <td className="p-2 text-xs">
                  {p.is_active ? (
                    <span className="flex items-center gap-1.5"><CheckCircle size={14} style={{ color: 'var(--success)' }} /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><XCircle size={14} style={{ color: 'var(--danger)' }} /> Inactive</span>
                  )}
                </td>
                <td className="p-2"><button type="button" onClick={() => toggleActive(p.id, p.is_active)} className="btn btn-secondary btn-sm">{p.is_active ? 'Disable' : 'Enable'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
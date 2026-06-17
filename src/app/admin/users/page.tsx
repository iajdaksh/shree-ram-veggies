'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers((data as UserProfile[]) || []); setLoading(false) })
  }, [])

  const toggleRole = async (id: string, current: string) => {
    const newRole = current === 'admin' ? 'user' : 'admin'
    if (!confirm(`Make this user ${newRole}?`)) return
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole as any } : u))
    toast.success(`Role updated to ${newRole}`)
  }

  const filtered = users.filter(u =>
    (u.full_name?.toLowerCase().includes(search.toLowerCase()) || '') ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Users</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{users.length} registered users</p>
      </div>

      <div className="glass-card-static p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="glass-input pl-9 text-sm" />
        </div>
      </div>

      <div className="glass-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['User', 'Email', 'Phone', 'Joined', 'Role', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'var(--gradient-accent)', color: '#0D0800' }}>
                        {u.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{u.full_name || 'No name'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={u.role === 'admin' ? 'badge-bestseller' : 'status-pending'}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => toggleRole(u.id, u.role)}
                      className="flex items-center gap-1.5 text-xs btn-glass px-3 py-1.5">
                      {u.role === 'admin' ? <User size={12} /> : <Shield size={12} />}
                      {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div>}
          {!loading && filtered.length === 0 && <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>No users found</div>}
        </div>
      </div>
    </div>
  )
}

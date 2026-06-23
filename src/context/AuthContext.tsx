'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  whatsapp_number: string | null
}

type AuthContextType = {
  user:           any | null
  profile:        Profile | null
  loading:        boolean
  isAdmin:        boolean
  signInGoogle:   () => Promise<void>
  signInEmail:    (email: string, password: string) => Promise<{ error?: string, data?: any }>
  signUpEmail:    (email: string, password: string, name: string) => Promise<{ error?: string, data?: any }>
  logout:         () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.email!, session.user.user_metadata?.full_name);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (email: string, userName?: string | null) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Supabase DB Error:', error)
      }

      if (data) {
        setProfile(data as Profile)
      } else {
        // Profile doesn't exist yet, create it automatically!
        const res = await fetch('/api/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, full_name: userName || email.split('@')[0] })
        })
        
        if (res.ok) {
          const json = await res.json()
          if (json.success) setProfile(json.data as Profile)
        } else {
          console.error('API Route /api/update-profile not found. Please restart the dev server.')
        }
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const signInEmail = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { data }
  }

  const signUpEmail = async (email: string, password: string, name: string) => {
    const { error, data } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    if (error) return { error: error.message }
    return { data }
  }

  const logout = async () => {
    setProfile(null)
    setUser(null)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const refreshProfile = async () => {
    if (user?.email) await fetchProfile(user.email, user?.user_metadata?.full_name)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      signInGoogle,
      signInEmail,
      signUpEmail,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
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
  signInEmail:    (email: string, password: string) => Promise<{ error?: string }>
  signUpEmail:    (email: string, password: string, name: string) => Promise<{ error?: string }>
  logout:         () => Promise<void>
  signOut:        () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const loading = status === 'loading'

  useEffect(() => {
    if (session?.user?.email) fetchProfile(session.user.email)
    else setProfile(null)
  }, [session])

  const fetchProfile = async (email: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('email', email).single()
    if (data) setProfile(data as Profile)
  }

  const signInGoogle = async () => {
    await signIn('google', { callbackUrl: '/' })
  }

  const signInEmail = async (email: string, password: string) => {
    const res = await signIn('credentials', {
      email, password, action: 'signin', redirect: false,
    })
    if (res?.error) return { error: res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error }
    return {}
  }

  const signUpEmail = async (email: string, password: string, name: string) => {
    const res = await signIn('credentials', {
      email, password, name, action: 'signup', redirect: false,
    })
    if (res?.error) return { error: res.error }
    return {}
  }

  const logout = async () => {
    setProfile(null)
    await signOut({ callbackUrl: '/' })
  }

  const refreshProfile = async () => {
    if (session?.user?.email) await fetchProfile(session.user.email)
  }

  return (
    <AuthContext.Provider value={{
      user: session?.user || null,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      signInGoogle,
      signInEmail,
      signUpEmail,
      logout,
      signOut: logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

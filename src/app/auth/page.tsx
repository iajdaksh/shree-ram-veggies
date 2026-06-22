'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AuthPage() {
  const [mode, setMode]               = useState<'signin'|'signup'>('signin')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [name, setName]               = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [loading, setLoading]         = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signInGoogle, signInEmail, signUpEmail } = useAuth()
  const router = useRouter()

  // Strong password validation
  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const isStrong = hasLength && hasUpper && hasNumber && hasSpecial

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !password) { toast.error('Please fill all fields'); return }
    if (mode === 'signup' && !name) { toast.error('Please enter your name'); return }
    
    if (mode === 'signup' && !isStrong) {
      toast.error('Please use a stronger password')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const res = await signInEmail(email, password)
        if (res.error) { toast.error(res.error); return }
        toast.success('Welcome back!')
        router.push('/')
      } else {
        const res = await signUpEmail(email, password, name)
        if (res.error) { toast.error(res.error); return }
        if (res.data?.session) {
          toast.success('Account created! Welcome aboard 🎉')
          router.push('/')
        } else {
          toast.success('Account created! Please check your email to verify.')
          setMode('signin')
        }
      }
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signInGoogle()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-16 flex items-center justify-center relative">
        <div className="w-full max-w-md mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {mode === 'signin' ? 'Welcome back' : 'Create Account'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {mode === 'signin' ? 'Sign in to manage your daily veggie orders.' : 'Join us to get fresh produce delivered.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input required type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma" className="glass-input !pl-10" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" className="glass-input !pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input required type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className="glass-input !pl-10 !pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {/* Real-time Password Strength Indicator for Signup */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className={`h-full transition-all duration-300 ${hasLength ? 'w-1/4' : 'w-0'}`} style={{ background: 'var(--success)' }} />
                      <div className={`h-full transition-all duration-300 ${hasUpper ? 'w-1/4' : 'w-0'}`} style={{ background: 'var(--success)' }} />
                      <div className={`h-full transition-all duration-300 ${hasNumber ? 'w-1/4' : 'w-0'}`} style={{ background: 'var(--success)' }} />
                      <div className={`h-full transition-all duration-300 ${hasSpecial ? 'w-1/4' : 'w-0'}`} style={{ background: 'var(--success)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle size={12} color={hasLength ? 'var(--success)' : 'currentColor'} /> 8+ Characters
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle size={12} color={hasUpper ? 'var(--success)' : 'currentColor'} /> 1 Uppercase Letter
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle size={12} color={hasNumber ? 'var(--success)' : 'currentColor'} /> 1 Number
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle size={12} color={hasSpecial ? 'var(--success)' : 'currentColor'} /> 1 Special Symbol
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading || (mode === 'signup' && !isStrong)}
                className="glass-card w-full flex items-center justify-center gap-3 py-4 mt-2 text-base font-bold transition-all hover:brightness-110 disabled:opacity-50"
                style={{ background: 'rgba(142, 182, 155, 0.4)', color: 'var(--text-primary)' }}>
                {loading ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={20} />}
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
              <span className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>Or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
            </div>

            <button onClick={handleGoogle} type="button" disabled={googleLoading}
              className="glass-card w-full flex items-center justify-center gap-3 py-4 text-base font-bold transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: 'rgba(218, 241, 222, 0.6)', color: 'var(--text-primary)' }}>
              {googleLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="font-bold underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            
            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-faint)' }}>
              By continuing, you agree to our{' '}
              <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link> &{' '}
              <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

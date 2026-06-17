import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
        name:     { label: 'Name',     type: 'text' },
        action:   { label: 'Action',   type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { email, password, name, action } = credentials

        // Bypass: Local Env Admin Login
        if (
          email === process.env.ADMIN_LOGIN_EMAIL &&
          password === process.env.ADMIN_LOGIN_PASSWORD
        ) {
          return {
            id: '00000000-0000-0000-0000-000000000000', // Dummy UUID for session
            email,
            name: 'System Admin',
            image: null,
            role: 'admin',
          }
        }

        if (action === 'signup') {
          // Check if already exists
          const { data: existing } = await supabaseAdmin
            .from('profiles').select('id').eq('email', email).single()
          if (existing) throw new Error('Email already registered')

          // Use Supabase Auth to create user (handles password hashing)
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email, password, email_confirm: true,
            user_metadata: { full_name: name || '' }
          })
          if (error || !data.user) throw new Error(error?.message || 'Signup failed')

          await supabaseAdmin.from('profiles').insert({
            id: data.user.id, email, full_name: name || '', role: 'user'
          })
          return { id: data.user.id, email, name: name || '', image: null }
        }

        // Sign in — verify via Supabase Auth
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
        if (error || !data.user) throw new Error('Invalid email or password')

        const { data: profile } = await supabaseAdmin
          .from('profiles').select('*').eq('id', data.user.id).single()

        return {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.full_name || '',
          image: profile?.avatar_url || null,
          role: profile?.role || 'user',
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { data: existing } = await supabaseAdmin
          .from('profiles').select('id').eq('email', user.email!).single()
        if (!existing) {
          // Create Supabase auth user for Google users
          const { data } = await supabaseAdmin.auth.admin.createUser({
            email: user.email!, email_confirm: true,
            user_metadata: { full_name: user.name, avatar_url: user.image }
          })
          if (data.user) {
            await supabaseAdmin.from('profiles').insert({
              id: data.user.id,
              email: user.email!,
              full_name: user.name || '',
              avatar_url: user.image || null,
              role: 'user',
            })
            user.id = data.user.id
          }
        } else {
          user.id = existing.id
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id

        // Assign admin role if env admin email
        if (token.email === process.env.ADMIN_LOGIN_EMAIL) {
          token.role = 'admin'
        } else {
          // Fetch role from DB
          const { data: profile } = await supabaseAdmin
            .from('profiles').select('role').eq('email', token.email!).single()
          token.role = profile?.role || 'user'
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth',
    error:  '/auth',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

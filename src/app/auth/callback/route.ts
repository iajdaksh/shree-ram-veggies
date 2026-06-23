import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const cookieStore = cookies()

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value, set: (name: string, value: string, options: CookieOptions) => cookieStore.set({ name, value, ...options }), remove: (name: string, options: CookieOptions) => cookieStore.set({ name, value: '', ...options }), } }
    )
    
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    // Create profile if doesn't exist
    if (session?.user) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('id', session.user.id).single()
      if (!existing) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || null,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          role: 'user',
          phone: null,
          whatsapp_number: null,
        })
      }
    }
  }

  return NextResponse.redirect(new URL('/', request.url))
}

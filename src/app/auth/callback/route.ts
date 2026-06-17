import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

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

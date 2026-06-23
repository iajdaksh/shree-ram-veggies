import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with the service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, full_name } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // This API route is called when a user's profile doesn't exist yet.
    // We create it here using the admin client.
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({ email, full_name: full_name || email.split('@')[0], role: 'user' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in /api/update-profile:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
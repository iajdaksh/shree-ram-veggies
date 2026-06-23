import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with the service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { id, email, full_name, phone, whatsapp_number } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // Use upsert to either create a new profile or update an existing one.
    // We match on the user's ID if it exists, otherwise on their email.
    const { data, error } = await supabaseAdmin.from('profiles').upsert(
      {
        id, // This will be null for new users, which is fine for upsert
        email,
        full_name: full_name || email.split('@')[0],
        phone,
        whatsapp_number,
        role: 'user', // Ensure new profiles get the 'user' role
      },
      { onConflict: 'email', ignoreDuplicates: false } // Update if email matches
    ).select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in /api/update-profile:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
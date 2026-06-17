import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          whatsapp_number: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          unit: string
          category: string
          image_url: string | null
          stock: number
          is_available: boolean
          is_featured: boolean
          badge: string | null
          created_at: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          pincode: string
          is_default: boolean
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          items: OrderItem[]
          subtotal: number
          delivery_fee: number
          total: number
          status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled'
          delivery_type: 'home_delivery' | 'pickup'
          address_id: string | null
          payment_method: string
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

export type OrderItem = {
  product_id: string
  product_name: string
  quantity: number
  price: number
  unit: string
}

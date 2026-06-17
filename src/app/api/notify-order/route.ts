import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderNumber, userEmail, total, deliveryType, discountAmount, promoCode } = await request.json()

    // Get user profile for WhatsApp number
    const { data: order } = await supabase.from('orders').select('*, profiles(full_name, phone, whatsapp_number)').eq('id', orderId).single()

    const userName = (order as any)?.profiles?.full_name || 'Customer'
    const whatsappNumber = (order as any)?.profiles?.whatsapp_number

    // --- Send Email via Supabase (or use Resend/Nodemailer) ---
    // Using Supabase Edge Function or you can swap this for Resend API
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family:sans-serif;background:#daf1de;margin:0;padding:20px;">
        <div style="max-width:480px;margin:0 auto;background:rgba(142,182,155,0.2);border-radius:20px;padding:32px;border:1px solid rgba(35,83,71,0.2);">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:flex;justify-content:center;margin-bottom:16px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#daf1de" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15.3 15.3c-.4.4-.9.6-1.4.7-.5.1-1 .2-1.5.2s-1-.1-1.5-.2c-.5-.1-1-.3-1.4-.7"/>
                <path d="M7 6h10l-1.5 13.5a2 2 0 0 1-2 1.5H10.5a2 2 0 0 1-2-1.5L7 6Z"/>
                <path d="M7 6c0-1.7 2.2-3 5-3s5 1.3 5 3"/>
              </svg>
            </div>
            <h2 style="color:#051f20;margin:8px 0 4px;">Order Confirmed!</h2>
            <p style="color:#163832;font-size:14px;">Shree Ram Veggies</p>
          </div>
          <p style="color:#0b2b26;">Hi <strong style="color:#051f20;">${userName}</strong>,</p>
          <p style="color:#163832;">Your order has been placed successfully! 🎉</p>
          <div style="background:rgba(218,241,222,0.5);border-radius:12px;padding:16px;margin:20px 0;border:1px solid rgba(142,182,155,0.5);">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#163832;font-size:14px;">Order Number</span>
              <strong style="color:#051f20;">#${orderNumber}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#163832;font-size:14px;">Total Amount</span>
              <strong style="color:#051f20;">₹${total}</strong>
            </div>
            ${discountAmount ? `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#163832;font-size:14px;">Discount applied (${promoCode})</span>
              <strong style="color:#051f20;">-₹${discountAmount}</strong>
            </div>` : ''}
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#163832;font-size:14px;">Delivery Type</span>
              <strong style="color:#051f20;">${deliveryType === 'pickup' ? '🏪 Store Pickup' : '🚚 Home Delivery'}</strong>
            </div>
          </div>
          <p style="color:#163832;font-size:14px;">We will prepare your order fresh and ${deliveryType === 'pickup' ? 'have it ready for pickup at our store.' : 'deliver it to your doorstep.'}</p>
          <p style="color:#163832;font-size:14px;">Track your order in your <a href="https://shreeramveggies.online/account/orders" style="color:#051f20;">account dashboard</a>.</p>
          <hr style="border:none;border-top:1px solid rgba(35,83,71,0.2);margin:20px 0;" />
          <p style="color:#235347;font-size:12px;text-align:center;">Questions? WhatsApp us or call +91 XXXXX XXXXX</p>
          <p style="color:#235347;font-size:12px;text-align:center;">Shree Ram Veggies · Haripuram Kukra Locality Gandhi Nagar, Muzaffarnagar</p>
        </div>
      </body>
      </html>
    `

    // Store notification in DB for admin panel
    await supabase.from('notifications').insert({
      type: 'new_order',
      title: `New Order #${orderNumber}`,
      message: `${userName} placed an order of ₹${total} (${deliveryType === 'pickup' ? 'Pickup' : 'Delivery'})`,
      order_id: orderId,
      is_read: false,
    }).catch(() => {}) // non-blocking, table may not exist yet

    // --- WhatsApp via Twilio / Meta API (configure WHATSAPP_API_KEY in env) ---
    if (whatsappNumber && process.env.WHATSAPP_ACCESS_TOKEN) {
      const waNumber = whatsappNumber.replace(/\D/g, '')
      await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: waNumber,
          type: 'text',
          text: {
            body: `*Shree Ram Veggies*\n\nHi ${userName}! Your order *#${orderNumber}* has been placed successfully.\n\nTotal: ₹${total}${discountAmount ? `\nDiscount: -₹${discountAmount} (${promoCode})` : ''}\nType: ${deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}\n\nWe'll notify you when it's on the way!\n\nTrack: https://shreeramveggies.online/account/orders`
          }
        })
      }).catch(() => {})
    }

    // --- Email via Resend (configure RESEND_API_KEY in env) ---
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Shree Ram Veggies <orders@shreeramveggies.online>',
          to: [userEmail],
          subject: `Order Confirmed #${orderNumber} — Shree Ram Veggies`,
          html: emailHtml,
        })
      }).catch(() => {})

      // Also notify admin
      if (process.env.ADMIN_EMAIL) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Shree Ram Veggies <orders@shreeramveggies.online>',
            to: [process.env.ADMIN_EMAIL],
            subject: `🛒 New Order #${orderNumber} — ₹${total}`,
            html: `<p>New order received from ${userName} (${userEmail})</p><p>Order: #${orderNumber} | Amount: ₹${total} ${discountAmount ? `(Discount: ₹${discountAmount})` : ''} | Type: ${deliveryType}</p><p><a href="https://shreeramveggies.online/admin/orders">View in Admin Panel</a></p>`,
          })
        }).catch(() => {})
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

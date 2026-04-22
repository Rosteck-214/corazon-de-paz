import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })

  let event: { type: string; data: { object: { metadata?: Record<string, string>; id?: string; status?: string } } }

  try {
    // Dynamically import stripe only when webhook is called
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret) as typeof event
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.order_id

    if (orderId) {
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId)

      await supabase
        .from('payments')
        .update({
          status: 'paid',
          provider_payment_id: session.id,
          provider_response: session as Record<string, unknown>,
        })
        .eq('order_id', orderId)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object
    const orderId = intent.metadata?.order_id

    if (orderId) {
      await supabase
        .from('payments')
        .update({ status: 'failed', provider_response: intent as Record<string, unknown> })
        .eq('order_id', orderId)
    }
  }

  return NextResponse.json({ received: true })
}

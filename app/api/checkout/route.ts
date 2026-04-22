import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CartItem, ShippingAddress } from '@/lib/types'

interface CheckoutBody {
  form: {
    full_name: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zip_code: string
    notes: string
  }
  items: CartItem[]
  subtotal: number
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { form, items, subtotal } = body

    if (!form.full_name || !form.email || !form.phone || !form.street || !form.city || !form.state || !form.zip_code) {
      return NextResponse.json({ error: 'Completa todos los campos requeridos' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert customer
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .upsert({ email: form.email, full_name: form.full_name, phone: form.phone }, { onConflict: 'email' })
      .select('id')
      .single()

    if (custErr) throw new Error('Error al registrar cliente')

    const shippingAddress: ShippingAddress = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      street: form.street,
      city: form.city,
      state: form.state,
      zip_code: form.zip_code,
      country: 'MX',
    }

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        status: 'awaiting_payment',
        subtotal,
        shipping_cost: 0,
        total: subtotal,
        shipping_address: shippingAddress,
        notes: form.notes || null,
        order_number: 'TEMP', // overwritten by trigger
      })
      .select('id, order_number')
      .single()

    if (orderErr) throw new Error('Error al crear pedido')

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_snapshot: {
        name: item.name,
        sku: item.sku,
        price: item.price,
        options: item.options,
      },
      quantity: item.quantity,
      unit_price: item.price,
      personalization: item.personalization,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
    if (itemsErr) throw new Error('Error al guardar items del pedido')

    // Decrease stock for each variant
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        p_variant_id: item.variantId,
        p_quantity: item.quantity,
      }).catch(() => null) // non-blocking, handle gracefully
    }

    // Create payment record
    await supabase.from('payments').insert({
      order_id: order.id,
      provider: 'pending',
      amount: subtotal,
      currency: 'MXN',
      status: 'pending',
    })

    return NextResponse.json({ order_number: order.order_number, order_id: order.id })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface FormData {
  full_name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip_code: string
  notes: string
}

const ESTADOS_MX = [
  'Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua',
  'Ciudad de México','Coahuila','Colima','Durango','Estado de México','Guanajuato','Guerrero',
  'Hidalgo','Jalisco','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla',
  'Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas',
  'Tlaxcala','Veracruz','Yucatán','Zacatecas'
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const subtotal = total()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', phone: '', street: '', city: '', state: '', zip_code: '', notes: '',
  })

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) { toast.error('Tu carrito está vacío'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items, subtotal }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Error al procesar pedido')

      clearCart()
      router.push(`/gracias?order=${data.order_number}`)
    } catch (err) {
      toast.error((err as Error).message)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <span className="text-5xl text-gold-light block mb-4">✝</span>
          <p className="font-serif text-2xl text-burgundy mb-4">Tu carrito está vacío</p>
          <Link href="/productos" className="btn-primary">Ver Catálogo</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-warm-white">
      <section className="py-12 bg-sacred border-b border-gold-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="section-subtitle mb-3">Último paso</p>
          <h1 className="section-title">Checkout</h1>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact */}
            <div>
              <h2 className="font-serif text-2xl text-burgundy mb-5 flex items-center gap-2">
                <span className="text-gold text-lg">1.</span> Datos de contacto
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">
                    Nombre completo *
                  </label>
                  <input required className="input-field" type="text" value={form.full_name} onChange={set('full_name')} placeholder="Tu nombre completo" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Email *</label>
                  <input required className="input-field" type="email" value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Teléfono *</label>
                  <input required className="input-field" type="tel" value={form.phone} onChange={set('phone')} placeholder="+52 55 1234 5678" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 className="font-serif text-2xl text-burgundy mb-5 flex items-center gap-2">
                <span className="text-gold text-lg">2.</span> Dirección de envío
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Calle y número *</label>
                  <input required className="input-field" type="text" value={form.street} onChange={set('street')} placeholder="Calle, número exterior e interior, colonia" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Ciudad *</label>
                  <input required className="input-field" type="text" value={form.city} onChange={set('city')} placeholder="Ciudad" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Estado *</label>
                  <select required className="input-field" value={form.state} onChange={set('state')}>
                    <option value="">Selecciona tu estado</option>
                    {ESTADOS_MX.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Código Postal *</label>
                  <input required className="input-field" type="text" value={form.zip_code} onChange={set('zip_code')} placeholder="12345" maxLength={5} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="font-serif text-2xl text-burgundy mb-5 flex items-center gap-2">
                <span className="text-gold text-lg">3.</span> Notas adicionales
              </h2>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={form.notes}
                onChange={set('notes')}
                placeholder="Instrucciones de entrega, indicaciones especiales..."
              />
            </div>

            {/* Payment note */}
            <div className="p-5 bg-gold-light/20 border border-gold/30">
              <div className="flex items-start gap-3">
                <span className="text-gold text-xl mt-0.5">✝</span>
                <div>
                  <p className="font-serif text-base text-burgundy mb-1">Pago seguro</p>
                  <p className="font-sans text-xs text-text-muted leading-relaxed">
                    Al confirmar tu pedido, te contactaremos vía email con las instrucciones de pago.
                    Aceptamos transferencia bancaria, OXXO y tarjeta de crédito/débito.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-cream border border-gold-light/30 p-6 sticky top-24">
              <h2 className="font-serif text-2xl text-burgundy mb-5">Tu pedido</h2>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-burgundy leading-tight line-clamp-2">{item.name}</p>
                      {Object.keys(item.options).length > 0 && (
                        <p className="font-sans text-[10px] text-text-muted">
                          {Object.entries(item.options).map(([, v]) => v).join(' · ')}
                        </p>
                      )}
                      <p className="font-sans text-[10px] text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-sans text-xs text-terracotta flex-shrink-0">
                      ${(item.price * item.quantity).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold-light/40 pt-4 mb-6 space-y-2">
                <div className="flex justify-between font-sans text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-text-muted">
                  <span>Envío</span>
                  <span className="text-sage">Por cotizar</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="font-sans text-sm text-text-muted">Total estimado</span>
                <span className="font-serif text-2xl text-burgundy">${subtotal.toLocaleString('es-MX')} MXN</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>

              <p className="font-sans text-[10px] text-text-muted text-center mt-3 leading-relaxed">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

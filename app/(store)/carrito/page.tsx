'use client'

import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const subtotal = total()

  return (
    <div className="min-h-screen pt-20 bg-warm-white">
      {/* Header */}
      <section className="py-12 bg-sacred border-b border-gold-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="section-subtitle mb-3">Tu selección</p>
          <h1 className="section-title">Carrito de Compras</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-7xl text-gold-light block mb-6">✝</span>
            <p className="font-serif text-3xl text-burgundy mb-3">Tu carrito está vacío</p>
            <p className="font-sans text-sm text-text-muted mb-8">
              Explora nuestra colección y encuentra tu pieza devocional perfecta
            </p>
            <Link href="/productos" className="btn-primary">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 p-5 bg-warm-white border border-gold-light/30 hover:border-gold/40 transition-colors">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-cream overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full img-placeholder flex items-center justify-center">
                        <span className="text-gold text-3xl">✝</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/productos/${item.slug}`} className="font-serif text-xl text-burgundy hover:text-terracotta transition-colors">
                          {item.name}
                        </Link>
                        {Object.keys(item.options).length > 0 && (
                          <p className="font-sans text-xs text-text-muted mt-1">
                            {Object.entries(item.options).map(([, v]) => v).join(' · ')}
                          </p>
                        )}
                        {item.personalization.dedicatoria && (
                          <p className="font-sans text-xs text-gold-dark mt-1 italic">
                            "{item.personalization.dedicatoria}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted hover:text-terracotta transition-colors ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gold-light/50">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-clay hover:text-terracotta text-sm">−</button>
                        <span className="w-8 h-8 flex items-center justify-center font-sans text-sm text-burgundy">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-clay hover:text-terracotta text-sm">+</button>
                      </div>
                      <span className="font-serif text-lg text-terracotta">
                        ${(item.price * item.quantity).toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="btn-ghost text-sm text-text-muted hover:text-terracotta mt-2">
                Vaciar carrito
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cream border border-gold-light/30 p-6 sticky top-24">
                <h2 className="font-serif text-2xl text-burgundy mb-5">Resumen</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between font-sans text-sm text-text-muted">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} piezas)</span>
                    <span>${subtotal.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-text-muted">
                    <span>Envío</span>
                    <span className="text-sage">Se calcula al checkout</span>
                  </div>
                </div>

                <div className="border-t border-gold-light/40 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-sm text-text-muted uppercase tracking-wider">Total</span>
                    <span className="font-serif text-3xl text-burgundy">${subtotal.toLocaleString('es-MX')}</span>
                  </div>
                  <p className="font-sans text-[10px] text-text-muted mt-1">MXN · Impuestos incluidos</p>
                </div>

                <Link href="/checkout" className="btn-primary w-full text-center block mb-3">
                  Proceder al Checkout
                </Link>
                <Link href="/productos" className="btn-ghost w-full text-center block text-sm">
                  Seguir comprando
                </Link>

                <div className="mt-6 pt-4 border-t border-gold-light/30 space-y-2">
                  {['Pago 100% seguro', 'Elaboración artesanal', 'Empaque de regalo'].map((t) => (
                    <div key={t} className="flex items-center gap-2 font-sans text-xs text-text-muted">
                      <span className="text-gold text-[10px]">✦</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

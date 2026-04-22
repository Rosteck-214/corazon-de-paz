'use client'

import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total } = useCartStore()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const subtotal = total()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-burgundy/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-warm-white z-50 flex flex-col shadow-2xl transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold-light/40">
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Tu selección</p>
            <h2 className="font-serif text-2xl text-burgundy">Carrito</h2>
          </div>
          <button onClick={closeCart} className="text-clay hover:text-terracotta transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <span className="text-5xl text-gold-light">✝</span>
              <p className="font-serif text-xl text-burgundy">Tu carrito está vacío</p>
              <p className="font-sans text-sm text-text-muted">Explora nuestras piezas artesanales</p>
              <button onClick={closeCart} className="btn-outline mt-2">
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-gold-light/30">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-cream overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full img-placeholder flex items-center justify-center">
                        <span className="text-gold text-2xl">✝</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base text-burgundy leading-tight line-clamp-2">{item.name}</p>
                    {Object.keys(item.options).length > 0 && (
                      <p className="font-sans text-xs text-text-muted mt-1">
                        {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                    <p className="font-sans text-sm text-terracotta font-medium mt-1">
                      ${(item.price * item.quantity).toLocaleString('es-MX')} MXN
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border border-gold-light text-clay hover:border-terracotta hover:text-terracotta transition-colors flex items-center justify-center text-sm"
                      >
                        −
                      </button>
                      <span className="font-sans text-sm text-burgundy w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-gold-light text-clay hover:border-terracotta hover:text-terracotta transition-colors flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-text-muted hover:text-terracotta transition-colors"
                        aria-label="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gold-light/40 bg-cream/50">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-sm text-text-muted">Subtotal</span>
              <span className="font-serif text-xl text-burgundy">${subtotal.toLocaleString('es-MX')} MXN</span>
            </div>
            <p className="font-sans text-xs text-text-muted mb-4 text-center">
              Envío y personalización se calculan en el checkout
            </p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center">
              Proceder al Checkout
            </Link>
            <button onClick={closeCart} className="btn-ghost w-full mt-2 text-center">
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}

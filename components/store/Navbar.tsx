'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import CartDrawer from './CartDrawer'

const NAV_LINKS = [
  { href: '/productos', label: 'Catálogo' },
  { href: '/productos?categoria=rosarios', label: 'Rosarios' },
  { href: '/productos?categoria=escapularios', label: 'Escapularios' },
  { href: '/productos?categoria=devocionales', label: 'Devocionales' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, itemCount } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-warm-white/95 backdrop-blur-sm shadow-sm border-b border-gold-light/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-xl text-burgundy tracking-wide leading-none group-hover:text-terracotta transition-colors">
                Corazón de Paz
              </span>
              <span className="font-sans text-[9px] tracking-widest uppercase text-gold-dark mt-0.5">
                Artesanal · Devocional
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-xs tracking-widest uppercase text-clay hover:text-terracotta transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 text-clay hover:text-terracotta transition-colors"
                aria-label="Abrir carrito"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="hidden sm:block font-sans text-xs tracking-widest uppercase">Carrito</span>
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-terracotta text-white text-[9px] rounded-full flex items-center justify-center font-sans font-semibold">
                    {count}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                href="/cuenta"
                className="hidden sm:flex items-center gap-1.5 text-clay hover:text-terracotta transition-colors"
                aria-label="Mi cuenta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>

              {/* Mobile menu */}
              <button
                className="lg:hidden text-clay hover:text-terracotta transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-warm-white/98 backdrop-blur-sm border-t border-gold-light/30 px-6 py-6">
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm tracking-widest uppercase text-clay hover:text-terracotta transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cuenta"
                className="font-sans text-sm tracking-widest uppercase text-clay hover:text-terracotta transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Mi Cuenta
              </Link>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  )
}

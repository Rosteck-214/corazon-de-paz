'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◻' },
  { href: '/admin/productos', label: 'Productos', icon: '📿' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
  { href: '/admin/clientes', label: 'Clientes', icon: '👤' },
  { href: '/admin/inventario', label: 'Inventario', icon: '📊' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-burgundy min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-cream/10">
        <Link href="/" className="block">
          <span className="font-serif text-lg text-cream leading-none">Corazón de Paz</span>
          <span className="block font-sans text-[9px] tracking-widest uppercase text-gold mt-1">Panel Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="font-sans text-[9px] tracking-widest uppercase text-cream/30 px-2 mb-3">Gestión</p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-all duration-200 rounded-sm ${
                    active
                      ? 'bg-terracotta text-white'
                      : 'text-cream/60 hover:text-cream hover:bg-cream/5'
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-cream/10">
        <Link
          href="/"
          className="flex items-center gap-2 font-sans text-xs text-cream/40 hover:text-cream/70 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Ver tienda
        </Link>
      </div>
    </aside>
  )
}

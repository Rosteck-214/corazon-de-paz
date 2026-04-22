import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-burgundy text-cream/80">
      {/* Top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-gold text-3xl font-serif leading-none mt-1">✝</span>
              <div>
                <h3 className="font-serif text-2xl text-cream leading-none">Corazón de Paz</h3>
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold mt-1">
                  Artesanal · Devocional · Premium
                </p>
              </div>
            </div>
            <p className="font-sans text-sm text-cream/60 leading-relaxed max-w-xs">
              Artículos religiosos artesanales elaborados con amor, fe y los mejores materiales.
              Cada pieza es única, como tu devoción.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/corazondepaz_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/50 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Colecciones */}
          <div>
            <h4 className="font-sans text-[10px] tracking-widest uppercase text-gold mb-5">Colecciones</h4>
            <ul className="space-y-3">
              {[
                { href: '/productos?categoria=rosarios', label: 'Rosarios' },
                { href: '/productos?categoria=escapularios', label: 'Escapularios' },
                { href: '/productos?categoria=san-benitos', label: 'San Benitos' },
                { href: '/productos?categoria=devocionales', label: 'Devocionales' },
                { href: '/productos?categoria=edicion-especial', label: 'Edición Especial' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-sans text-[10px] tracking-widest uppercase text-gold mb-5">Ayuda</h4>
            <ul className="space-y-3">
              {[
                { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
                { href: '/politicas-envio', label: 'Envíos' },
                { href: '/devoluciones', label: 'Devoluciones' },
                { href: '/personalizacion', label: 'Personalización' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream/30">
            © {new Date().getFullYear()} Corazón de Paz. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-cream/20">
            <span className="font-serif text-sm text-gold/50">✦</span>
            <p className="font-sans text-xs text-cream/30 italic">
              "Pedid y se os dará, buscad y hallaréis" — Mt 7:7
            </p>
            <span className="font-serif text-sm text-gold/50">✦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

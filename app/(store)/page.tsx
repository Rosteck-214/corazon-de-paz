import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { Product, Category } from '@/lib/types'

export const revalidate = 3600

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

async function getData() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(*), product_images(*), product_variants(id, stock)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(6),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return { products: products ?? [], categories: categories ?? [] }
}

const CATEGORY_ICONS: Record<string, string> = {
  rosarios: '📿',
  escapularios: '✝',
  'san-benitos': '🛡',
  devocionales: '🕯',
  'edicion-especial': '✨',
}

export default async function HomePage() {
  const { products, categories } = await getData()

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sacred">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-warm-white to-gold-light/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.15)_0%,transparent_70%)]" />

        {/* Sacred cross pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gold" />
          <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gold -translate-x-1/2 translate-y-16" />
          <div className="absolute top-1/3 right-1/4 w-px h-24 bg-gold" />
          <div className="absolute top-1/3 right-1/4 w-24 h-px bg-gold translate-x-1/2 translate-y-12" />
          <div className="absolute bottom-1/3 left-1/3 w-px h-20 bg-gold" />
          <div className="absolute bottom-1/3 left-1/3 w-20 h-px bg-gold -translate-x-1/2 translate-y-10" />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Cross ornament */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-16 bg-gold/60" />
            <span className="mx-4 text-gold text-2xl font-serif">✝</span>
            <div className="h-px w-16 bg-gold/60" />
          </div>

          {/* Eyebrow */}
          <p className="font-sans text-[10px] tracking-widest-3 uppercase text-gold-dark mb-6 animate-fade-in">
            Artículos Religiosos Artesanales
          </p>

          {/* Main Title */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-burgundy leading-none mb-2">
            Corazón
          </h1>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl italic text-terracotta leading-none mb-8">
            de Paz
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gold/40" />
            <span className="text-gold/60 text-xs">✦</span>
            <div className="h-px w-12 bg-gold/40" />
          </div>

          {/* Description */}
          <p className="font-sans text-sm md:text-base text-text-muted leading-loose max-w-md mx-auto mb-10">
            Cada pieza es una oración hecha a mano. Rosarios, escapularios y piezas
            devocionales creados con amor, fe y los mejores materiales artesanales de México.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/productos" className="btn-primary min-w-48">
              Explorar Colección
            </Link>
            <Link href="/productos?categoria=edicion-especial" className="btn-outline min-w-48">
              Edición Especial
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-14 text-text-muted/60">
            {['Hecho a mano', 'Materiales premium', 'Con devoción'].map((text, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-gold text-xs">✦</span>
                <span className="font-sans text-[10px] tracking-wider uppercase">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/40 animate-bounce">
          <span className="font-sans text-[9px] tracking-widest uppercase">Descubrir</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle mb-3">Nuestras Colecciones</p>
            <h2 className="section-title">Encuentra tu pieza</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-8 bg-gold/40" />
              <span className="text-gold/60 text-xs">✦</span>
              <div className="h-px w-8 bg-gold/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(categories as Category[]).map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="group flex flex-col items-center justify-center p-6 aspect-square bg-cream border border-gold-light/30 hover:border-gold hover:bg-gold/5 transition-all duration-300"
              >
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {CATEGORY_ICONS[cat.slug] ?? '✝'}
                </span>
                <span className="font-serif text-base text-burgundy group-hover:text-terracotta transition-colors text-center leading-tight">
                  {cat.name}
                </span>
                <span className="font-sans text-[9px] tracking-widest uppercase text-gold-dark/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver todo
                </span>
              </Link>
            ))}
            <Link
              href="/productos"
              className="group flex flex-col items-center justify-center p-6 aspect-square bg-terracotta/5 border border-terracotta/20 hover:bg-terracotta hover:border-terracotta transition-all duration-300"
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🛍</span>
              <span className="font-serif text-base text-burgundy group-hover:text-white transition-colors text-center leading-tight">
                Todo el Catálogo
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="py-20 bg-burgundy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <span className="text-gold/40 text-4xl font-serif">"</span>
          <p className="font-serif text-2xl md:text-3xl text-cream/90 italic leading-relaxed my-4">
            Pedid y se os dará, buscad y hallaréis,
            llamad y se os abrirá.
          </p>
          <span className="text-gold/40 text-4xl font-serif">"</span>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-8 bg-gold/30" />
            <p className="font-sans text-xs tracking-widest uppercase text-gold/60">Mateo 7:7</p>
            <div className="h-px w-8 bg-gold/30" />
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {products.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-subtitle mb-3">Selección especial</p>
              <h2 className="section-title">Piezas Destacadas</h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-px w-8 bg-gold/40" />
                <span className="text-gold/60 text-xs">✦</span>
                <div className="h-px w-8 bg-gold/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(products as Product[]).map((product) => (
                <ProductCard key={product.id} product={product} supabaseUrl={SUPABASE_URL} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/productos" className="btn-outline">
                Ver toda la colección
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-subtitle mb-3">Nuestra promesa</p>
            <h2 className="section-title">Por qué elegirnos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤲',
                title: 'Hecho a Mano',
                desc: 'Cada pieza es elaborada artesanalmente, con dedicación y amor. No existe ninguna igual a otra en el mundo.',
              },
              {
                icon: '✝',
                title: 'Con Fe y Devoción',
                desc: 'Nuestras piezas nacen de una profunda espiritualidad. Cada cuenta, cada nudo, cada detalle lleva una intención sagrada.',
              },
              {
                icon: '⭐',
                title: 'Materiales Premium',
                desc: 'Seleccionamos los mejores materiales: cerámica artesanal, metales nobles, telas naturales y esencias puras.',
              },
              {
                icon: '🎁',
                title: 'Personalización',
                desc: 'Podemos crear la pieza perfecta para ti o tu ser querido. Añade nombres, fechas, dedicatorias o colores especiales.',
              },
              {
                icon: '📦',
                title: 'Empaque de Regalo',
                desc: 'Cada pedido llega en un empaque artesanal digno de la pieza que contiene. Listo para regalar desde el primer momento.',
              },
              {
                icon: '💬',
                title: 'Atención Cercana',
                desc: 'Te acompañamos en cada paso. Desde elegir tu pieza hasta asegurarnos de que llegue perfecta a tus manos.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 border border-gold-light/20 hover:border-gold/40 transition-all duration-300 group"
              >
                <span className="text-4xl block mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <h3 className="font-serif text-xl text-burgundy mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ── */}
      <section className="py-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-sacred opacity-40" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <span className="text-gold text-3xl mb-4 block">✝</span>
          <h2 className="section-title mb-4">Síguenos en Instagram</h2>
          <p className="font-sans text-sm text-text-muted mb-8 leading-relaxed">
            Descubre el proceso artesanal, piezas nuevas y la comunidad de fe que nos inspira cada día.
          </p>
          <a
            href="https://www.instagram.com/corazondepaz_/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @corazondepaz_
          </a>
        </div>
      </section>
    </div>
  )
}

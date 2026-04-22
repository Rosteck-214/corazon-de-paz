import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { Product, Category } from '@/lib/types'

export const revalidate = 1800
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

interface Props {
  searchParams: Promise<{ categoria?: string; orden?: string; q?: string }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  const [{ data: categories }, categoriaData] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    params.categoria
      ? supabase.from('categories').select('id, name').eq('slug', params.categoria).single()
      : Promise.resolve({ data: null }),
  ])

  let query = supabase
    .from('products')
    .select('*, categories(*), product_images(*), product_variants(id, stock)')
    .eq('is_active', true)

  if (categoriaData.data) {
    query = query.eq('category_id', categoriaData.data.id)
  }

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }

  const order = params.orden === 'precio-asc' ? 'base_price' : params.orden === 'precio-desc' ? 'base_price' : 'created_at'
  const ascending = params.orden === 'precio-asc'
  query = query.order(order, { ascending })

  const { data: products } = await query

  const activeCategory = categoriaData.data as { id: string; name: string } | null

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 bg-sacred border-b border-gold-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="section-subtitle mb-3">Artículos Artesanales</p>
          <h1 className="section-title">
            {activeCategory ? activeCategory.name : 'Catálogo Completo'}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-8 bg-gold/40" />
            <span className="text-gold/60 text-xs">✦</span>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <p className="font-sans text-sm text-text-muted mt-4">
            {products?.length ?? 0} piezas disponibles
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-24">
              {/* Search */}
              <form method="GET" className="mb-8">
                <label className="block font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={params.q}
                    placeholder="Nombre del producto..."
                    className="input-field pr-10 text-xs"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-terracotta">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Categories */}
              <div className="mb-8">
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-4">Categorías</p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/productos"
                      className={`font-sans text-sm transition-colors block py-1 ${!params.categoria ? 'text-terracotta font-medium' : 'text-text-muted hover:text-terracotta'}`}
                    >
                      Todas las piezas
                    </a>
                  </li>
                  {(categories ?? []).map((cat: Category) => (
                    <li key={cat.id}>
                      <a
                        href={`/productos?categoria=${cat.slug}`}
                        className={`font-sans text-sm transition-colors block py-1 ${params.categoria === cat.slug ? 'text-terracotta font-medium' : 'text-text-muted hover:text-terracotta'}`}
                      >
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order */}
              <div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-4">Ordenar por</p>
                <ul className="space-y-2">
                  {[
                    { value: '', label: 'Más recientes' },
                    { value: 'precio-asc', label: 'Precio: menor a mayor' },
                    { value: 'precio-desc', label: 'Precio: mayor a menor' },
                  ].map((opt) => (
                    <li key={opt.value}>
                      <a
                        href={`/productos?${params.categoria ? `categoria=${params.categoria}&` : ''}orden=${opt.value}`}
                        className={`font-sans text-sm transition-colors block py-1 ${(params.orden ?? '') === opt.value ? 'text-terracotta font-medium' : 'text-text-muted hover:text-terracotta'}`}
                      >
                        {opt.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {!products || products.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl text-gold-light block mb-4">✝</span>
                <p className="font-serif text-2xl text-burgundy mb-2">No encontramos piezas</p>
                <p className="font-sans text-sm text-text-muted">
                  Prueba con otra categoría o búsqueda
                </p>
                <a href="/productos" className="btn-outline mt-6 inline-block">
                  Ver todo el catálogo
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {(products as Product[]).map((product) => (
                  <ProductCard key={product.id} product={product} supabaseUrl={SUPABASE_URL} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

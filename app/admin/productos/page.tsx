export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default async function AdminProductosPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name), product_variants(stock)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Gestión</p>
          <h1 className="font-serif text-3xl text-burgundy mt-1">Productos</h1>
        </div>
        <button className="btn-primary text-sm">+ Nuevo Producto</button>
      </div>

      <div className="border border-gold-light/30 overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              {['Producto', 'Categoría', 'Precio', 'Stock total', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left font-sans text-[9px] tracking-widest uppercase text-gold-dark px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(products as Product[] ?? []).map((p, i) => {
              const totalStock = p.product_variants?.reduce((s, v) => s + (v.stock ?? 0), 0) ?? 0
              return (
                <tr key={p.id} className={`border-t border-gold-light/20 hover:bg-cream/50 ${i % 2 ? 'bg-cream/20' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-burgundy font-medium">{p.name}</p>
                    <p className="font-sans text-[10px] text-text-muted">{p.slug}</p>
                    {p.is_featured && (
                      <span className="font-sans text-[9px] bg-gold/20 text-gold-dark px-1.5 py-0.5 uppercase tracking-wider">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-text-muted">
                    {(p.categories as { name: string } | null)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-serif text-sm text-terracotta">
                    ${p.base_price.toLocaleString('es-MX')} MXN
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-sm font-bold ${totalStock === 0 ? 'text-red-500' : totalStock < 5 ? 'text-orange-500' : 'text-sage'}`}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[9px] uppercase tracking-wider px-2 py-1 ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/productos/${p.slug}`}
                        target="_blank"
                        className="font-sans text-xs text-terracotta hover:underline"
                      >
                        Ver →
                      </Link>
                      <button className="font-sans text-xs text-clay hover:text-terracotta">
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="py-16 text-center">
            <span className="text-4xl text-gold-light block mb-3">✝</span>
            <p className="font-sans text-sm text-text-muted">No hay productos. Crea el primero.</p>
          </div>
        )}
      </div>
    </div>
  )
}

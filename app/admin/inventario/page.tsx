import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminInventarioPage() {
  const supabase = createAdminClient()
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*, products(name, slug)')
    .order('stock', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Gestión</p>
        <h1 className="font-serif text-3xl text-burgundy mt-1">Inventario</h1>
      </div>

      {/* Alerts */}
      {(variants ?? []).filter((v) => v.stock < 5).length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 flex items-start gap-3">
          <span className="text-orange-500 text-lg">⚠</span>
          <div>
            <p className="font-sans text-sm text-orange-800 font-medium">
              {(variants ?? []).filter((v) => v.stock < 5).length} variante(s) con stock bajo
            </p>
            <p className="font-sans text-xs text-orange-600">Revisa y actualiza el inventario pronto</p>
          </div>
        </div>
      )}

      <div className="border border-gold-light/30 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              {['Producto', 'SKU', 'Stock', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left font-sans text-[9px] tracking-widest uppercase text-gold-dark px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(variants ?? []).map((v, i) => {
              const stockStatus = v.stock === 0 ? 'Agotado' : v.stock < 5 ? 'Stock bajo' : 'Disponible'
              const stockColor = v.stock === 0 ? 'text-red-600' : v.stock < 5 ? 'text-orange-500' : 'text-sage'
              return (
                <tr key={v.id} className={`border-t border-gold-light/20 hover:bg-cream/50 ${i % 2 ? 'bg-cream/20' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-burgundy">
                      {(v.products as { name: string } | null)?.name ?? '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-text-muted font-mono">{v.sku}</td>
                  <td className="px-4 py-3">
                    <span className={`font-serif text-2xl font-bold ${stockColor}`}>{v.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[9px] uppercase tracking-wider ${stockColor}`}>
                      {stockStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={v.stock}
                        className="w-16 px-2 py-1 border border-gold-light/50 font-sans text-xs text-burgundy focus:outline-none focus:border-terracotta bg-transparent"
                      />
                      <button className="font-sans text-xs bg-terracotta text-white px-2 py-1 hover:bg-terracotta-dark transition-colors">
                        Actualizar
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

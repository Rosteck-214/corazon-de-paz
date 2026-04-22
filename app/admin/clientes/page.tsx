import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminClientesPage() {
  const supabase = createAdminClient()
  const { data: customers } = await supabase
    .from('customers')
    .select('*, orders(id, total, status)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Gestión</p>
        <h1 className="font-serif text-3xl text-burgundy mt-1">Clientes</h1>
      </div>

      <div className="border border-gold-light/30 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              {['Nombre', 'Email', 'Teléfono', 'Pedidos', 'Total gastado', 'Registro'].map((h) => (
                <th key={h} className="text-left font-sans text-[9px] tracking-widest uppercase text-gold-dark px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c, i) => {
              const orders = c.orders as { id: string; total: number; status: string }[]
              const totalSpent = orders.filter((o) => o.status === 'paid' || o.status === 'delivered')
                .reduce((s, o) => s + Number(o.total), 0)

              return (
                <tr key={c.id} className={`border-t border-gold-light/20 hover:bg-cream/50 ${i % 2 ? 'bg-cream/20' : ''}`}>
                  <td className="px-4 py-3 font-sans text-sm text-burgundy font-medium">{c.full_name}</td>
                  <td className="px-4 py-3 font-sans text-xs text-text-muted">{c.email}</td>
                  <td className="px-4 py-3 font-sans text-xs text-text-muted">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 font-sans text-sm text-burgundy">{orders.length}</td>
                  <td className="px-4 py-3 font-serif text-sm text-terracotta">
                    ${totalSpent.toLocaleString('es-MX')} MXN
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-text-muted">
                    {new Date(c.created_at).toLocaleDateString('es-MX')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {(!customers || customers.length === 0) && (
          <div className="py-16 text-center">
            <span className="text-4xl text-gold-light block mb-3">👤</span>
            <p className="font-sans text-sm text-text-muted">No hay clientes registrados aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}

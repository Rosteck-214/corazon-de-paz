import { createAdminClient } from '@/lib/supabase/admin'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  awaiting_payment: 'Esperando pago',
  paid: 'Pagado',
  in_preparation: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  awaiting_payment: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  in_preparation: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-600',
}

export default async function AdminPedidosPage() {
  const supabase = createAdminClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, customers(full_name, email, phone), order_items(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Gestión</p>
        <h1 className="font-serif text-3xl text-burgundy mt-1">Pedidos</h1>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Todos', ...Object.keys(STATUS_LABELS)].map((s) => (
          <span
            key={s}
            className={`font-sans text-[9px] uppercase tracking-wider px-3 py-1.5 cursor-pointer border transition-colors ${
              s === 'Todos'
                ? 'bg-burgundy text-cream border-burgundy'
                : 'border-gold-light/40 text-text-muted hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {s === 'Todos' ? 'Todos' : STATUS_LABELS[s]}
          </span>
        ))}
      </div>

      <div className="border border-gold-light/30 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-cream">
            <tr>
              {['Número', 'Fecha', 'Cliente', 'Items', 'Total', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left font-sans text-[9px] tracking-widest uppercase text-gold-dark px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(orders as Order[] ?? []).map((order, i) => (
              <tr key={order.id} className={`border-t border-gold-light/20 hover:bg-cream/50 ${i % 2 ? 'bg-cream/20' : ''}`}>
                <td className="px-4 py-3">
                  <p className="font-sans text-xs text-terracotta font-medium">{order.order_number}</p>
                </td>
                <td className="px-4 py-3 font-sans text-xs text-text-muted">
                  {new Date(order.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-sans text-xs text-burgundy">{order.customers?.full_name ?? '—'}</p>
                  <p className="font-sans text-[10px] text-text-muted">{order.customers?.email}</p>
                </td>
                <td className="px-4 py-3 font-sans text-xs text-text-muted">
                  {order.order_items?.length ?? 0} pieza(s)
                </td>
                <td className="px-4 py-3 font-serif text-sm text-terracotta">
                  ${Number(order.total).toLocaleString('es-MX')} MXN
                </td>
                <td className="px-4 py-3">
                  <span className={`font-sans text-[9px] uppercase tracking-wider px-2 py-1 ${STATUS_COLORS[order.status] ?? ''}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button className="font-sans text-xs text-terracotta hover:underline">Ver</button>
                    <select className="font-sans text-xs text-clay border-b border-gold-light/50 bg-transparent focus:outline-none focus:border-terracotta cursor-pointer">
                      <option value="">Cambiar estado</option>
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!orders || orders.length === 0) && (
          <div className="py-16 text-center">
            <span className="text-4xl text-gold-light block mb-3">📦</span>
            <p className="font-sans text-sm text-text-muted">No hay pedidos aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

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
  delivered: 'bg-sage/20 text-sage',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-600',
}

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { data: orders },
    { count: productCount },
    { count: customerCount },
    { data: lowStock },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('*, customers(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase
      .from('product_variants')
      .select('sku, stock, products(name)')
      .lt('stock', 5)
      .gt('stock', -1)
      .eq('is_active', true)
      .limit(5),
  ])

  const totalRevenue = (orders ?? [])
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((s, o) => s + Number(o.total), 0)

  const pendingOrders = (orders ?? []).filter(
    (o) => o.status === 'pending' || o.status === 'awaiting_payment'
  ).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Panel de Control</p>
        <h1 className="font-serif text-3xl text-burgundy mt-1">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Ingresos (pagados)', value: `$${totalRevenue.toLocaleString('es-MX')} MXN`, icon: '💰', color: 'bg-gold/10 border-gold/30' },
          { label: 'Pedidos pendientes', value: pendingOrders, icon: '📦', color: 'bg-orange-50 border-orange-200' },
          { label: 'Productos activos', value: productCount ?? 0, icon: '📿', color: 'bg-cream border-gold-light/40' },
          { label: 'Clientes', value: customerCount ?? 0, icon: '👥', color: 'bg-blue-50 border-blue-200' },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 border ${stat.color}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="font-serif text-3xl text-burgundy mb-1">{stat.value}</p>
            <p className="font-sans text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-burgundy">Pedidos recientes</h2>
            <Link href="/admin/pedidos" className="font-sans text-xs text-terracotta hover:text-terracotta-dark uppercase tracking-wider">
              Ver todos →
            </Link>
          </div>
          <div className="border border-gold-light/30 overflow-hidden">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  {['Pedido', 'Cliente', 'Total', 'Estado'].map((h) => (
                    <th key={h} className="text-left font-sans text-[9px] tracking-widest uppercase text-gold-dark px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(orders ?? []).map((order, i) => (
                  <tr key={order.id} className={`border-t border-gold-light/20 hover:bg-cream/50 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/30'}`}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/pedidos?id=${order.id}`} className="font-sans text-xs text-terracotta hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-xs text-burgundy">{order.customers?.full_name ?? '—'}</p>
                      <p className="font-sans text-[10px] text-text-muted">{order.customers?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-burgundy">
                      ${Number(order.total).toLocaleString('es-MX')} MXN
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm ${STATUS_COLORS[order.status] ?? ''}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!orders || orders.length === 0) && (
              <p className="font-sans text-sm text-text-muted text-center py-10">
                No hay pedidos aún
              </p>
            )}
          </div>
        </div>

        {/* Low stock */}
        <div>
          <h2 className="font-serif text-xl text-burgundy mb-4">Stock bajo</h2>
          <div className="border border-gold-light/30 overflow-hidden">
            {(!lowStock || lowStock.length === 0) ? (
              <div className="p-6 text-center">
                <p className="font-sans text-xs text-text-muted">Sin alertas de inventario</p>
              </div>
            ) : (
              <ul className="divide-y divide-gold-light/20">
                {lowStock.map((v) => (
                  <li key={v.sku} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-sans text-xs text-burgundy line-clamp-1">
                        {(v.products as { name: string } | null)?.name ?? '—'}
                      </p>
                      <p className="font-sans text-[10px] text-text-muted">{v.sku}</p>
                    </div>
                    <span className={`font-serif text-lg font-bold ${v.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                      {v.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-6">
            <h2 className="font-serif text-xl text-burgundy mb-4">Acciones rápidas</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/productos', label: 'Nuevo producto', icon: '+' },
                { href: '/admin/pedidos', label: 'Ver pedidos', icon: '📦' },
                { href: '/admin/inventario', label: 'Inventario', icon: '📊' },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 px-4 py-3 border border-gold-light/30 hover:border-terracotta hover:bg-terracotta/5 transition-all font-sans text-sm text-clay hover:text-terracotta"
                >
                  <span>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

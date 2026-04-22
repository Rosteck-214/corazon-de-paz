import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Panel Admin | Corazón de Paz' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-warm-white font-sans">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

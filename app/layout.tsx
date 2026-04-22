import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Corazón de Paz — Artículos Religiosos Artesanales Premium',
    template: '%s | Corazón de Paz',
  },
  description:
    'Rosarios, escapularios, san benitos y piezas devocionales hechas a mano con amor y devoción. Artículos religiosos artesanales premium de México.',
  keywords: ['rosarios artesanales', 'escapularios', 'san benito', 'artículos religiosos', 'regalo primera comunión', 'boda religiosa'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Corazón de Paz',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#4A1A1A',
              color: '#F7F2E9',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              border: '1px solid #C9A96E',
            },
            success: { iconTheme: { primary: '#C9A96E', secondary: '#4A1A1A' } },
          }}
        />
      </body>
    </html>
  )
}

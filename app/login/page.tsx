'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Credenciales incorrectas')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-sacred flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <span className="text-gold text-4xl block mb-3">✝</span>
          <h1 className="font-serif text-3xl text-burgundy">Corazón de Paz</h1>
          <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mt-1">
            Panel Administrativo
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-warm-white border border-gold-light/40 p-8 shadow-sm">
          <div className="mb-5">
            <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@corazondepaz.mx"
            />
          </div>
          <div className="mb-7">
            <label className="font-sans text-xs text-text-muted uppercase tracking-wider mb-1.5 block">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="font-sans text-xs text-text-muted hover:text-terracotta transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function GraciasPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="min-h-screen pt-20 bg-sacred flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center py-20">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 border-2 border-gold/30 rounded-full" />
          <div className="absolute inset-2 border border-gold/20 rounded-full" />
          <span className="text-4xl text-gold">✝</span>
        </div>

        {/* Title */}
        <p className="section-subtitle mb-3">¡Pedido recibido!</p>
        <h1 className="font-serif text-4xl md:text-5xl text-burgundy mb-4">
          Gracias por tu confianza
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gold/40" />
          <span className="text-gold/60 text-xs">✦</span>
          <div className="h-px w-12 bg-gold/40" />
        </div>

        {/* Order number */}
        {order && (
          <div className="bg-cream border border-gold-light/40 px-6 py-4 mb-8 inline-block">
            <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-1">
              Número de pedido
            </p>
            <p className="font-serif text-2xl text-burgundy">{order}</p>
          </div>
        )}

        {/* Message */}
        <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">
          Hemos recibido tu pedido y te contactaremos en breve con las instrucciones de pago
          y confirmación. Revisa tu correo electrónico.
        </p>
        <p className="font-sans text-sm text-text-muted leading-relaxed mb-8">
          Cada pieza de Corazón de Paz se elabora con amor y dedicación. Tu paciencia
          es parte del proceso sagrado de creación.
        </p>

        {/* Quote */}
        <div className="bg-burgundy/5 border-l-2 border-gold px-6 py-4 mb-10 text-left">
          <p className="font-serif text-base italic text-burgundy/80">
            "La fe es la certeza de lo que se espera, la convicción de lo que no se ve."
          </p>
          <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mt-2">
            Hebreos 11:1
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/productos" className="btn-primary">
            Seguir explorando
          </Link>
          <Link href="/" className="btn-outline">
            Volver al inicio
          </Link>
        </div>

        {/* Instagram */}
        <div className="mt-12 pt-8 border-t border-gold-light/30">
          <p className="font-sans text-xs text-text-muted mb-3">
            Comparte tu experiencia con nosotros
          </p>
          <a
            href="https://www.instagram.com/corazondepaz_/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-terracotta hover:text-terracotta-dark transition-colors tracking-wider uppercase"
          >
            @corazondepaz_
          </a>
        </div>
      </div>
    </div>
  )
}

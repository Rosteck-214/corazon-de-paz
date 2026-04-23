import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

interface Props {
  product: Product
  supabaseUrl: string
}

export default function ProductCard({ product, supabaseUrl }: Props) {
  const image = product.product_images?.find((i) => i.is_primary) ?? product.product_images?.[0]
  const imageUrl = image
    ? `${supabaseUrl}/storage/v1/object/public/products/${image.storage_path}`
    : null

  const hasVariants = (product.product_variants?.length ?? 0) > 1
  const inStock = product.product_variants?.some((v) => v.stock > 0) ?? false

  return (
    <Link href={`/productos/${product.slug}`} className="card-product group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 img-placeholder flex flex-col items-center justify-center gap-2">
            <span className="text-gold text-5xl">✝</span>
            <span className="font-sans text-xs text-gold-dark/60 tracking-widest uppercase">Corazón de Paz</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="bg-gold text-burgundy font-sans text-[9px] tracking-widest uppercase px-2 py-1">
              Destacado
            </span>
          )}
          {!inStock && (
            <span className="bg-burgundy/80 text-cream font-sans text-[9px] tracking-widest uppercase px-2 py-1">
              Agotado
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition-all duration-500 flex items-end">
          <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
            <span className="block w-full text-center bg-terracotta/95 text-white font-sans text-xs tracking-widest uppercase py-2.5">
              Ver Pieza
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-gold-light/30">
        {product.categories && (
          <p className="font-sans text-[9px] tracking-widest uppercase text-gold-dark mb-1">
            {product.categories.name}
          </p>
        )}
        <h3 className="font-serif text-lg text-burgundy leading-tight group-hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="font-sans text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gold-light/20">
          <span className="font-serif text-xl text-terracotta">
            ${product.base_price.toLocaleString('es-MX')}
            <span className="font-sans text-xs text-text-muted ml-1">MXN</span>
          </span>
          {hasVariants && (
            <span className="font-sans text-[9px] tracking-wider text-text-muted uppercase">
              Variantes disponibles
            </span>
          )}
        </div>
        <p className="font-sans text-[10px] text-text-muted/70 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Elaboración: {product.crafting_days} días hábiles
        </p>
      </div>
    </Link>
  )
}

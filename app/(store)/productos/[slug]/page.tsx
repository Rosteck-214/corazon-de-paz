'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/cart-store'
import type { Product, ProductOption, ProductVariant } from '@/lib/types'
import toast from 'react-hot-toast'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

function formatPrice(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 0 })
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [personalization, setPersonalization] = useState<Record<string, string>>({})
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  useEffect(() => {
    async function load() {
      const { slug } = await params
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          product_images(*),
          product_options(*, product_option_values(*)),
          product_variants(*, product_variant_options(option_value_id))
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (!data) { notFound(); return }
      setProduct(data as Product)
      setLoading(false)
    }
    load()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-cream">
        <div className="text-center">
          <span className="text-5xl text-gold-light animate-pulse block mb-4">✝</span>
          <p className="font-serif text-xl text-burgundy">Cargando pieza...</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = product.product_images ?? []
  const options = (product.product_options ?? []) as ProductOption[]
  const variants = (product.product_variants ?? []) as ProductVariant[]

  const getMatchingVariant = (): ProductVariant | undefined => {
    if (Object.keys(selectedOptions).length === 0) return variants[0]
    return variants.find((v) => {
      const optionValueIds = v.product_variant_options?.map((o) => o.option_value_id) ?? []
      const selectedValueIds = options
        .map((opt) => {
          const sel = selectedOptions[opt.id]
          return opt.product_option_values?.find((ov) => ov.value === sel)?.id
        })
        .filter(Boolean) as string[]
      return selectedValueIds.every((id) => optionValueIds.includes(id))
    })
  }

  const matchedVariant = getMatchingVariant()
  const finalPrice = product.base_price + (matchedVariant?.price_modifier ?? 0)
  const inStock = (matchedVariant?.stock ?? 0) > 0
  const crafting = matchedVariant?.crafting_days ?? product.crafting_days

  function handleAddToCart() {
    if (!product || !matchedVariant) {
      toast.error('Por favor selecciona todas las opciones')
      return
    }
    const primaryImage = images.find((i) => i.is_primary) ?? images[0]
    const imageUrl = primaryImage
      ? `${SUPABASE_URL}/storage/v1/object/public/products/${primaryImage.storage_path}`
      : null

    addItem({
      id: `${matchedVariant.id}-${Date.now()}`,
      productId: product.id,
      variantId: matchedVariant.id,
      name: product.name,
      slug: product.slug,
      sku: matchedVariant.sku,
      price: finalPrice,
      quantity,
      imageUrl,
      options: selectedOptions,
      personalization,
    })
    toast.success('Pieza añadida al carrito ✝')
  }

  const currentImage = images[selectedImage]
  const currentImageUrl = currentImage
    ? `${SUPABASE_URL}/storage/v1/object/public/products/${currentImage.storage_path}`
    : null

  return (
    <div className="min-h-screen pt-20 bg-warm-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 font-sans text-xs text-text-muted">
          <Link href="/" className="hover:text-terracotta transition-colors">Inicio</Link>
          <span className="text-gold/40">✦</span>
          <Link href="/productos" className="hover:text-terracotta transition-colors">Catálogo</Link>
          <span className="text-gold/40">✦</span>
          {product.categories && (
            <>
              <Link href={`/productos?categoria=${product.categories.slug}`} className="hover:text-terracotta transition-colors">
                {product.categories.name}
              </Link>
              <span className="text-gold/40">✦</span>
            </>
          )}
          <span className="text-burgundy font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-cream overflow-hidden mb-3">
              {currentImageUrl ? (
                <Image
                  src={currentImageUrl}
                  alt={currentImage?.alt_text ?? product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 img-placeholder flex flex-col items-center justify-center gap-3">
                  <span className="text-gold text-8xl">✝</span>
                  <span className="font-sans text-xs text-gold-dark/60 tracking-widest uppercase">
                    Corazón de Paz
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => {
                  const url = `${SUPABASE_URL}/storage/v1/object/public/products/${img.storage_path}`
                  return (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 flex-shrink-0 border-2 transition-colors ${selectedImage === idx ? 'border-terracotta' : 'border-gold-light/30 hover:border-gold'}`}
                    >
                      <Image src={url} alt="" fill className="object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categories && (
              <p className="section-subtitle mb-2">{product.categories.name}</p>
            )}
            <h1 className="font-serif text-4xl md:text-5xl text-burgundy leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-end gap-3 mb-6">
              <span className="font-serif text-4xl text-terracotta">
                ${formatPrice(finalPrice)}
              </span>
              <span className="font-sans text-sm text-text-muted mb-1">MXN</span>
              {(matchedVariant?.price_modifier ?? 0) > 0 && (
                <span className="font-sans text-xs text-gold-dark bg-gold-light/30 px-2 py-1">
                  +${formatPrice(matchedVariant!.price_modifier)} por esta variante
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gold-light/40" />
              <span className="text-gold/40 text-xs">✦</span>
            </div>

            {/* Options */}
            {options.map((opt) => (
              <div key={opt.id} className="mb-6">
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-3">
                  {opt.name}
                  {selectedOptions[opt.id] && (
                    <span className="ml-2 text-terracotta normal-case text-xs font-normal">
                      — {selectedOptions[opt.id]}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(opt.product_option_values ?? []).map((val) => (
                    <button
                      key={val.id}
                      onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.id]: val.value }))}
                      className={`px-4 py-2 font-sans text-xs border transition-all duration-200 ${
                        selectedOptions[opt.id] === val.value
                          ? 'bg-terracotta border-terracotta text-white'
                          : 'bg-transparent border-gold-light/50 text-clay hover:border-terracotta hover:text-terracotta'
                      }`}
                    >
                      {val.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Personalization */}
            <div className="mb-6 p-5 bg-cream border border-gold-light/30">
              <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-3">
                Personalización (opcional)
              </p>
              <div className="space-y-3">
                <div>
                  <label className="font-sans text-xs text-text-muted mb-1 block">Dedicatoria</label>
                  <input
                    type="text"
                    placeholder="Ej. Para Mamá, con amor. Mayo 2025."
                    maxLength={80}
                    value={personalization.dedicatoria ?? ''}
                    onChange={(e) => setPersonalization((p) => ({ ...p, dedicatoria: e.target.value }))}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-muted mb-1 block">Nota especial</label>
                  <textarea
                    placeholder="Instrucciones adicionales, ocasión especial..."
                    maxLength={200}
                    rows={2}
                    value={personalization.nota ?? ''}
                    onChange={(e) => setPersonalization((p) => ({ ...p, nota: e.target.value }))}
                    className="input-field text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark">Cantidad</p>
              <div className="flex items-center border border-gold-light/50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-clay hover:text-terracotta transition-colors"
                >
                  −
                </button>
                <span className="w-10 h-10 flex items-center justify-center font-sans text-sm text-burgundy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-clay hover:text-terracotta transition-colors"
                >
                  +
                </button>
              </div>
              {matchedVariant && (
                <span className={`font-sans text-xs ${inStock ? 'text-sage' : 'text-terracotta-light'}`}>
                  {inStock ? `${matchedVariant.stock} disponibles` : 'Sin stock'}
                </span>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`btn-primary w-full mb-3 ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {inStock ? 'Añadir al Carrito' : 'Sin Disponibilidad'}
            </button>
            <Link href="/checkout" className="btn-outline w-full text-center block">
              Comprar Ahora
            </Link>

            {/* Meta info */}
            <div className="mt-6 space-y-2 text-text-muted">
              <div className="flex items-center gap-2 font-sans text-xs">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tiempo de elaboración: <strong className="text-burgundy">{crafting} días hábiles</strong>
              </div>
              <div className="flex items-center gap-2 font-sans text-xs">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Pieza única hecha a mano con amor
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t border-gold-light/30">
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-4">Descripción</p>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

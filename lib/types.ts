export type Role = 'customer' | 'admin'

export interface Profile {
  id: string
  role: Role
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  short_description: string | null
  base_price: number
  is_active: boolean
  is_featured: boolean
  crafting_days: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  categories?: Category
  product_images?: ProductImage[]
  product_options?: ProductOption[]
  product_variants?: ProductVariant[]
}

export interface ProductOption {
  id: string
  product_id: string
  name: string
  sort_order: number
  product_option_values?: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  option_id: string
  value: string
  sort_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  price_modifier: number
  stock: number
  crafting_days: number | null
  is_active: boolean
  created_at: string
  product_variant_options?: { option_value_id: string }[]
}

export interface ProductImage {
  id: string
  product_id: string
  storage_path: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

export interface Customer {
  id: string
  profile_id: string | null
  email: string
  full_name: string
  phone: string | null
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  profile_id: string | null
  status: OrderStatus
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: ShippingAddress | null
  notes: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
  customers?: Customer
  order_items?: OrderItem[]
  payments?: Payment[]
}

export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'paid'
  | 'in_preparation'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_snapshot: ProductSnapshot
  quantity: number
  unit_price: number
  personalization: Record<string, string>
}

export interface ProductSnapshot {
  name: string
  sku: string
  price: number
  options?: Record<string, string>
}

export interface Payment {
  id: string
  order_id: string
  provider: string
  provider_payment_id: string | null
  amount: number
  currency: string
  status: string
  provider_response: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  full_name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip_code: string
  country: string
}

export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  slug: string
  sku: string
  price: number
  quantity: number
  imageUrl: string | null
  options: Record<string, string>
  personalization: Record<string, string>
}

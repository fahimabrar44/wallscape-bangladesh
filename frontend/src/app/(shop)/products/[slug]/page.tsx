'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'
import { Product, Review, Category } from '@/types'
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params)
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get<{ product: Product }>(`/api/products/${slug}`),
  })

  const product: Product | undefined = productData?.product

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', product?._id],
    queryFn: () => api.get<{ products: Product[] }>(`/api/products/${product!._id}/related`),
    enabled: !!product?._id,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: () => api.get<{ reviews: Review[] }>(`/api/reviews?product=${product!._id}&isApproved=true`),
    enabled: !!product?._id,
  })

  if (productLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <XCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link
          href="/products"
          className="mt-4 btn-ghost"
        >
          Back to products
        </Link>
      </div>
    )
  }

  const isDiscounted = product.discountPrice && product.discountPrice < product.price
  const displayPrice = isDiscounted ? product.discountPrice! : product.price
  const images = product.images?.length ? product.images : product.images
  const relatedProducts: Product[] = relatedData?.products ?? []
  const reviews: Review[] = reviewsData?.reviews ?? []
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomOrigin({ x, y })
  }

  const specs = [
    { label: 'Product Code', value: product.productCode },
    { label: 'Category', value: typeof product.category === 'string' ? product.category : (product.category as Category)?.name },
    { label: 'Brand', value: product.brand },
    { label: 'Material', value: product.material },
    { label: 'Color', value: product.color },
    { label: 'Pattern', value: product.pattern },
    { label: 'Roll Size', value: product.rollSize },
    { label: 'Coverage Area', value: product.coverageArea },
  ].filter((s) => s.value)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="truncate font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-lg"
            onMouseMove={handleMouseMove}
          >
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-150"
              style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {isDiscounted && (
              <span className="badge-gold absolute left-4 top-4">
                {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    i === selectedImage
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gradient">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-muted">{product.productCode}</p>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="price-current text-3xl">
              {formatCurrency(displayPrice)}
            </span>
            {isDiscounted && (
              <span className="price-original text-lg">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">In Stock</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="font-medium text-red-500">Out of Stock</span>
              </>
            )}
          </div>


          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-border bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock <= 0}
                className="flex h-12 w-12 items-center justify-center text-lg font-medium hover:bg-gray-50 disabled:opacity-30 rounded-l-xl transition-colors"
              >
                -
              </button>
              <span className="flex h-12 w-16 items-center justify-center border-x border-border text-base font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.stock <= 0}
                className="flex h-12 w-12 items-center justify-center text-lg font-medium hover:bg-gray-50 disabled:opacity-30 rounded-r-xl transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock <= 0}
              className="btn-primary flex flex-1 items-center justify-center gap-2 min-w-[160px]"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock <= 0}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </button>
          </div>

          <a
            href={`https://wa.me/880XXXXXXXXX?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" (${product.productCode}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Inquiry via WhatsApp
          </a>

          {product.description && (
            <div>
              <h2 className="section-label mb-3">Description</h2>
              <p className="text-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {specs.length > 0 && (
            <div>
              <h2 className="section-label mb-3">Specifications</h2>
              <div className="card-modern divide-y divide-border/50 overflow-hidden">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between px-5 py-3 text-sm"
                  >
                    <span className="text-muted">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="section-label text-2xl mb-6">
            Related Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp._id}
                href={`/products/${rp.slug}`}
                className="group card-premium p-3 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={getImageUrl(rp.images?.[0])}
                    alt={rp.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {rp.discountPrice && (
                    <span className="badge-gold absolute left-2 top-2">
                      {Math.round(((rp.price - rp.discountPrice) / rp.price) * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="truncate font-medium group-hover:text-primary transition-colors">
                  {rp.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="price-current">
                    {formatCurrency(rp.discountPrice || rp.price)}
                  </span>
                  {rp.discountPrice && (
                    <span className="price-original">
                      {formatCurrency(rp.price)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="section-label text-2xl">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <span className="badge">{reviews.length}</span>
          )}
        </div>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="card-modern p-5"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.customerName}</span>
                  <span className="text-xs text-muted">{review.createdAt}</span>
                </div>
                <p className="text-muted leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

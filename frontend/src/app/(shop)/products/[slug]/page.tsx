'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'
import { Product, Review } from '@/types'
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react'

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: () => api.get(`/api/products/${params.slug}`),
  })

  const product: Product | undefined = productData?.product

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', product?.id],
    queryFn: () => api.get(`/api/products/${product!.id}/related`),
    enabled: !!product?.id,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => api.get(`/api/reviews?product=${product!.id}&isApproved=true`),
    enabled: !!product?.id,
  })

  if (productLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <XCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold text-gray-800">Product not found</h2>
        <Link
          href="/products"
          className="mt-4 text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
        >
          Back to products
        </Link>
      </div>
    )
  }

  const isDiscounted = product.discountPrice && product.discountPrice < product.price
  const displayPrice = isDiscounted ? product.discountPrice! : product.price
  const images = product.images?.length ? product.images : [product.image].filter(Boolean)
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
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Material', value: product.material },
    { label: 'Color', value: product.color },
    { label: 'Pattern', value: product.pattern },
    { label: 'Roll Size', value: product.rollSize },
    { label: 'Coverage Area', value: product.coverageArea },
  ].filter((s) => s.value)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-emerald-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-600">
          Products
        </Link>
        <span>/</span>
        <span className="truncate text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
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
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
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
                      ? 'border-emerald-600 ring-2 ring-emerald-200'
                      : 'border-gray-200 hover:border-gray-400'
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

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{product.productCode}</p>
          </div>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
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
              <span className="text-sm text-gray-500">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-700">
              {formatCurrency(displayPrice)}
            </span>
            {isDiscounted && (
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-700">In Stock</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="font-medium text-red-500">Out of Stock</span>
              </>
            )}
          </div>

          {/* Installation Badge */}
          {product.installationAvailable && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>
                Professional installation service available for this product
              </span>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-gray-300 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!product.inStock}
                className="flex h-12 w-12 items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 rounded-l-xl transition-colors"
              >
                -
              </button>
              <span className="flex h-12 w-16 items-center justify-center border-x border-gray-300 text-base font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
                className="flex h-12 w-12 items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 rounded-r-xl transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addItem({ product, quantity })}
              disabled={!product.inStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all min-w-[160px]"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            <button
              onClick={() => addItem({ product, quantity })}
              disabled={!product.inStock}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </button>
          </div>

          {/* WhatsApp Inquiry */}
          <a
            href={`https://wa.me/880XXXXXXXXX?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" (${product.productCode}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-6 py-3 font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Inquiry via WhatsApp
          </a>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {specs.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Specifications
              </h2>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between px-4 py-3 text-sm"
                  >
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Related Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/products/${rp.slug}`}
                className="group rounded-2xl bg-white p-3 shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={getImageUrl(rp.image)}
                    alt={rp.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {rp.discountPrice && (
                    <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {Math.round(((rp.price - rp.discountPrice) / rp.price) * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="truncate font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {rp.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(rp.discountPrice || rp.price)}
                  </span>
                  {rp.discountPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(rp.price)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex">
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
                  <span className="text-sm font-medium text-gray-900">
                    {review.author}
                  </span>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

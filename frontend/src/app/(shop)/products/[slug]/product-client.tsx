'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/cart-provider';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { Product, Review, Category } from '@/types';
import {
  ShoppingCart, Zap, MessageCircle, CheckCircle, XCircle, Star,
  Ruler, Package, Palette, Layers, Shield, Truck, RotateCcw,
  ChevronRight, Minus, Plus, Heart,
} from 'lucide-react';

const tabs = ['Description', 'Specifications', 'Installation', 'Reviews', 'Shipping'];

export default function ProductDetailClient({ product, relatedProducts, reviews }: { product: Product; relatedProducts: Product[]; reviews: Review[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [wished, setWished] = useState(false);

  const isDiscounted = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = isDiscounted ? product.discountPrice! : product.price;
  const images = product.images?.length ? product.images : [''];
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const specs = [
    { label: 'Product Code', value: product.productCode },
    { label: 'Category', value: typeof product.category === 'string' ? product.category : (product.category as Category)?.name },
    { label: 'Brand', value: product.brand },
    { label: 'Material', value: product.material },
    { label: 'Color', value: product.color },
    { label: 'Pattern', value: product.pattern },
    { label: 'Roll Size', value: product.rollSize },
    { label: 'Coverage', value: product.coverageArea },
  ].filter((s) => s.value);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-dark font-medium truncate">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-lg group" onMouseMove={handleMouseMove}>
            <Image src={getImageUrl(images[selectedImage])} alt={product.name} fill
              className="object-cover transition-transform duration-300 group-hover:scale-150"
              style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }} priority sizes="(max-width: 1024px) 100vw, 50vw" />
            {isDiscounted && (
              <span className="badge-accent absolute left-4 top-4">
                {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === selectedImage ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
                  <Image src={getImageUrl(img)} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-muted font-mono mb-1">{product.productCode}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-heading">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round(avgRating) ? 'text-primary-light fill-primary-light' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-sm text-muted">{avgRating.toFixed(1)} ({reviews.length})</span>
                </div>
              )}
              {product.totalSold > 0 && <span className="text-sm text-muted">{product.totalSold} sold</span>}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
            {isDiscounted && <span className="price-original text-lg">{formatCurrency(product.price)}</span>}
            <span className="text-sm text-muted">/ sq.ft</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {product.material && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <Layers size={16} className="text-muted mx-auto mb-1" />
                <p className="text-[10px] text-muted">Material</p>
                <p className="text-xs font-semibold text-gray-900">{product.material}</p>
              </div>
            )}
            {product.pattern && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <Palette size={16} className="text-muted mx-auto mb-1" />
                <p className="text-[10px] text-muted">Pattern</p>
                <p className="text-xs font-semibold text-gray-900">{product.pattern}</p>
              </div>
            )}
            {product.color && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <div className="w-4 h-4 rounded-full border border-gray-200 mx-auto mb-1" style={{ backgroundColor: product.color.toLowerCase() }} />
                <p className="text-[10px] text-muted">Color</p>
                <p className="text-xs font-semibold text-gray-900">{product.color}</p>
              </div>
            )}
            {product.rollSize && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <Ruler size={16} className="text-muted mx-auto mb-1" />
                <p className="text-[10px] text-muted">Roll Size</p>
                <p className="text-xs font-semibold text-gray-900">{product.rollSize}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <><CheckCircle size={18} className="text-green-600" /><span className="font-medium text-green-700 text-sm">In Stock</span></>
            ) : (
              <><XCircle size={18} className="text-red-400" /><span className="font-medium text-red-500 text-sm">Out of Stock</span></>
            )}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-amber-600 ml-2">Only {product.stock} left</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-border bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock <= 0}
                className="flex h-12 w-12 items-center justify-center hover:bg-gray-50 disabled:opacity-30 rounded-l-xl transition-colors">
                <Minus size={16} />
              </button>
              <span className="flex h-12 w-16 items-center justify-center border-x border-border text-base font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} disabled={product.stock <= 0}
                className="flex h-12 w-12 items-center justify-center hover:bg-gray-50 disabled:opacity-30 rounded-r-xl transition-colors">
                <Plus size={16} />
              </button>
            </div>

            <button onClick={() => addItem(product, quantity)} disabled={product.stock <= 0}
              className="btn-primary flex-1 min-w-[140px] justify-center gap-2 h-12">
              <ShoppingCart size={18} /> Add to Cart
            </button>

            <button onClick={() => { addItem(product, quantity); router.push('/checkout'); }} disabled={product.stock <= 0}
              className="btn-secondary h-12 justify-center gap-2 px-5">
              <Zap size={18} /> Buy Now
            </button>

            <button onClick={() => setWished(!wished)} className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Heart size={18} className={wished ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
            </button>
          </div>

          <a href={`https://wa.me/880XXXXXXXXX?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" (${product.productCode}).`)}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-ghost flex items-center justify-center gap-2 h-11 text-sm">
            <MessageCircle size={16} /> Inquiry via WhatsApp
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 lg:mt-16">
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-gray-900'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6 lg:py-8">
          {activeTab === 'Description' && (
            <div className="max-w-3xl">
              <p className="text-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'Specifications' && specs.length > 0 && (
            <div className="max-w-xl">
              <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
                {specs.map((s) => (
                  <div key={s.label} className="flex justify-between px-5 py-3.5 text-sm">
                    <span className="text-muted">{s.label}</span>
                    <span className="font-medium text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Installation' && (
            <div className="max-w-3xl">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Ruler, title: 'Measure Your Wall', desc: 'Measure the width and height of your wall to calculate required wallpaper quantity.' },
                  { icon: Shield, title: 'Surface Preparation', desc: 'Ensure your wall is clean, dry, and smooth. Fill any cracks or holes before installation.' },
                  { icon: Layers, title: 'Apply Adhesive', desc: 'Use recommended wallpaper adhesive. Apply evenly on the back of the wallpaper or wall as per instructions.' },
                  { icon: Package, title: 'Smooth & Finish', desc: 'Hang the wallpaper carefully, smoothing out air bubbles with a squeegee from center to edges.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <item.icon size={20} className="text-primary mb-2" />
                    <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted mt-6">Need professional installation? <Link href="/contact" className="text-primary hover:underline font-medium">Book our installation service</Link></p>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              {reviews.length === 0 ? (
                <p className="text-muted text-sm">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'text-primary-light fill-primary-light' : 'text-gray-300'} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{review.review}&rdquo;</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{review.customerName}</span>
                        <span className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Shipping' && (
            <div className="max-w-3xl">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Truck, title: 'Delivery Options', desc: 'Free delivery across Bangladesh for orders over 5,000 BDT. Standard delivery within 3-5 business days.' },
                  { icon: RotateCcw, title: 'Returns Policy', desc: 'We accept returns within 7 days of delivery for unopened rolls. Custom orders are non-returnable.' },
                  { icon: Shield, title: 'Quality Guarantee', desc: 'All wallpapers are inspected before shipping. Defective items will be replaced free of charge.' },
                  { icon: Package, title: 'Packaging', desc: 'Wallpapers are carefully rolled and wrapped in protective packaging to prevent damage during transit.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <item.icon size={20} className="text-primary mb-2" />
                    <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 lg:mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {relatedProducts.slice(0, 4).map((rp) => (
              <Link key={rp._id} href={`/products/${rp.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/20 hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <Image src={getImageUrl(rp.images?.[0])} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="25vw" />
                  {rp.discountPrice && <span className="badge-accent absolute top-2 left-2 text-[10px]">{Math.round(((rp.price - rp.discountPrice) / rp.price) * 100)}%</span>}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">{rp.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="price-current text-sm">{formatCurrency(rp.discountPrice || rp.price)}</span>
                    {rp.discountPrice && <span className="price-original text-[11px]">{formatCurrency(rp.price)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

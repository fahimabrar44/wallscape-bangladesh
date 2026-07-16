'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Product } from '@/types';
import { ChevronRight, TrendingUp, ArrowRight } from 'lucide-react';
import 'swiper/css';

export default function HomePage() {
  const { data: featured } = useQuery({ queryKey: ['featured-products'], queryFn: () => api.get<{ products: Product[] }>('/api/products/featured') });
  const { data: newArrivals } = useQuery({ queryKey: ['new-arrivals'], queryFn: () => api.get<{ products: Product[] }>('/api/products/new-arrivals') });
  const { data: bestSellers } = useQuery({ queryKey: ['best-sellers'], queryFn: () => api.get<{ products: Product[] }>('/api/products/best-sellers') });

  const featuredProducts = featured?.products || [];
  const newArrivalsList = newArrivals?.products || [];
  const bestSellersList = bestSellers?.products || [];

  if (featuredProducts.length === 0 && newArrivalsList.length === 0 && bestSellersList.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-muted">No products yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 sm:mb-10 lg:mb-14">
              <div>
                <span className="section-label">Featured</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient mt-1.5 sm:mt-2 mb-2 sm:mb-3">Curated Picks</h2>
                <p className="text-sm sm:text-base text-muted max-w-lg">Handpicked designs that define elegance and style for your interiors</p>
              </div>
              <Link href="/products?sort=featured" className="hidden lg:inline-flex items-center gap-1 text-primary font-medium hover:underline mt-4 lg:mt-0">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={2}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
              className="!pb-4"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="text-center mt-8 lg:hidden">
              <Link href="/products" className="inline-flex items-center gap-1 text-primary font-medium">
                View All Products <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivalsList.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28 bg-white">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-14">
              <div>
                <span className="section-label">New</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient mt-2 mb-3">Just Landed</h2>
                <p className="text-muted max-w-lg">Fresh designs and latest trends — be the first to explore</p>
              </div>
              <Link href="/products?sort=newest" className="hidden lg:inline-flex items-center gap-1 text-primary font-medium hover:underline mt-4 lg:mt-0">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
              {newArrivalsList.slice(0, 10).map((product, i) => (
                <div key={product._id} className="animate-slideUp" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {bestSellersList.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-14">
              <div>
                <span className="section-label">Popular</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gradient mt-2 mb-3">Best Sellers</h2>
                <p className="text-muted max-w-lg">Most loved by our customers across Bangladesh</p>
              </div>
              <Link href="/products?sort=best-selling" className="hidden lg:inline-flex items-center gap-1 text-primary font-medium hover:underline mt-4 lg:mt-0">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
              {bestSellersList.slice(0, 10).map((product, i) => (
                <div key={product._id} className="animate-slideUp" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                  <ProductCard product={product} isBestSeller />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
                Browse All Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* Product Card */
function ProductCard({ product, isBestSeller }: { product: Product; isBestSeller?: boolean }) {
  const imgSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/images/placeholder.svg';
  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 card-premium"
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="badge-gold">
              -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
            </span>
          )}
          {isBestSeller && (
            <span className="badge-primary flex items-center gap-0.5">
              <TrendingUp size={10} /> Best Seller
            </span>
          )}
        </div>

        {/* Quick view button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="block w-full text-center text-xs font-medium bg-white/90 backdrop-blur-sm text-dark py-2 rounded-lg shadow-lg">
            Quick View
          </span>
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-dark font-semibold px-4 py-1.5 rounded-lg text-sm shadow-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-3 lg:p-4">
        <p className="text-[10px] text-muted/60 mb-0.5 font-mono">{product.productCode}</p>
        <h3 className="font-medium text-sm lg:text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="price-current">{formatCurrency(price)}</span>
          {hasDiscount && (
            <span className="price-original">{formatCurrency(product.price)}</span>
          )}
        </div>
        {product.color && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: product.color.toLowerCase() }} />
            <span className="text-[10px] text-muted">{product.color}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

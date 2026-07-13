'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Product, Category, Banner } from '@/types';
import {
  ArrowRight, Star, Shield, Truck, Award, RefreshCw, Ruler, Calculator,
  CheckCircle, ChevronRight, Phone, MessageCircle, Play, Clock,
  Home, Paintbrush, Layers, Sparkles, Palette, Heart, TrendingUp,
  Quote, MapPin, Zap, Leaf, Users, Building2,
  ShoppingCart
} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: banners } = useQuery({ queryKey: ['banners'], queryFn: () => api.get<{ banners: Banner[] }>('/api/banners?isActive=true') });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => api.get<{ categories: Category[] }>('/api/categories?isActive=true') });
  const { data: featured } = useQuery({ queryKey: ['featured-products'], queryFn: () => api.get<{ products: Product[] }>('/api/products/featured') });
  const { data: newArrivals } = useQuery({ queryKey: ['new-arrivals'], queryFn: () => api.get<{ products: Product[] }>('/api/products/new-arrivals') });
  const { data: bestSellers } = useQuery({ queryKey: ['best-sellers'], queryFn: () => api.get<{ products: Product[] }>('/api/products/best-sellers') });

  const bannerList = banners?.banners || [];
  const categoryList = categories?.categories || [];
  const featuredProducts = featured?.products || [];
  const newArrivalsList = newArrivals?.products || [];
  const bestSellersList = bestSellers?.products || [];

  const heroBg = bannerList[0]?.image
    ? getImageUrl(bannerList[0].image)
    : null;

  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-dark">
        {/* Animated background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-dark to-[#0a2a14] opacity-90" />
          <div className="absolute top-20 left-10 w-48 sm:w-96 h-48 sm:h-96 bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-subtle" />
          <div className="absolute bottom-20 right-10 w-40 sm:w-80 h-40 sm:h-80 bg-primary-light/10 rounded-full blur-[60px] sm:blur-[100px] animate-float-slow" />
          <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-grid-white opacity-20 sm:opacity-30" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 right-[15%] w-20 h-20 border border-white/10 rounded-2xl rotate-45 animate-float-slow hidden lg:block" />
        <div className="absolute bottom-1/3 left-[10%] w-14 h-14 bg-white/5 rounded-xl rotate-12 animate-float hidden lg:block" />
        <div className="absolute top-1/3 left-[20%] w-3 h-3 bg-gold/40 rounded-full animate-pulse-subtle hidden lg:block" />
        <div className="absolute bottom-1/4 right-[25%] w-2 h-2 bg-primary-light/60 rounded-full animate-pulse-subtle hidden lg:block" />

        <div className="container-custom relative z-10 py-16 sm:py-20 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 animate-slideDown stagger-1">
              <Sparkles size={12} className="text-gold sm:size-[14px]" />
              <span className="text-[11px] sm:text-sm text-gray-200">Bangladesh&apos;s Premium Wallpaper Destination</span>
            </div>

            {/* Main heading */}
            <h1 className="text-[2rem] sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 animate-slideUp stagger-2">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-gold to-primary-light mt-1">
                Space into Art
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-lg lg:text-xl text-gray-300 max-w-xl mb-6 sm:mb-8 animate-slideUp stagger-3 leading-relaxed">
              Discover Bangladesh&apos;s finest collection of premium wallpapers. From elegant PVC to stunning 3D designs — we bring your walls to life.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slideUp stagger-4">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center gap-2 bg-primary-light text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Explore Collection <ArrowRight size={16} className="sm:size-[18px] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-white/10 transition-all hover:border-white/50"
              >
                <Play size={16} className="sm:size-[18px]" /> View Our Work
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 animate-slideUp stagger-5">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-2 border-dark" />
                ))}
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/30 border-2 border-dark flex items-center justify-center">
                  <span className="text-[8px] sm:text-[10px] text-white font-bold">2k+</span>
                </div>
              </div>
              <div className="text-[11px] sm:text-sm text-gray-400">
                <span className="text-white font-semibold">2,000+</span> Happy Customers
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-sm text-gray-400">
                <Star size={12} className="sm:size-[14px] text-gold fill-gold" />
                <Star size={12} className="sm:size-[14px] text-gold fill-gold" />
                <Star size={12} className="sm:size-[14px] text-gold fill-gold" />
                <Star size={12} className="sm:size-[14px] text-gold fill-gold" />
                <Star size={12} className="sm:size-[14px] text-gold fill-gold" />
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40 animate-pulse-subtle">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ═══ TRUST BADGES ═══ */}
      <section className="relative -mt-10 z-20">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 lg:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Shield, title: 'Premium Quality', desc: 'Authentic products sourced globally' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free on orders over ৳2,000' },
              { icon: Award, title: 'Installation', desc: 'Professional service available' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return' },
            ].map((f, i) => (
              <div key={f.title} className="flex items-center gap-3 lg:gap-4 group">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <f.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm lg:text-base">{f.title}</h4>
                  <p className="text-xs text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      {categoryList.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <span className="text-primary font-semibold text-[10px] sm:text-sm tracking-widest uppercase">Categories</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 sm:mt-2 mb-2 sm:mb-3">Shop by Collection</h2>
              <p className="text-sm sm:text-base text-muted max-w-xl mx-auto px-4 sm:px-0">Explore our curated categories, each designed to bring a unique character to your space</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
              {categoryList.slice(0, 10).map((cat, i) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat.slug}`}
                  className="group relative bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 card-premium"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="p-5 lg:p-6 text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-300">
                      <span className="text-xl lg:text-2xl font-bold text-primary">{cat.name[0]}</span>
                    </div>
                    <h3 className="font-medium text-sm lg:text-base group-hover:text-primary transition-colors leading-tight">{cat.name}</h3>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      {featuredProducts.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28 bg-white">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 sm:mb-10 lg:mb-14">
              <div>
                <span className="text-primary font-semibold text-[10px] sm:text-sm tracking-widest uppercase">Featured</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 sm:mt-2 mb-2 sm:mb-3">Curated Picks</h2>
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-14 sm:py-20 lg:py-28 bg-gradient-to-b from-bg to-white">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14 lg:mb-18">
            <span className="text-primary font-semibold text-[10px] sm:text-sm tracking-widest uppercase">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 sm:mt-2 mb-2 sm:mb-3">How It Works</h2>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto px-4 sm:px-0">From inspiration to installation — we make it effortless</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

            {[
              { icon: Paintbrush, step: '01', title: 'Choose Design', desc: 'Browse our vast collection and find your perfect style' },
              { icon: Ruler, step: '02', title: 'Calculate & Plan', desc: 'Use our tools to measure and estimate exactly what you need' },
              { icon: ShoppingCart, step: '03', title: 'Order Easy', desc: 'Quick guest checkout with secure payment options' },
              { icon: Truck, step: '04', title: 'Delivered & Done', desc: 'Fast delivery with optional professional installation' },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-5 bg-white rounded-2xl shadow-lg border border-border/50 flex items-center justify-center group-hover:shadow-xl group-hover:border-primary/30 group-hover:-translate-y-1 transition-all duration-300">
                  <item.icon size={32} className="text-primary" />
                </div>
                <span className="text-5xl lg:text-6xl font-black text-primary/5 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none">{item.step}</span>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATISTICS ═══ */}
      <section className="py-14 sm:py-20 lg:py-28 bg-gradient-to-r from-primary to-[#0f4a26] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary-light/10 rounded-full blur-[60px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-40 sm:w-80 h-40 sm:h-80 bg-gold/5 rounded-full blur-[60px] sm:blur-[100px]" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center" ref={statsRef}>
            {[
              { value: '2,000+', label: 'Happy Customers', icon: Users },
              { value: '500+', label: 'Products', icon: Layers },
              { value: '150+', label: 'Projects Done', icon: Building2 },
              { value: '4.9/5', label: 'Customer Rating', icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="w-14 h-14 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all group-hover:scale-110">
                  <stat.icon size={26} className="text-primary-light" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      {newArrivalsList.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-14">
              <div>
                <span className="text-primary font-semibold text-sm tracking-widest uppercase">New</span>
                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-3">Just Landed</h2>
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

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-14 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-primary font-semibold text-sm tracking-widest uppercase">Why Us</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-6">More Than Just Wallpaper</h2>
              <p className="text-muted mb-8 leading-relaxed">
                We don&apos;t just sell wallpaper — we help you transform your space with expert guidance, premium products, and end-to-end service.
              </p>

              <div className="space-y-5">
                {[
                  { icon: Shield, title: '100% Authentic', desc: 'Directly sourced from top global manufacturers' },
                  { icon: Users, title: 'Expert Guidance', desc: 'Professional consultation for your perfect choice' },
                  { icon: Paintbrush, title: 'Installation Service', desc: 'Skilled team for flawless wall finish' },
                  { icon: Heart, title: 'Best Price Promise', desc: 'Premium quality at the most competitive prices' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-semibold mt-8 group">
                Learn More About Us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10 hidden lg:block" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 rounded-2xl -z-10 hidden lg:block" />
              <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 rounded-3xl p-8 lg:p-10 border border-border/50 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Image src="/images/placeholder.svg" alt="Gallery" width={200} height={200} className="w-full h-full object-cover opacity-30" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BEST SELLERS ═══ */}
      {bestSellersList.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-14">
              <div>
                <span className="text-primary font-semibold text-sm tracking-widest uppercase">Popular</span>
                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-3">Best Sellers</h2>
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
          </div>
        </section>
      )}

      {/* ═══ TOOLS SECTION ═══ */}
      <section className="py-14 sm:py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">Tools</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-3">Plan Your Project</h2>
            <p className="text-muted max-w-xl mx-auto">Free tools to help you plan, measure, and budget your wallpaper project</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Ruler, title: 'Wall Area Calculator', desc: 'Measure your walls and get accurate square footage in seconds', href: '/tools/wall-area-calculator', cls: 'from-primary/20 to-primary/5' },
              { icon: Calculator, title: 'Roll Calculator', desc: 'Know exactly how many rolls you need — no waste, no shortage', href: '/tools/roll-calculator', cls: 'from-gold/20 to-gold/5' },
              { icon: Zap, title: 'Quick Quote Request', desc: 'Get a free quote for products and installation', href: '/contact', cls: 'from-primary-light/20 to-primary-light/5' },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className={'group relative bg-gradient-to-br ' + tool.cls + ' rounded-2xl border border-border/60 p-6 lg:p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300 card-premium overflow-hidden'}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <tool.icon size={28} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{tool.desc}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-14 sm:py-20 lg:py-28 bg-gradient-to-b from-bg to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-3">What Our Customers Say</h2>
            <p className="text-muted max-w-xl mx-auto">Real stories from real people who transformed their spaces with us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { name: 'Rafiq Hasan', location: 'Gulshan, Dhaka', rating: 5, text: 'Exceptional quality! The vinyl wallpaper transformed our living room completely. Installation was smooth and the result is stunning.', initials: 'RH' },
              { name: 'Sadia Islam', location: 'Uttara, Dhaka', rating: 5, text: 'I was skeptical about ordering wallpaper online but the team guided me perfectly. The 3D wallpaper in our bedroom looks magical!', initials: 'SI' },
              { name: 'Tariq Ahmed', location: 'Banani, Dhaka', rating: 5, text: 'Professional from start to finish. The consultation helped us pick the perfect design. Highly recommend for anyone renovating.', initials: 'TA' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 lg:p-8 border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group card-premium">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <Quote size={24} className="text-primary/20 mb-3" />
                <p className="text-sm text-gray-600 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">{t.initials}</div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted flex items-center gap-1"><MapPin size={10} />{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">FAQ</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-3">Got Questions?</h2>
            <p className="text-muted">We have answers to the most common questions</p>
          </div>

          <div className="space-y-3">
            {[
              { q: 'How do I know how much wallpaper I need?', a: 'Use our Wall Area Calculator to measure your walls. You can also contact us for a free consultation — our experts will help you calculate the exact quantity.' },
              { q: 'Do you provide installation service?', a: 'Yes! We offer professional wallpaper installation services in Dhaka and surrounding areas. Our skilled team ensures flawless application. Contact us for a quote.' },
              { q: 'What is the delivery time and cost?', a: 'Delivery takes 2-5 business days within Dhaka, 5-7 days for other areas. Free delivery on orders over ৳2,000. Standard charge is ৳100.' },
              { q: 'Can I return or exchange products?', a: 'Yes, we offer a 7-day return policy for unopened products in original packaging. Custom orders and opened rolls are non-returnable.' },
              { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD) and Manual Payment via bKash, Nagad, and Bank Transfer.' },
              { q: 'How do I place an order?', a: 'Simply browse our products, add to cart, and checkout as a guest — no account needed! Enter your details, choose payment, and place the order.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-border/60 overflow-hidden hover:border-primary/20 transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 lg:p-5 text-left font-medium hover:bg-gray-50/50 transition text-sm lg:text-base"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronRight size={16} className={`text-primary shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-90' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="px-4 lg:px-5 pb-4 lg:pb-5 text-sm text-muted leading-relaxed">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-dark to-[#0a2a14]" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary-light/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-10" />

        <div className="container-custom relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-gold" />
              <span className="text-sm text-gray-200">Start Your Transformation Today</span>
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Transform<br />Your Space?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
              Browse our collection, get expert advice, and bring your dream interior to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary-light text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Product Card ─── */
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
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-gold text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-lg">
              -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
            </span>
          )}
          {isBestSeller && (
            <span className="bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-lg flex items-center gap-0.5">
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
          <span className="font-bold text-primary text-sm lg:text-base">{formatCurrency(price)}</span>
          {hasDiscount && (
            <span className="text-[11px] text-muted/60 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
        {/* Color/material indicator */}
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


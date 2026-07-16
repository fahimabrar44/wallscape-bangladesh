'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { Product, Category, Review, Project, Blog } from '@/types';
import {
  ChevronRight, Star, ShoppingCart, ArrowRight, Ruler, Shield,
  Truck, HeadphonesIcon, Layers, Sparkles, Quote, Clock, MapPin,
  Heart, TrendingUp, Hash, Palette, Home, Sofa, Building2, Baby,
  Brush, Trees, Warehouse
} from 'lucide-react';
import 'swiper/css';

/* ═══════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

/* ═══════════════════════════════════════════════
   Category Icons
   ═══════════════════════════════════════════════ */
const categoryIcons: Record<string, React.ReactNode> = {
  'living-room': <Sofa size={24} />,
  'bedroom': <Bed size={24} />,
  'office': <Building2 size={24} />,
  'kids-room': <Baby size={24} />,
  '3d': <Sparkles size={24} />,
  'luxury': <Sparkles size={24} />,
  'kitchen': <Layers size={24} />,
  'bathroom': <Layers size={24} />,
  'restaurant': <Building2 size={24} />,
  'hotel': <Building2 size={24} />,
  'commercial': <Warehouse size={24} />,
  'nature': <Trees size={24} />,
  'abstract': <Brush size={24} />,
  'texture': <Hash size={24} />,
};

function getCategoryIcon(slug?: string) {
  if (!slug) return <Layers size={24} />;
  return categoryIcons[slug] || <Layers size={24} />;
}

/* ═══════════════════════════════════════════════
   Main Homepage
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  const [calcWidth, setCalcWidth] = useState('');
  const [calcHeight, setCalcHeight] = useState('');
  const [rollQty, setRollQty] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const { data: featured } = useQuery({
    queryKey: ['home-featured'], queryFn: () => api.get<{ products: Product[] }>('/api/products/featured'),
  });
  const { data: newArrivals } = useQuery({
    queryKey: ['home-new'], queryFn: () => api.get<{ products: Product[] }>('/api/products/new-arrivals'),
  });
  const { data: bestSellers } = useQuery({
    queryKey: ['home-bestsellers'], queryFn: () => api.get<{ products: Product[] }>('/api/products/best-sellers'),
  });
  const { data: cats } = useQuery({
    queryKey: ['home-categories'], queryFn: () => api.get<{ categories: Category[] }>('/api/categories'),
  });
  const { data: reviews } = useQuery({
    queryKey: ['home-reviews'], queryFn: () => api.get<{ reviews: Review[] }>('/api/reviews'),
  });
  const { data: projects } = useQuery({
    queryKey: ['home-projects'], queryFn: () => api.get<{ projects: Project[] }>('/api/projects?limit=4'),
  });
  const { data: blogs } = useQuery({
    queryKey: ['home-blogs'], queryFn: () => api.get<{ blogs: Blog[] }>('/api/blogs?limit=3'),
  });

  const featuredProducts = featured?.products || [];
  const newArrivalsList = newArrivals?.products || [];
  const bestSellersList = bestSellers?.products || [];
  const categories = (cats?.categories || []).filter((c: Category) => c.isActive).slice(0, 6);
  const testimonialList = (reviews?.reviews || []).filter((r: Review) => r.isApproved).slice(0, 8);
  const projectList = (projects?.projects || []).slice(0, 4);
  const blogList = (blogs?.blogs || []).slice(0, 3);

  // Wallpaper calculator
  const ROLl_COVERAGE = 50; // sq.ft per roll
  const AVG_PRICE = 450; // BDT per sq.ft

  function calculateRolls() {
    const w = parseFloat(calcWidth);
    const h = parseFloat(calcHeight);
    if (!w || !h) return;
    const area = w * h;
    const rolls = Math.ceil(area / ROLl_COVERAGE);
    setRollQty(rolls);
    setTotalCost(rolls * ROLl_COVERAGE * AVG_PRICE);
  }

  const allEmpty = featuredProducts.length === 0 && newArrivalsList.length === 0 && bestSellersList.length === 0;

  if (allEmpty) {
    return (
      <div className="container-custom py-32 text-center">
        <div className="max-w-md mx-auto">
          <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Wallscape Bangladesh</h1>
          <p className="text-muted mb-6">We are curating our collection. Check back soon for premium wallpaper and interior solutions!</p>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══ 1. HERO — CATEGORY DISCOVERY ═══ */}
      <section className="relative pt-4 pb-8 sm:pb-12 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <span className="section-label mb-3 block">Discover</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-[1.08]">
              Transform Your<br />
              <span className="text-gradient">Space</span>
            </h1>
            <p className="text-gray-600 mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
              Explore Bangladesh&apos;s finest collection of premium wallpapers and interior solutions — curated for every room, every style.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            {categories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse skeleton" />
              ))
            ) : (
              categories.map((cat) => (
                <motion.div key={cat._id} variants={itemVariants}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100"
                  >
                    {cat.image ? (
                      <Image
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                        <div className="text-white/30">{getCategoryIcon(cat.slug)}</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-white/70">{getCategoryIcon(cat.slug)}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm sm:text-base leading-tight">{cat.name}</h3>
                      <p className="text-white/60 text-[11px] sm:text-xs mt-0.5">Explore &rarr;</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. FEATURED PRODUCTS ═══ */}
      {featuredProducts.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-10 sm:py-14 lg:py-20"
        >
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Featured</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 sm:mt-2 mb-2">Curated Picks</h2>
                <p className="text-sm sm:text-base text-muted max-w-lg">Handpicked designs that define elegance and style for your interiors</p>
              </div>
              <Link href="/products?sort=featured" className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors mt-4 lg:mt-0 group">
                View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {featuredProducts.slice(0, 10).map((product, i) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 3. TRENDING COLLECTION (Carousel) ═══ */}
      {bestSellersList.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-10 sm:py-14 lg:py-20 bg-white"
        >
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Trending</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 sm:mt-2 mb-2">Best Sellers</h2>
                <p className="text-sm sm:text-base text-muted max-w-lg">Most loved by our customers across Bangladesh</p>
              </div>
              <Link href="/products?sort=best-selling" className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors group">
                View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={16}
                slidesPerView={2}
                navigation
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
                className="!pb-4"
              >
                {bestSellersList.slice(0, 12).map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} isBestSeller />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 4. INTERIOR INSPIRATION ═══ */}
      {categories.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-10 sm:py-14 lg:py-20"
        >
          <div className="container-custom">
            <motion.div variants={fadeIn} className="text-center mb-10 lg:mb-14">
              <span className="section-label mb-3 block justify-center">Inspiration</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">Interior Inspiration</h2>
              <p className="text-muted max-w-lg mx-auto">See how our wallpapers transform real spaces</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            >
              {categories.slice(0, 4).map((cat) => (
                <motion.div key={cat._id} variants={itemVariants}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100"
                  >
                    {cat.image ? (
                      <Image
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2.5 text-white">
                        {getCategoryIcon(cat.slug)}
                      </div>
                      <h3 className="text-white font-semibold text-base sm:text-lg">{cat.name}</h3>
                      <p className="text-white/70 text-xs sm:text-sm mt-0.5">View ideas &rarr;</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 5. WALLPAPER CALCULATOR ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="py-12 sm:py-16 lg:py-24"
      >
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-grid-white opacity-[0.04]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

            <div className="relative z-10 p-6 sm:p-10 lg:p-14 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <motion.div variants={fadeIn}>
                <span className="section-label text-gold/80 mb-3 block">Calculator</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Find The Perfect Amount Of Wallpaper For Your Wall
                </h2>
                <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed max-w-md">
                  Measure your wall and get an instant estimate of required rolls and total cost — no maths required.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Wall Width (ft)</label>
                    <input
                      type="number"
                      value={calcWidth}
                      onChange={(e) => setCalcWidth(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Wall Height (ft)</label>
                    <input
                      type="number"
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(e.target.value)}
                      placeholder="e.g. 9"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateRolls}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gold text-gray-900 font-semibold rounded-xl hover:bg-gold-light transition text-sm"
                >
                  <Ruler size={16} /> Calculate
                </button>

                {rollQty !== null && totalCost !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-6 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-400">Rolls Required</p>
                        <p className="text-xl font-bold text-white">{rollQty} rolls</p>
                      </div>
                      <div className="w-px h-8 bg-white/10 hidden sm:block" />
                      <div>
                        <p className="text-xs text-gray-400">Estimated Cost</p>
                        <p className="text-xl font-bold text-gold">{formatCurrency(totalCost)}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10 hidden sm:block" />
                      <Link href="/products" className="text-xs text-gold hover:underline font-medium">
                        Browse wallpapers &rarr;
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={fadeIn} className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="w-56 h-72 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/10 flex items-center justify-center">
                    <Ruler size={64} className="text-gold/40" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-gray-800 border border-white/5 flex items-center justify-center text-white/40">
                    <Hash size={32} />
                  </div>
                  <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/10 text-xs text-gold">
                    Free calculation
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 6. BEFORE & AFTER ═══ */}
      {projectList.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-10 sm:py-14 lg:py-20 bg-white"
        >
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Portfolio</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 sm:mt-2 mb-2">Before & After</h2>
                <p className="text-sm sm:text-base text-muted max-w-lg">Real transformations from our projects across Bangladesh</p>
              </div>
              <Link href="/projects" className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors mt-4 lg:mt-0 group">
                View All Projects <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {projectList.map((project) => (
                <motion.div key={project._id} variants={itemVariants}>
                  <div className="group relative rounded-2xl overflow-hidden bg-gray-100">
                    {project.images && project.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5">
                        {project.images.slice(0, 2).map((img, idx) => (
                          <div key={idx} className="relative aspect-square sm:aspect-[4/3]">
                            <Image
                              src={getImageUrl(img)}
                              alt={idx === 0 ? `${project.title} before` : `${project.title} after`}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                              sizes="50vw"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-sm">
                              {idx === 0 ? 'Before' : 'After'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-[2/1] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Layers size={32} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-4 sm:p-5">
                      <h3 className="text-white font-semibold text-sm sm:text-base">{project.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                        <span className="flex items-center gap-1"><MapPin size={10} />{project.location || 'Bangladesh'}</span>
                        {project.category && <span className="flex items-center gap-1"><Layers size={10} />{project.category}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-8 lg:hidden">
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors">
                View All Projects <ChevronRight size={14} />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 7. CUSTOMER TRUST ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="py-12 sm:py-16 lg:py-20"
      >
        <div className="container-custom">
          <motion.div variants={fadeIn} className="text-center mb-10 lg:mb-14">
            <span className="section-label mb-3 block justify-center">Why Choose Us</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">The Wallscape Advantage</h2>
            <p className="text-muted max-w-lg mx-auto">We make your interior transformation seamless and stress-free</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6"
          >
            {[
              { icon: Shield, title: 'Premium Quality', desc: 'Imported wallpapers with the finest materials and finishes' },
              { icon: Ruler, title: 'Professional Installation', desc: 'Expert installers for a flawless finish every time' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free delivery across Bangladesh for orders over 5,000 BDT' },
              { icon: HeadphonesIcon, title: 'Expert Support', desc: 'Get advice from our interior design specialists' },
              { icon: Layers, title: 'Easy Measurement', desc: 'Use our calculator to find the perfect quantity' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/60 hover:border-gold/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3.5 group-hover:bg-gold/10 transition-colors">
                  <item.icon size={22} className="text-gray-700 group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">{item.title}</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ 8. CUSTOMER REVIEWS ═══ */}
      {testimonialList.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-10 sm:py-14 lg:py-20 bg-white"
        >
          <div className="container-custom">
            <motion.div variants={fadeIn} className="text-center mb-8 lg:mb-12">
              <span className="section-label mb-3 block justify-center">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">What Our Customers Say</h2>
              <p className="text-muted max-w-lg mx-auto">Real reviews from real customers across Bangladesh</p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                className="!pb-4"
              >
                {testimonialList.map((review) => {
                  const initials = (review.customerName || review.name || '?')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <SwiperSlide key={review._id}>
                      <div className="p-6 sm:p-7 rounded-2xl bg-gray-50 border border-gray-100 h-full flex flex-col">
                        <div className="flex items-center gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-300'} />
                          ))}
                        </div>
                        <Quote size={18} className="text-gray-300 mb-2 shrink-0" />
                        <p className="text-sm text-gray-700 leading-relaxed flex-1 line-clamp-4">
                          &ldquo;{review.review || review.text || ''}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{review.customerName || review.name || 'Customer'}</p>
                            {review.location && <p className="text-xs text-muted">{review.location}</p>}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-8">
              <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors group">
                Read All Reviews <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 9. BLOG / GUIDE ═══ */}
      {blogList.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-10 sm:py-14 lg:py-20"
        >
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Guides</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 sm:mt-2 mb-2">Interior Design Guides</h2>
                <p className="text-sm sm:text-base text-muted max-w-lg">Tips, trends, and inspiration for your home</p>
              </div>
              <Link href="/blogs" className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors mt-4 lg:mt-0 group">
                View All Articles <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {blogList.map((blog) => (
                <motion.div key={blog._id} variants={itemVariants}>
                  <Link href={`/blogs/${blog.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-gray-200/60 hover:border-gold/20 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      {blog.image ? (
                        <Image src={getImageUrl(blog.image)} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <Layers size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs text-muted mb-2">
                        <span className="flex items-center gap-1"><Clock size={10} />{new Date(blog.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {blog.author && <><span>&middot;</span><span>{blog.author}</span></>}
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-gold transition-colors">{blog.title}</h3>
                      {blog.excerpt && <p className="text-xs sm:text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>}
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-900 group-hover:text-gold transition-colors mt-3">
                        Read More <ChevronRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-8 lg:hidden">
              <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gold transition-colors">
                View All Articles <ChevronRight size={14} />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-xl mx-auto">
              <Sparkles size={32} className="mx-auto text-gold/60 mb-4" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Ready to Transform Your Space?
              </h2>
              <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Browse our curated collection of premium wallpapers or book a consultation with our interior experts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-gray-900 font-semibold rounded-xl hover:bg-gold-light transition text-sm w-full sm:w-auto justify-center">
                  Browse Collection <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition text-sm w-full sm:w-auto justify-center border border-white/10">
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Product Card
   ═══════════════════════════════════════════════ */
function ProductCard({ product, isBestSeller, index = 0 }: { product: Product; isBestSeller?: boolean; index?: number }) {
  const imgSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/images/placeholder.svg';
  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const outOfStock = product.stock <= 0;
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="group relative">
      <Link
        href={`/products/${product.slug}`}
        className="block bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-gold/20 hover:shadow-xl transition-all duration-500"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="badge-gold text-[10px] px-1.5 py-0.5">
                -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
              </span>
            )}
            {isBestSeller && (
              <span className="badge-primary flex items-center gap-0.5 text-[10px] px-1.5 py-0.5">
                <TrendingUp size={9} /> Best Seller
              </span>
            )}
          </div>

          {/* Out of stock */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-gray-900 font-semibold px-4 py-1.5 rounded-lg text-xs shadow-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-[10px] text-gray-400 mb-0.5 font-mono">{product.productCode}</p>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          {/* Material + Pattern */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
            {product.material && <span>{product.material}</span>}
            {product.pattern && <><span>&middot;</span><span>{product.pattern}</span></>}
          </div>

          {/* Color swatch */}
          {product.color && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: product.color.toLowerCase() }} />
              <span className="text-[10px] text-gray-400">{product.color}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-sm text-gray-900">
              {formatCurrency(price)}
            </span>
            {product.discountPrice && hasDiscount && (
              <span className="text-[11px] text-gray-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Rating */}
          {product.totalSold > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star size={10} className="text-gold fill-gold" />
              <span className="text-[10px] text-gray-400">({product.totalSold} sold)</span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition z-10 shadow-sm"
      >
        <Heart
          size={13}
          className={wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500'}
        />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Bed Icon (lucide doesn't have one natively)
   ═══════════════════════════════════════════════ */
function Bed({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
      <path d="M10 8v3" /><path d="M14 8v3" /><path d="M18 8v3" /><path d="M2 12h20" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Warehouse Icon (lucide doesn't have it)
   ═══════════════════════════════════════════════ */
function WarehouseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8L12 3L3 8" /><path d="M3 8v13h18V8" /><path d="M7 12h2" /><path d="M7 16h2" /><path d="M15 12h2" /><path d="M15 16h2" /><path d="M11 12h2" /><path d="M11 16h2" />
    </svg>
  );
}

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
import { useCart } from '@/providers/cart-provider';
import type { Product, Category, Review, Project, Blog } from '@/types';
import toast from 'react-hot-toast';
import {
  ChevronRight, Star, ShoppingCart, ArrowRight, Ruler, Shield,
  Truck, HeadphonesIcon, Layers, Sparkles, Quote, Clock, MapPin,
  Heart, TrendingUp, Sofa, Hash, Palette, Brush, Building2,
  Search, SlidersHorizontal, X, Check, Minus, Plus,
  Camera, RotateCcw, Package, Award, Wifi,
} from 'lucide-react';
import 'swiper/css';

/* ═══════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════ */
const easeOut = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

/* ═══════════════════════════════════════════════
   Category Icons Map
   ═══════════════════════════════════════════════ */
const catIcons: Record<string, React.ReactNode> = {
  'living-room': <Sofa size={20} />, 'bedroom': <BedIcon size={20} />,
  'office': <Building2 size={20} />, 'kids-room': <Sparkles size={20} />,
  '3d': <Layers size={20} />, 'luxury': <Sparkles size={20} />,
  'kitchen': <Layers size={20} />, 'restaurant': <Building2 size={20} />,
  'hotel': <Building2 size={20} />, 'commercial': <Package size={20} />,
};

function getCatIcon(slug?: string) {
  return (slug && catIcons[slug]) || <Layers size={20} />;
}

/* ═══════════════════════════════════════════════
   MAIN HOMEPAGE
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  // Calculator state
  const [calcW, setCalcW] = useState('');
  const [calcH, setCalcH] = useState('');
  const [rolls, setRolls] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);

  // Queries
  const { data: cats } = useQuery({
    queryKey: ['hp-cats'], queryFn: () => api.get<{ categories: Category[] }>('/api/categories'),
  });
  const { data: featured } = useQuery({
    queryKey: ['hp-featured'], queryFn: () => api.get<{ products: Product[] }>('/api/products/featured'),
  });
  const { data: best } = useQuery({
    queryKey: ['hp-best'], queryFn: () => api.get<{ products: Product[] }>('/api/products/best-sellers'),
  });
  const { data: reviews } = useQuery({
    queryKey: ['hp-reviews'], queryFn: () => api.get<{ reviews: Review[] }>('/api/reviews'),
  });
  const { data: projects } = useQuery({
    queryKey: ['hp-projects'], queryFn: () => api.get<{ projects: Project[] }>('/api/projects?limit=4'),
  });
  const { data: blogs } = useQuery({
    queryKey: ['hp-blogs'], queryFn: () => api.get<{ blogs: Blog[] }>('/api/blogs?limit=3'),
  });

  const categories = (cats?.categories || []).filter((c: Category) => c.isActive).slice(0, 8);
  const featuredProducts = featured?.products || [];
  const bestSellers = best?.products || [];
  const testimonialList = (reviews?.reviews || []).filter((r: Review) => r.isApproved).slice(0, 8);
  const projectList = (projects?.projects || []).slice(0, 4);
  const blogList = (blogs?.blogs || []).slice(0, 3);

  const COV = 50; const AVG = 450;
  function calcRolls() {
    const w = parseFloat(calcW); const h = parseFloat(calcH);
    if (!w || !h) return;
    const r = Math.ceil((w * h) / COV);
    setRolls(r); setCost(r * COV * AVG);
  }

  return (
    <>
      {/* ═══ 1. CATEGORY DISCOVERY ═══ */}
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-12 lg:pb-16">
        <div className="container-custom">
          <motion.div initial="hidden" animate="visible" className="mb-8 sm:mb-10 lg:mb-12">
            <span className="section-label mb-3 block">Discover</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-[1.08]">
              Transform Your<br /><span className="text-gradient">Space</span>
            </h1>
            <p className="text-muted mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              Explore Bangladesh&apos;s finest collection of premium wallpapers — curated for every room, every style, every dream.
            </p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[6/7] rounded-2xl bg-gray-200 animate-pulse skeleton" />
                ))
              : categories.map((cat) => (
                  <motion.div key={cat._id} variants={itemVariants}>
                    <Link href={`/categories/${cat.slug}`} className="group relative block aspect-[6/7] rounded-2xl overflow-hidden bg-gray-100">
                      {cat.image ? (
                        <Image src={getImageUrl(cat.image)} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 640px) 50vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
                          <div className="text-white/20">{getCatIcon(cat.slug)}</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-primary-light/80">{getCatIcon(cat.slug)}</span>
                        </div>
                        <h3 className="text-white font-semibold text-sm sm:text-base leading-tight font-heading">{cat.name}</h3>
                        <p className="text-white/50 text-xs mt-0.5">Explore Collection &rarr;</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. FEATURED COLLECTIONS ═══ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-10 sm:py-14 lg:py-20 bg-white">
        <div className="container-custom">
          <motion.div variants={fadeIn} className="text-center mb-10 lg:mb-14">
            <span className="section-label mb-3 block justify-center">Collections</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">Featured Collections</h2>
            <p className="text-muted max-w-xl mx-auto">Curated wallpaper collections designed to inspire your next interior transformation</p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Modern Collection', desc: 'Clean contemporary designs', slug: 'modern' },
              { name: 'Luxury Collection', desc: 'Opulent gold and silk finishes', slug: 'luxury' },
              { name: 'Minimal Collection', desc: 'Subtle textures & tones', slug: 'minimal' },
              { name: 'Nature Collection', desc: 'Botanical & organic patterns', slug: 'nature' },
              { name: 'Classic Collection', desc: 'Timeless traditional elegance', slug: 'classic' },
            ].map((col, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link href={`/products?tag=${col.slug}`} className="group block relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-dark flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-14 h-0.5 bg-primary-light mx-auto mb-4 opacity-60" />
                      <h3 className="text-white font-bold text-lg sm:text-xl font-heading">{col.name}</h3>
                      <p className="text-white/60 text-xs sm:text-sm mt-2">{col.desc}</p>
                      <span className="inline-block mt-4 text-xs font-medium text-primary-light border border-primary-light/30 rounded-full px-4 py-1.5 group-hover:bg-primary-light group-hover:text-white transition">View Collection</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ 3. TRENDING PRODUCTS ═══ */}
      {bestSellers.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-10 sm:py-14 lg:py-20">
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Trending</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">Best Sellers</h2>
                <p className="text-muted max-w-lg">Most loved wallpapers by our customers across Bangladesh</p>
              </div>
              <Link href="/products?sort=best-selling" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors mt-4 sm:mt-0">
                View All <ChevronRight size={14} />
              </Link>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Swiper modules={[Autoplay, Navigation]} spaceBetween={16} slidesPerView={2} autoplay={{ delay: 5000, disableOnInteraction: false }}
                navigation breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }} className="!pb-4">
                {bestSellers.map((p) => (
                  <SwiperSlide key={p._id}><ProductCard product={p} isBestSeller /></SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 4. WALLPAPER CALCULATOR ═══ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-12 sm:py-16 lg:py-24">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden bg-primary-dark">
            <div className="absolute inset-0 bg-grid-white opacity-[0.04]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-light/5 rounded-full blur-3xl" />

            <div className="relative z-10 p-6 sm:p-10 lg:p-14 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <motion.div variants={fadeIn}>
                <span className="section-label text-primary-light/80 mb-3 block">Calculator</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight font-heading">Calculate Your Wallpaper Requirement</h2>
                <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed max-w-md">Measure your wall and get an instant estimate — no maths required.</p>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Wall Width (ft)</label>
                    <input type="number" value={calcW} onChange={(e) => setCalcW(e.target.value)} placeholder="e.g. 12"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary-light/50 transition" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Wall Height (ft)</label>
                    <input type="number" value={calcH} onChange={(e) => setCalcH(e.target.value)} placeholder="e.g. 9"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary-light/50 transition" />
                  </div>
                </div>

                <button onClick={calcRolls} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-light text-white font-semibold rounded-xl hover:bg-primary transition text-sm">
                  <Ruler size={16} /> Calculate Now
                </button>

                {rolls !== null && cost !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-6 flex-wrap">
                      <div><p className="text-xs text-gray-400">Rolls Required</p><p className="text-xl font-bold text-white">{rolls} rolls</p></div>
                      <div className="w-px h-8 bg-white/10 hidden sm:block" />
                      <div><p className="text-xs text-gray-400">Wall Area</p><p className="text-xl font-bold text-white">{parseFloat(calcW) * parseFloat(calcH)} sq.ft</p></div>
                      <div className="w-px h-8 bg-white/10 hidden sm:block" />
                      <div><p className="text-xs text-gray-400">Estimated Cost</p><p className="text-xl font-bold text-primary-light">{formatCurrency(cost)}</p></div>
                    </div>
                    <Link href="/products" className="inline-flex items-center gap-1 text-xs text-primary-light hover:underline font-medium mt-3">Browse wallpapers &rarr;</Link>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={fadeIn} className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="w-56 h-72 rounded-2xl bg-gradient-to-br from-primary-light/20 to-primary-light/5 border border-primary-light/10 flex items-center justify-center">
                    <Ruler size={56} className="text-primary-light/40" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-primary/60 border border-white/5 flex items-center justify-center text-primary-light/50"><Hash size={28} /></div>
                  <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-lg bg-primary-light/10 border border-primary-light/10 text-xs text-primary-light">Free tool</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 6. BEFORE & AFTER ═══ */}
      {projectList.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-10 sm:py-14 lg:py-20 bg-white">
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Portfolio</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">Before & After</h2>
                <p className="text-muted max-w-lg">Real transformations from our projects across Bangladesh</p>
              </div>
              <Link href="/projects" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors mt-4 sm:mt-0">View All <ChevronRight size={14} /></Link>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {projectList.map((p) => (
                <motion.div key={p._id} variants={itemVariants}>
                  <div className="group relative rounded-2xl overflow-hidden bg-gray-100">
                    {p.images && p.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5">
                        {p.images.slice(0, 2).map((img, idx) => (
                          <div key={idx} className="relative aspect-square sm:aspect-[4/3]">
                            <Image src={getImageUrl(img)} alt={idx === 0 ? `${p.title} before` : `${p.title} after`} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" sizes="50vw" />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-sm">{idx === 0 ? 'Before' : 'After'}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-[2/1] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"><Layers size={32} className="text-gray-400" /></div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-4 sm:p-5">
                      <h3 className="text-white font-semibold text-sm sm:text-base font-heading">{p.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                        {p.location && <span className="flex items-center gap-1"><MapPin size={10} />{p.location}</span>}
                        {p.category && <span className="flex items-center gap-1"><Layers size={10} />{p.category}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-8 sm:hidden">
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors">View All Projects <ChevronRight size={14} /></Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 7. WHY CHOOSE WALLSCAPE ═══ */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          <motion.div variants={fadeIn} className="text-center mb-10 lg:mb-14">
            <span className="section-label mb-3 block justify-center">Why Wallscape</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">Why Choose Wallscape?</h2>
            <p className="text-muted max-w-xl mx-auto">We make your interior transformation seamless and stress-free</p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Imported wallpapers with finest materials and finishes' },
              { icon: Shield, title: 'Professional Installation', desc: 'Expert installers for a flawless finish every time' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free delivery across Bangladesh for orders over 5,000 BDT' },
              { icon: HeadphonesIcon, title: 'Expert Support', desc: 'Get advice from our interior design specialists' },
              { icon: Ruler, title: 'Custom Design Service', desc: 'Bespoke wallpaper solutions tailored to your vision' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center p-5 sm:p-6 rounded-2xl bg-white border border-border hover:border-primary/10 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3.5 group-hover:bg-primary/10 transition-colors">
                  <item.icon size={22} className="text-gray-600 group-hover:text-primary transition-colors" />
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
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-10 sm:py-14 lg:py-20 bg-white">
          <div className="container-custom">
            <motion.div variants={fadeIn} className="text-center mb-8 lg:mb-12">
              <span className="section-label mb-3 block justify-center">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">What Our Customers Say</h2>
              <p className="text-muted max-w-xl mx-auto">Real reviews from real customers across Bangladesh</p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Swiper modules={[Autoplay]} spaceBetween={20} slidesPerView={1} autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!pb-4">
                {testimonialList.map((r) => {
                  const initials = (r.customerName || r.name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <SwiperSlide key={r._id}>
                      <div className="p-6 sm:p-7 rounded-2xl bg-gray-50 border border-gray-100 h-full flex flex-col">
                        <div className="flex items-center gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={14} className={i < r.rating ? 'text-primary-light fill-primary-light' : 'text-gray-300'} />))}
                        </div>
                        <Quote size={18} className="text-gray-300 mb-2 shrink-0" />
                        <p className="text-sm text-gray-700 leading-relaxed flex-1 line-clamp-4">&ldquo;{r.review || r.text || ''}&rdquo;</p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{r.customerName || r.name || 'Customer'}</p>
                            {r.location && <p className="text-xs text-muted">{r.location}</p>}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-8">
              <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors">Read All Reviews <ChevronRight size={14} /></Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══ 9. BLOG SECTION ═══ */}
      {blogList.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-10 sm:py-14 lg:py-20">
          <div className="container-custom">
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 lg:mb-12">
              <div>
                <span className="section-label">Guides</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2">Interior Design Guides</h2>
                <p className="text-muted max-w-lg">Tips, trends, and inspiration for your home</p>
              </div>
              <Link href="/blogs" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors mt-4 sm:mt-0">View All <ChevronRight size={14} /></Link>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {blogList.map((blog) => (
                <motion.div key={blog._id} variants={itemVariants}>
                  <Link href={`/blogs/${blog.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      {blog.image ? (
                        <Image src={getImageUrl(blog.image)} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"><Layers size={32} className="text-gray-400" /></div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs text-muted mb-2">
                        <span className="flex items-center gap-1"><Clock size={10} />{new Date(blog.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {blog.author && <><span>&middot;</span><span>{blog.author}</span></>}
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                      {blog.excerpt && <p className="text-xs sm:text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>}
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary group-hover:text-primary-light transition-colors mt-3">Read More <ChevronRight size={12} /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-8 sm:hidden">
              <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors">View All <ChevronRight size={14} /></Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* FINAL CTA */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl mx-auto">
              <Sparkles size={32} className="mx-auto text-primary-light/60 mb-4" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight font-heading">Ready to Transform Your Space?</h2>
              <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-md mx-auto leading-relaxed">Browse our curated collection of premium wallpapers or book a consultation with our interior experts.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-light text-white font-semibold rounded-xl hover:bg-primary hover:shadow-lg transition text-sm w-full sm:w-auto justify-center">
                  Browse Collection <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition text-sm w-full sm:w-auto justify-center border border-white/10">
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ProductCard Component
   ═══════════════════════════════════════════════ */
function ProductCard({ product, isBestSeller }: { product: Product; isBestSeller?: boolean }) {
  const imgSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/images/placeholder.svg';
  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const outOfStock = product.stock <= 0;
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    toast.success(`"${product.name}" added to cart`);
  }

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/20 hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && <span className="badge-accent text-[10px]">-{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%</span>}
            {isBestSeller && <span className="badge-primary flex items-center gap-0.5 text-[10px]"><TrendingUp size={9} /> Best Seller</span>}
          </div>

          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-gray-900 font-semibold px-4 py-1.5 rounded-lg text-xs shadow-lg">Out of Stock</span>
            </div>
          )}

          <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span onClick={handleAddToCart} className="flex-1 text-center text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-white transition">
              <ShoppingCart size={14} className="inline mr-1" />Add to Cart
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <p className="text-[10px] text-gray-400 mb-0.5 font-mono">{product.productCode}</p>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
            {product.material && <span>{product.material}</span>}
            {product.pattern && <><span>&middot;</span><span>{product.pattern}</span></>}
          </div>
          {product.color && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: product.color.toLowerCase() }} />
              <span className="text-[10px] text-gray-400">{product.color}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="price-current text-sm">{formatCurrency(price)}<span className="text-[10px] font-normal text-gray-400">/sq.ft</span></span>
            {hasDiscount && <span className="price-original text-[11px]">{formatCurrency(product.price)}</span>}
          </div>
          {product.totalSold > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star size={10} className="text-primary-light fill-primary-light" /><span className="text-[10px] text-gray-400">({product.totalSold} sold)</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Bed Icon (SVG inline)
   ═══════════════════════════════════════════════ */
function BedIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
      <path d="M10 8v3" /><path d="M14 8v3" /><path d="M18 8v3" /><path d="M2 12h20" />
    </svg>
  );
}

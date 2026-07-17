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
  TrendingUp, Hash, Award, Package, RotateCcw,
} from 'lucide-react';
import 'swiper/css';

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function HomeClient({ initialProducts }: { initialProducts: { bestSellers: Product[]; categories: Category[]; reviews: Review[]; projects: Project[]; blogs: Blog[]; featuredProducts: Product[]; newArrivals: Product[] } }) {
  const { data: bp } = useQuery({ queryKey: ['best-sellers'], queryFn: () => api.get<{ products: Product[] }>('/api/products/best-sellers'), initialData: { products: initialProducts.bestSellers } });
  const { data: cp } = useQuery({ queryKey: ['categories'], queryFn: () => api.get<{ categories: Category[] }>('/api/categories?isActive=true'), initialData: { categories: initialProducts.categories } });
  const { data: rv } = useQuery({ queryKey: ['reviews'], queryFn: () => api.get<{ reviews: Review[] }>('/api/reviews?isApproved=true'), initialData: { reviews: initialProducts.reviews } });
  const { data: pp } = useQuery({ queryKey: ['projects'], queryFn: () => api.get<{ projects: Project[] }>('/api/projects?isPublished=true'), initialData: { projects: initialProducts.projects } });
  const { data: bl } = useQuery({ queryKey: ['blogs'], queryFn: () => api.get<{ blogs: Blog[] }>('/api/blogs?isPublished=true'), initialData: { blogs: initialProducts.blogs } });
  const { data: fp } = useQuery({ queryKey: ['featured-products'], queryFn: () => api.get<{ products: Product[] }>('/api/products/featured'), initialData: { products: initialProducts.featuredProducts } });
  const { data: na } = useQuery({ queryKey: ['new-arrivals'], queryFn: () => api.get<{ products: Product[] }>('/api/products/new-arrivals'), initialData: { products: initialProducts.newArrivals } });

  const bestSellers = bp?.products || [];
  const categories = cp?.categories || [];
  const reviews = rv?.reviews || [];
  const projects = pp?.projects || [];
  const blogs = bl?.blogs || [];
  const featuredProducts = fp?.products || [];
  const newArrivals = na?.products || [];

  const [calcW, setCalcW] = useState('');
  const [calcH, setCalcH] = useState('');
  const [rolls, setRolls] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);
  const calcRolls = () => { const w = parseFloat(calcW); const h = parseFloat(calcH); if (w && h) { const sqft = w * h; const r = Math.ceil(sqft / 28.5); setRolls(r); setCost(r * 450); } };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-light/5 rounded-full blur-[150px]" />
        <div className="container-custom relative z-10 py-20">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-2xl">
            <motion.span variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 text-primary-light px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} /> Premium Wallpaper &amp; Interior Solutions
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight font-heading">
              Transform Your <span className="text-primary-light">Space</span> with Wallscape
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-300 text-sm sm:text-lg mt-4 leading-relaxed max-w-lg">
              Bangladesh&apos;s premium destination for luxury wallpaper, 3D wall panels, and interior design solutions.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-8">
              <Link href="/products" className="bg-primary-light text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary transition shadow-xl shadow-primary-light/20 inline-flex items-center gap-2">Explore Collection <ChevronRight size={18} /></Link>
              <Link href="/contact" className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition backdrop-blur-sm inline-flex items-center gap-2"><HeadphonesIcon size={18} /> Get a Consultation</Link>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center gap-6 mt-10 text-sm text-gray-400">
              <span className="flex items-center gap-2"><Truck size={16} className="text-primary-light" /> Free Delivery*</span>
              <span className="flex items-center gap-2"><Shield size={16} className="text-primary-light" /> Quality Assured</span>
              <span className="flex items-center gap-2"><RotateCcw size={16} className="text-primary-light" /> 7-Day Returns</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-10 sm:py-14 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div><span className="section-label mb-1 block">Categories</span><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">Browse by Category</h2></div>
              <Link href="/products" className="text-sm text-primary font-medium hover:underline hidden sm:inline-flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => (
                <motion.div key={cat._id} variants={itemVariants}>
                  <Link href={`/categories/${cat.slug}`} className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-gray-50 border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-white/20 transition">
                      <Hash size={22} className="text-primary group-hover:text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="py-10 sm:py-14 lg:py-20 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div><span className="section-label mb-1 block">Featured Collection</span><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">Curated for You</h2></div>
              <Link href="/products" className="text-sm text-primary font-medium hover:underline hidden sm:inline-flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <Swiper modules={[Navigation]} spaceBetween={16} slidesPerView={2} navigation breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} className="!pb-4">
              {featuredProducts.map((p) => (<SwiperSlide key={p._id}><ProductCard product={p} /></SwiperSlide>))}
            </Swiper>
          </div>
        </motion.section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="py-10 sm:py-14 lg:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div><span className="section-label mb-1 block">New Arrivals</span><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">Just Landed</h2></div>
              <Link href="/products?sort=newest" className="text-sm text-primary font-medium hover:underline hidden sm:inline-flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {newArrivals.slice(0, 4).map((p) => (<ProductCard key={p._id} product={p} />))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="py-10 sm:py-14 lg:py-20 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div><span className="section-label mb-1 block">Best Sellers</span><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">Most Loved Wallpapers</h2></div>
              <Link href="/products?sort=best-selling" className="text-sm text-primary font-medium hover:underline hidden sm:inline-flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <Swiper modules={[Navigation]} spaceBetween={16} slidesPerView={2} navigation breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }} className="!pb-4">
              {bestSellers.map((p) => (<SwiperSlide key={p._id}><ProductCard product={p} /></SwiperSlide>))}
            </Swiper>
          </div>
        </motion.section>
      )}

      {/* Calculator */}
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
                    <input type="number" value={calcW} onChange={(e) => setCalcW(e.target.value)} placeholder="e.g. 12" className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary-light/50 transition" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">Wall Height (ft)</label>
                    <input type="number" value={calcH} onChange={(e) => setCalcH(e.target.value)} placeholder="e.g. 9" className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary-light/50 transition" />
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
                  </motion.div>
                )}
              </motion.div>
              <motion.div variants={fadeIn} className="hidden lg:flex items-center justify-center">
                <div className="w-64 h-64 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Ruler size={80} className="text-primary-light/30" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Us */}
      <section className="py-10 sm:py-14 lg:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10 lg:mb-14">
            <span className="section-label mb-3 block justify-center">Why Choose Us</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2 font-heading">Why WALLSCAPE Bangladesh?</h2>
            <p className="text-muted max-w-xl mx-auto">We bring global trends to your doorstep with premium quality and unmatched service.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Curated from top global brands with stringent quality checks.' },
              { icon: Package, title: 'Vast Collection', desc: '500+ designs across PVC, vinyl, non-woven, and 3D panels.' },
              { icon: Truck, title: 'Free Delivery', desc: 'Free shipping across Bangladesh for orders over BDT 5,000.' },
              { icon: HeadphonesIcon, title: 'Expert Support', desc: 'Free consultation and professional installation available.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="card-modern p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-10 sm:py-14 lg:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-10 lg:mb-14">
              <span className="section-label mb-3 block justify-center">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2 font-heading">What Our Customers Say</h2>
            </div>
            <Swiper modules={[Autoplay]} spaceBetween={24} slidesPerView={1} autoplay={{ delay: 4000 }} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!pb-4">
              {reviews.slice(0, 9).map((r) => (
                <SwiperSlide key={r._id}>
                  <div className="card-modern p-6 lg:p-8 h-full">
                    <Quote size={24} className="text-primary/10 mb-3" />
                    <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-4">&ldquo;{r.review}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">{r.customerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</div>
                      <div>
                        <p className="font-semibold text-sm">{r.customerName}</p>
                        <div className="flex gap-0.5 mt-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={11} className={i < r.rating ? 'text-primary-light fill-primary-light' : 'text-gray-200'} />))}</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-10 sm:py-14 lg:py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-10 lg:mb-14">
              <span className="section-label mb-3 block justify-center">Our Work</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1.5 mb-2 font-heading">Recent Projects</h2>
              <p className="text-muted max-w-xl mx-auto">See how we&apos;ve transformed spaces across Bangladesh</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {projects.slice(0, 4).map((proj) => (
                <motion.div key={proj._id} variants={itemVariants} className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src={getImageUrl(proj.images?.[0] || '')} alt={proj.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[10px] text-primary-light font-medium bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{proj.category}</span>
                    <h3 className="text-white font-semibold text-sm mt-1.5">{proj.title}</h3>
                    {proj.location && <p className="text-xs text-gray-300 flex items-center gap-1 mt-1"><MapPin size={10} />{proj.location}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Blogs */}
      {blogs.length > 0 && (
        <section className="py-10 sm:py-14 lg:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div><span className="section-label mb-1 block">From Our Blog</span><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">Tips &amp; Inspiration</h2></div>
              <Link href="/blogs" className="text-sm text-primary font-medium hover:underline hidden sm:inline-flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, 3).map((blog) => (
                <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group card-modern overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={getImageUrl(blog.image || '')} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted mb-2"><span className="flex items-center gap-1"><Clock size={12} />{new Date(blog.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-muted line-clamp-2">{blog.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ProductCard({ product, isBestSeller }: { product: Product; isBestSeller?: boolean }) {
  const imgSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/images/placeholder.svg';
  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const outOfStock = product.stock <= 0;
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) { e.preventDefault(); e.stopPropagation(); if (outOfStock) return; addItem(product); toast.success(`"${product.name}" added to cart`); }

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
          {outOfStock && (<div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-white text-gray-900 font-semibold px-4 py-1.5 rounded-lg text-xs shadow-lg">Out of Stock</span></div>)}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span onClick={handleAddToCart} className="block w-full text-center text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-white transition">
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
          {product.color && (<div className="flex items-center gap-1.5 mt-1.5"><span className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: product.color.toLowerCase() }} /><span className="text-[10px] text-gray-400">{product.color}</span></div>)}
          <div className="flex items-center gap-2 mt-2">
            <span className="price-current text-sm">{formatCurrency(price)}<span className="text-[10px] font-normal text-gray-400">/sq.ft</span></span>
            {hasDiscount && <span className="price-original text-[11px]">{formatCurrency(product.price)}</span>}
          </div>
          {product.totalSold > 0 && (<div className="flex items-center gap-1 mt-1.5"><Star size={10} className="text-primary-light fill-primary-light" /><span className="text-[10px] text-gray-400">({product.totalSold} sold)</span></div>)}
        </div>
      </Link>
    </div>
  );
}

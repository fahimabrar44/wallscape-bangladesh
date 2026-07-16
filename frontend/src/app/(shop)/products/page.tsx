'use client';

import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { Product, Category, Pagination } from '@/types';
import { SlidersHorizontal, Search, Star, X, Heart, TrendingUp, ShoppingCart } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'name', label: 'Name' },
];

const materialOptions = ['PVC', 'Vinyl', 'Non-Woven', 'Fabric', 'Natural', '3D Effect'];
const colorOptions = ['White', 'Beige', 'Green', 'Blue', 'Gold', 'Gray', 'Black', 'Multicolor'];
const styleOptions = ['Modern', 'Classic', 'Minimal', 'Luxury', 'Nature', 'Abstract', 'Textured'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    material: searchParams.get('material') || '',
    color: searchParams.get('color') || '',
    style: searchParams.get('style') || '',
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) queryParams.set(k, v); });
  queryParams.set('page', String(page));
  queryParams.set('limit', '20');

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters, page],
    queryFn: () => api.get<{ products: Product[]; pagination: Pagination }>(`/api/products?${queryParams}`),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/api/categories?isActive=true'),
  });

  const products = data?.products || [];
  const pagination = data?.pagination;
  const categories = categoriesData?.categories || [];

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'sort');
  const totalActive = activeFilters.length;

  function clearFilter(key: string) {
    setFilters((prev) => ({ ...prev, [key]: '' }));
    setPage(1);
  }

  function clearAll() {
    setFilters({ category: '', sort: 'newest', search: '', minPrice: '', maxPrice: '', material: '', color: '', style: '' });
    setPage(1);
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-dark font-medium">Products</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gradient font-heading">All Wallpapers</h1>
          {pagination && <p className="text-sm text-muted mt-1">{pagination.total} products found</p>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-ghost flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters {totalActive > 0 && <span className="badge-primary text-xs px-1.5 py-0.5">{totalActive}</span>}
        </button>
      </div>

      {/* Filter Chips */}
      {totalActive > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeFilters.map(([key, val]) => (
            <span key={key} className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              {key === 'category' ? categories.find((c) => c._id === val)?.name || val : key === 'minPrice' || key === 'maxPrice' ? `${key === 'minPrice' ? 'Min' : 'Max'}: ${val}` : val}
              <button onClick={() => clearFilter(key)} className="hover:bg-primary/20 rounded-full p-0.5 -mr-0.5"><X size={12} /></button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs text-muted hover:text-primary transition-colors ml-1">Clear all</button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:block lg:w-64 shrink-0`}>
          <div className={`${showFilters ? 'bg-white p-6 w-full max-w-sm mx-auto mt-16 rounded-t-2xl shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)]' : ''} lg:block`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
            )}
            <div className="lg:card-modern lg:p-5 lg:sticky lg:top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="section-label mb-2">Search</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" value={filters.search} onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} placeholder="Search products..." className="input-modern w-full pl-9" />
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Category */}
              <div>
                <h3 className="section-label mb-3">Room Type</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button onClick={() => { setFilters({ ...filters, category: '' }); setPage(1); }} className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-all ${!filters.category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>All Rooms</button>
                  {categories.map((cat) => (
                    <button key={cat._id} onClick={() => { setFilters({ ...filters, category: cat._id }); setPage(1); }} className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-all ${filters.category === cat._id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>{cat.name}</button>
                  ))}
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Material */}
              <div>
                <h3 className="section-label mb-3">Material</h3>
                <div className="space-y-1">
                  {materialOptions.map((m) => (
                    <button key={m} onClick={() => { setFilters({ ...filters, material: filters.material === m ? '' : m }); setPage(1); }} className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-all ${filters.material === m ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>{m}</button>
                  ))}
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Color */}
              <div>
                <h3 className="section-label mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button key={c} onClick={() => { setFilters({ ...filters, color: filters.color === c ? '' : c }); setPage(1); }} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filters.color === c ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary/50 text-gray-700'}`}>{c}</button>
                  ))}
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Style */}
              <div>
                <h3 className="section-label mb-3">Style</h3>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((s) => (
                    <button key={s} onClick={() => { setFilters({ ...filters, style: filters.style === s ? '' : s }); setPage(1); }} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filters.style === s ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary/50 text-gray-700'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Price */}
              <div>
                <h3 className="section-label mb-2">Price Range</h3>
                <div className="flex gap-2">
                  <input type="number" value={filters.minPrice} onChange={(e) => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1); }} placeholder="Min" className="input-modern w-full" />
                  <input type="number" value={filters.maxPrice} onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }} placeholder="Max" className="input-modern w-full" />
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Sort */}
              <div>
                <h3 className="section-label mb-2">Sort By</h3>
                <select value={filters.sort} onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }} className="select-modern w-full">
                  {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
            </div>
          </div>
          {showFilters && <div className="fixed inset-0 bg-black/30 -z-10" onClick={() => setShowFilters(false)} />}
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card-modern overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 skeleton rounded w-1/3" />
                    <div className="h-4 skeleton rounded w-2/3" />
                    <div className="h-4 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Search size={28} className="text-gray-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
              <p className="text-muted text-sm mb-4">Try adjusting your filters or search terms</p>
              <button onClick={clearAll} className="btn-primary">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {page > 1 && (
                    <button onClick={() => setPage(page - 1)} className="px-4 h-10 rounded-xl border border-border text-sm hover:border-primary transition-all">&larr; Prev</button>
                  )}
                  {Array.from({ length: Math.min(pagination.pages, 8) }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-primary text-white shadow-md' : 'border border-border hover:border-primary text-gray-700'}`}>{i + 1}</button>
                  ))}
                  {page < pagination.pages && (
                    <button onClick={() => setPage(page + 1)} className="px-4 h-10 rounded-xl border border-border text-sm hover:border-primary transition-all">Next &rarr;</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ProductCard
   ═══════════════════════════════════════════════ */
function ProductCard({ product }: { product: Product }) {
  const imgSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/images/placeholder.svg';
  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const [wished, setWished] = useState(false);

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/20 hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {hasDiscount && <span className="badge-accent absolute top-2 left-2 text-[10px]">-{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%</span>}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-gray-900 font-semibold px-4 py-1.5 rounded-lg text-xs shadow-lg">Out of Stock</span>
            </div>
          )}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="block w-full text-center text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-white transition">
              <ShoppingCart size={14} className="inline mr-1" />Quick Add
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
      <button onClick={() => setWished(!wished)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition z-10 shadow-sm">
        <Heart size={13} className={wished ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
      </button>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-12">
        <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

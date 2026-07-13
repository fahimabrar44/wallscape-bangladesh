'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Product, Category, Pagination } from '@/types';
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'name', label: 'Name' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
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

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Products</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">All Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <div className="bg-white rounded-xl border border-border p-5 sticky top-24">
            {/* Search */}
            <div className="mb-5">
              <h3 className="font-semibold text-sm mb-2">Search</h3>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <h3 className="font-semibold text-sm mb-2">Category</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => { setFilters({ ...filters, category: '' }); setPage(1); }}
                  className={`block text-sm w-full text-left px-2 py-1.5 rounded ${!filters.category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { setFilters({ ...filters, category: cat._id }); setPage(1); }}
                    className={`block text-sm w-full text-left px-2 py-1.5 rounded ${filters.category === cat._id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <h3 className="font-semibold text-sm mb-2">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1); }}
                  placeholder="Min"
                  className="w-full px-2 py-1.5 border border-border rounded text-sm"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }}
                  placeholder="Max"
                  className="w-full px-2 py-1.5 border border-border rounded text-sm"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Sort By</h3>
              <select
                value={filters.sort}
                onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted">{pagination?.total || 0} products found</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.pages }).slice(0, 10).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-primary text-white' : 'bg-white border border-border hover:border-primary'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imgSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/images/placeholder.svg';
  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Link href={`/products/${product.slug}`} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-gold text-white text-xs font-semibold px-2 py-1 rounded-md">
            -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </span>
        )}
      </div>
      <div className="p-3 lg:p-4">
        <p className="text-xs text-muted mb-1">{product.productCode}</p>
        <h3 className="font-medium text-sm lg:text-base line-clamp-2 group-hover:text-primary transition">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-primary">{formatCurrency(price)}</span>
          {hasDiscount && <span className="text-xs text-muted line-through">{formatCurrency(product.price)}</span>}
        </div>
      </div>
    </Link>
  );
}

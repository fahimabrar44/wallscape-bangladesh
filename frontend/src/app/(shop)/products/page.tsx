'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Product, Category, Pagination } from '@/types';
import { SlidersHorizontal } from 'lucide-react';

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
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Products</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gradient">All Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden btn-ghost"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <div className="card-modern p-5 sticky top-24 space-y-6">
            <div>
              <h3 className="section-label mb-2">Search</h3>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                placeholder="Search products..."
                className="input-modern w-full"
              />
            </div>

            <hr className="border-border/50" />

            <div>
              <h3 className="section-label mb-3">Category</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setFilters({ ...filters, category: '' }); setPage(1); }}
                  className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-all ${!filters.category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { setFilters({ ...filters, category: cat._id }); setPage(1); }}
                    className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition-all ${filters.category === cat._id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border/50" />

            <div>
              <h3 className="section-label mb-2">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1); }}
                  placeholder="Min"
                  className="input-modern w-full"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }}
                  placeholder="Max"
                  className="input-modern w-full"
                />
              </div>
            </div>

            <hr className="border-border/50" />

            <div>
              <h3 className="section-label mb-2">Sort By</h3>
              <select
                value={filters.sort}
                onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }}
                className="select-modern w-full"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-modern overflow-hidden">
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
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted">{pagination?.total || 0} products found</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: Math.min(pagination.pages, 10) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
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
    <Link href={`/products/${product.slug}`} className="group card-premium overflow-hidden hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
        {hasDiscount && (
          <span className="badge-gold absolute top-2 left-2">
            -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted mb-1">{product.productCode}</p>
        <h3 className="font-medium text-sm lg:text-base line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="price-current">{formatCurrency(price)}</span>
          {hasDiscount && <span className="price-original">{formatCurrency(product.price)}</span>}
        </div>
      </div>
    </Link>
  );
}

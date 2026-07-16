'use client';

import { useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Product, Category, Pagination } from '@/types';
import { ArrowUpDown, SearchX } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = use(params).slug;
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get<{ category: Category }>(`/api/categories/${slug}`),
  });
  const category = catData?.category;

  const queryParams = new URLSearchParams();
  if (category?._id) queryParams.set('category', category._id);
  queryParams.set('sort', sort);
  queryParams.set('page', String(page));
  queryParams.set('limit', '20');

  const { data: productsData, isLoading: prodLoading } = useQuery({
    queryKey: ['category-products', slug, sort, page],
    queryFn: () => api.get<{ products: Product[]; pagination: Pagination }>(`/api/products?${queryParams}`),
    enabled: !!category,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  return (
    <div className="container-custom py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/products" className="hover:text-primary transition">Products</Link>
        <span className="text-gray-300">/</span>
        <span className="text-dark font-medium">{catLoading ? 'Loading...' : category?.name || 'Category'}</span>
      </nav>

      {/* Category Header */}
      {category && (
        <div className="mb-8">
          {category.image ? (
            <div className="relative w-full h-44 sm:h-56 lg:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-100">
              <Image src={getImageUrl(category.image)} alt={category.name} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
              <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{category.name}</h1>
                {category.description && <p className="text-gray-200 text-sm sm:text-base max-w-xl">{category.description}</p>}
              </div>
            </div>
          ) : (
            <h1 className="text-2xl lg:text-3xl font-bold">{category.name}</h1>
          )}
        </div>
      )}

      {/* Sort & Count */}
      {!prodLoading && !catLoading && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted">
            {pagination?.total || 0} product{pagination?.total !== 1 ? 's' : ''} found
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-muted" />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading */}
      {(catLoading || prodLoading) ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-modern animate-pulse overflow-hidden">
              <div className="aspect-[3/4] skeleton" />
              <div className="p-4 space-y-2">
                <div className="h-3 skeleton rounded w-1/3" />
                <div className="h-4 skeleton rounded w-2/3" />
                <div className="h-4 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <SearchX size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No products found</h3>
          <p className="text-muted text-sm mb-4">This category doesn&apos;t have any products yet.</p>
          <Link href="/products" className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-sm">
            Browse all products &rarr;
          </Link>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product.slug}`} className="group card-premium overflow-hidden">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <Image src={getImageUrl(product.images?.[0] || '')} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                  {product.discountPrice && (
                    <span className="badge-accent absolute top-2 left-2">
                      -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-dark font-semibold px-3 py-1 rounded-md text-xs">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3 lg:p-4">
                  <p className="text-[11px] text-muted mb-1">{product.productCode}</p>
                  <h3 className="font-medium text-sm lg:text-base line-clamp-2 group-hover:text-primary transition leading-snug">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="price-current">{formatCurrency(product.discountPrice || product.price)}</span>
                    {product.discountPrice && <span className="price-original">{formatCurrency(product.price)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <button onClick={() => setPage(page - 1)} className="px-4 h-10 rounded-lg border border-border text-sm hover:border-primary transition">
                  &larr; Prev
                </button>
              )}
              {Array.from({ length: Math.min(pagination.pages, 8) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-primary text-white shadow-md' : 'bg-white border border-border hover:border-primary'}`}
                >
                  {i + 1}
                </button>
              ))}
              {page < pagination.pages && (
                <button onClick={() => setPage(page + 1)} className="px-4 h-10 rounded-lg border border-border text-sm hover:border-primary transition">
                  Next &rarr;
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

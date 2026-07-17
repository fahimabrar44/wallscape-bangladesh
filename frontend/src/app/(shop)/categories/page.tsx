import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-api';
import { getImageUrl } from '@/lib/utils';
import type { Category } from '@/types';
import { Hash, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Categories - WALLSCAPE BANGLADESH',
  description: 'Browse all wallpaper categories at WALLSCAPE BANGLADESH. Find luxury, 3D, PVC, textured wallpapers and more.',
};

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    const d = await serverFetch<{ categories: Category[] }>('/api/categories?isActive=true');
    categories = d.categories;
  } catch {}

  return (
    <div className="container-custom py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-dark font-medium">Categories</span>
      </nav>

      <div className="mb-10">
        <span className="section-label mb-1 block">Browse</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">All Categories</h1>
        <p className="text-muted mt-2 max-w-2xl">
          Explore our complete range of wallpaper categories — from luxury textures to vibrant patterns, find the perfect style for your space.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Hash size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-500">No categories yet</h2>
          <p className="text-muted mt-1">Categories will appear here once added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-gray-50 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              {cat.image ? (
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white font-heading">{cat.name}</h3>
                    {cat.description && <p className="text-sm text-gray-200 mt-1 line-clamp-2">{cat.description}</p>}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 sm:h-56 p-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition">
                    <Hash size={28} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-heading text-center">{cat.name}</h3>
                  {cat.description && <p className="text-sm text-muted mt-2 text-center line-clamp-2">{cat.description}</p>}
                </div>
              )}
              <div className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-primary font-medium">Browse Products</span>
                <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

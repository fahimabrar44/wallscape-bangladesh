import Link from 'next/link';
import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-api';
import type { Category } from '@/types';
import CategoryClient from './category-client';

async function fetchCategory(slug: string): Promise<Category | null> {
  try { const d = await serverFetch<{ category: Category }>(`/api/categories/${slug}`); return d.category; } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  return {
    title: category ? `${category.name} - WALLSCAPE BANGLADESH` : 'Category - WALLSCAPE BANGLADESH',
    description: category?.description || `Browse our ${category?.name || ''} wallpaper collection.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  return (
    <div className="container-custom py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/products" className="hover:text-primary transition">Products</Link>
        <span className="text-gray-300">/</span>
        <span className="text-dark font-medium">{category?.name || 'Category'}</span>
      </nav>
      <CategoryClient category={category} slug={slug} />
    </div>
  );
}

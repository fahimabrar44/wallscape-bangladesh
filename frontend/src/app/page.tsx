import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-api';
import type { Product, Category, Review, Project, Blog } from '@/types';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'WALLSCAPE BANGLADESH - Premium Wallpaper & Interior Solutions',
  description: 'Bangladesh\'s premium destination for luxury wallpaper, 3D wall panels, PVC wallpapers, and interior design solutions. Free delivery across Bangladesh.',
  openGraph: {
    title: 'WALLSCAPE BANGLADESH - Premium Wallpaper & Interior Solutions',
    description: 'Bangladesh\'s premium destination for luxury wallpaper, 3D wall panels, and interior design.',
  },
};

export default async function HomePage() {
  const empty = { bestSellers: [], categories: [], reviews: [], projects: [], blogs: [], featuredProducts: [], newArrivals: [] };

  try {
    const [bp, cp, rv, pp, bl, fp, na] = await Promise.allSettled([
      serverFetch<{ products: Product[] }>('/api/products/best-sellers'),
      serverFetch<{ categories: Category[] }>('/api/categories?isActive=true'),
      serverFetch<{ reviews: Review[] }>('/api/reviews?isApproved=true'),
      serverFetch<{ projects: Project[] }>('/api/projects?isPublished=true'),
      serverFetch<{ blogs: Blog[] }>('/api/blogs?isPublished=true'),
      serverFetch<{ products: Product[] }>('/api/products/featured'),
      serverFetch<{ products: Product[] }>('/api/products/new-arrivals'),
    ]);

    return (
      <HomeClient initialProducts={{
        bestSellers: bp.status === 'fulfilled' ? bp.value.products : [],
        categories: cp.status === 'fulfilled' ? cp.value.categories : [],
        reviews: rv.status === 'fulfilled' ? rv.value.reviews : [],
        projects: pp.status === 'fulfilled' ? pp.value.projects : [],
        blogs: bl.status === 'fulfilled' ? bl.value.blogs : [],
        featuredProducts: fp.status === 'fulfilled' ? fp.value.products : [],
        newArrivals: na.status === 'fulfilled' ? na.value.products : [],
      }} />
    );
  } catch {
    return <HomeClient initialProducts={empty} />;
  }
}

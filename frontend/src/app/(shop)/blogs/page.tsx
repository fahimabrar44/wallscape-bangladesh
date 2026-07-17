import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-api';
import type { Blog } from '@/types';
import BlogListClient from './blogs-client';

export const metadata: Metadata = {
  title: 'Blog - WALLSCAPE BANGLADESH',
  description: 'Tips, trends, and inspiration for your interior design projects from WALLSCAPE BANGLADESH.',
};

export default async function BlogsPage() {
  let blogs: Blog[] = [];
  try { const d = await serverFetch<{ blogs: Blog[] }>('/api/blogs?isPublished=true'); blogs = d.blogs; } catch {}

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">Our Blog</h1>
        <p className="text-muted mb-6">Tips, trends, and inspiration for your interior design projects</p>
      </div>
      <BlogListClient blogs={blogs} />
    </div>
  );
}

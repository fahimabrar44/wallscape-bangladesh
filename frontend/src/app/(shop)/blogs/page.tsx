'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { Blog } from '@/types';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => api.get<{ blogs: Blog[] }>('/api/blogs?isPublished=true'),
  });

  const blogs = data?.blogs || [];

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Our Blog</h1>
        <p className="text-muted">Tips, trends, and inspiration for your interior design projects</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-gray-200" />
              <div className="p-5 space-y-2"><div className="h-4 bg-gray-200 rounded w-2/3" /><div className="h-3 bg-gray-200 rounded w-full" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16"><h3 className="text-lg font-medium">No blog posts yet</h3><p className="text-muted mt-1">Check back soon for updates</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={getImageUrl(blog.image || '')} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted mb-2">
                  <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(blog.createdAt)}</span>
                  <span className="flex items-center gap-1"><User size={12} />{blog.author}</span>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-muted line-clamp-3">{blog.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:underline">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

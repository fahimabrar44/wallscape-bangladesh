'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, formatDate } from '@/lib/utils';
import type { Blog } from '@/types';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const [search, setSearch] = useState('');
  const filtered = blogs.filter((b) => !search || b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..." className="input-modern w-full pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium">No blog posts found</h3>
          <p className="text-muted mt-1">{search ? 'Try a different search term' : 'Check back soon for updates'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group card-modern overflow-hidden hover:shadow-lg transition-all">
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
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:underline transition">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

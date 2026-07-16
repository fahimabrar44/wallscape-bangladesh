'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { Blog } from '@/types';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get<{ blog: Blog }>(`/api/blogs/${slug}`),
  });

  const blog = data?.blog;

  if (isLoading) return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-64 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  );

  if (!blog) return (
    <div className="container-custom py-12 text-center">
      <h2 className="text-xl font-medium">Blog not found</h2>
      <Link href="/blogs" className="text-primary mt-2 inline-block">Back to blogs</Link>
    </div>
  );

  return (
    <article className="container-custom py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blogs" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft size={14} /> Back to Blogs
        </Link>

        {blog.image && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <Image src={getImageUrl(blog.image)} alt={blog.title} fill className="object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted mb-4">
          <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(blog.createdAt)}</span>
          <span className="flex items-center gap-1"><User size={14} />{blog.author}</span>
        </div>

        <h1 className="text-gradient text-3xl lg:text-4xl font-bold mb-6">{blog.title}</h1>

        <div className="card-modern p-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
            {blog.tags.map((tag) => (
              <span key={tag} className="badge badge-primary">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

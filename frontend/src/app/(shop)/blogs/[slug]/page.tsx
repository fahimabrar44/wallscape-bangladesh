import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import { getImageUrl, formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

async function fetchBlog(slug: string): Promise<Blog | null> {
  try { const d = await serverFetch<{ blog: Blog }>(`/api/blogs/${slug}`); return d.blog; } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);
  if (!blog) return { title: 'Blog Not Found - WALLSCAPE BANGLADESH' };
  return {
    title: `${blog.title} - WALLSCAPE BANGLADESH`,
    description: blog.excerpt || blog.title,
    openGraph: { title: blog.title, images: blog.image ? [{ url: blog.image }] : [] },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

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
            <Image src={getImageUrl(blog.image)} alt={blog.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted mb-4">
          <span className="flex items-center gap-1">📅 {formatDate(blog.createdAt)}</span>
          <span className="flex items-center gap-1">👤 {blog.author}</span>
        </div>

        <h1 className="text-gradient text-3xl lg:text-4xl font-bold mb-6">{blog.title}</h1>

        <div className="card-modern p-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
            {blog.tags.map((tag) => <span key={tag} className="badge badge-primary">#{tag}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

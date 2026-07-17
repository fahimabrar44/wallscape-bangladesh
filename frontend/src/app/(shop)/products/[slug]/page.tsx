import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import type { Product, Review } from '@/types';
import ProductDetailClient from './product-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://wallscapebd.onrender.com';

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const data = await serverFetch<{ product: Product }>(`/api/products/${slug}`);
    return data.product;
  } catch { return null; }
}

async function fetchRelated(productId: string): Promise<Product[]> {
  try {
    const data = await serverFetch<{ products: Product[] }>(`/api/products/${productId}/related`);
    return data.products ?? [];
  } catch { return []; }
}

async function fetchReviews(productId: string): Promise<Review[]> {
  try {
    const data = await serverFetch<{ reviews: Review[] }>(`/api/reviews?product=${productId}&isApproved=true`);
    return data.reviews ?? [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: 'Product Not Found - WALLSCAPE BANGLADESH' };
  return {
    title: `${product.name} - WALLSCAPE BANGLADESH`,
    description: product.description?.slice(0, 160) || `${product.name} - Premium wallpaper by WALLSCAPE BANGLADESH`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  const [relatedProducts, reviews] = product?._id
    ? await Promise.all([fetchRelated(product._id), fetchReviews(product._id)])
    : [[], []];

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <XCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
        <Link href="/products" className="btn-primary mt-4">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 lg:py-10">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />
    </div>
  );
}

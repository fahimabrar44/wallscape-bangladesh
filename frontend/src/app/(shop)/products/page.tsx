import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductsContent from './products-client';

export const metadata: Metadata = {
  title: 'All Wallpapers - WALLSCAPE BANGLADESH',
  description: 'Browse our premium collection of wallpapers and wall panels. PVC, vinyl, non-woven, 3D wall panels and more.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-12">
        <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-xl" />)}</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

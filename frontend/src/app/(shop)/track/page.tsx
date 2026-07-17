import type { Metadata } from 'next';
import { Package } from 'lucide-react';
import TrackClient from './track-client';

export const metadata: Metadata = {
  title: 'Track Order - WALLSCAPE BANGLADESH',
  description: 'Track your wallpaper order status in real time.',
};

export default function TrackOrderPage() {
  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">Track Your Order</h1>
          <p className="text-muted">Enter your order number or phone number to track your order</p>
        </div>
        <TrackClient />
      </div>
    </div>
  );
}

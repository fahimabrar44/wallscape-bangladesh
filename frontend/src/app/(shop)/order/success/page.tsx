'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '@/providers/cart-provider';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container-custom py-16 lg:py-24">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-3">Order Placed Successfully!</h1>
        <p className="text-muted mb-2">Thank you for your order.</p>
        {orderNumber && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted mb-1">Order Number</p>
            <p className="text-xl font-bold text-primary">{orderNumber}</p>
          </div>
        )}
        <p className="text-sm text-muted mb-8">
          We will contact you at the provided phone number to confirm your order.
          You can track your order status using the order number.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/track"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            <Package size={18} /> Track Order
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-lg font-medium hover:border-primary transition"
          >
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

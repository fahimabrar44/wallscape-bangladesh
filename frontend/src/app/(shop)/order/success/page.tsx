'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowLeft, ShoppingBag, MapPin, Phone, Mail } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="text-gradient text-2xl lg:text-3xl font-bold mb-3">Order Placed Successfully!</h1>
          <p className="text-muted mb-2">Thank you for your order.</p>
          {orderNumber && (
            <div className="card-modern p-6 text-center max-w-xs mx-auto">
              <p className="text-sm text-muted mb-1">Order Number</p>
              <p className="text-xl font-bold text-gradient">{orderNumber}</p>
            </div>
          )}
        </div>

        <p className="text-sm text-muted text-center mb-8">
          We will contact you at the provided phone number to confirm your order.
          You can track your order status using the order number.
        </p>

        <div className="space-y-5 mb-8">
          <div className="card-modern p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><ShoppingBag size={18} /> Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Order Number</span><span className="font-medium">{orderNumber || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-muted">Date</span><span className="font-medium">{new Date().toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted">Status</span><span className="badge-primary">Processing</span></div>
              <div className="flex justify-between"><span className="text-muted">Payment</span><span className="font-medium">Cash on Delivery</span></div>
            </div>
          </div>

          <div className="card-modern p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Package size={18} /> Items Ordered</h3>
            <p className="text-sm text-muted">Your order items will appear here after processing.</p>
          </div>

          <div className="card-modern p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><MapPin size={18} /> Customer Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><MapPin size={14} className="text-muted shrink-0" /> Dhaka, Bangladesh</div>
              <div className="flex items-center gap-3"><Phone size={14} className="text-muted shrink-0" /> +880 1700-000000</div>
              <div className="flex items-center gap-3"><Mail size={14} className="text-muted shrink-0" /> info@wallscapebd.com</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/track" className="btn-primary">
            <Package size={18} /> Track Order
          </Link>
          <Link href="/products" className="btn-ghost">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

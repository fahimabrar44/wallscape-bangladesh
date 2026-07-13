'use client';

import { useCart } from '@/providers/cart-provider';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [deliveryCharge, setDeliveryCharge] = useState<number | null>(null);
  const FREE_DELIVERY_THRESHOLD = 2000;
  const DEFAULT_DELIVERY_CHARGE = 100;

  const charge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (deliveryCharge ?? DEFAULT_DELIVERY_CHARGE);
  const grandTotal = subtotal + charge;

  if (items.length === 0) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-dark font-medium">Cart</span>
        </div>
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag size={36} className="text-muted" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted text-sm mb-8">Looks like you haven&apos;t added anything yet. Start exploring our premium wallpapers!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-dark font-medium">Cart</span>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.product.discountPrice || item.product.price;
            const imgSrc = item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/images/placeholder.svg';
            const lineTotal = price * item.quantity;

            return (
              <div key={item.product._id} className="bg-white rounded-xl border border-border p-4 flex gap-4">
                <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={imgSrc} alt={item.product.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted mb-0.5">{item.product.productCode}</p>
                      <h3 className="font-medium text-sm lg:text-base truncate">{item.product.name}</h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <p className="text-xs text-muted">Unit Price</p>
                      <p className="font-semibold text-sm">{formatCurrency(price)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-gray-50 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-gray-50 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Total</p>
                      <p className="font-bold text-primary">{formatCurrency(lineTotal)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery Charge</span>
                <span className="font-medium">
                  {charge === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    formatCurrency(charge)
                  )}
                </span>
              </div>
              {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
                <p className="text-xs text-muted">
                  Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
                </p>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-base">
                <span className="font-bold">Grand Total</span>
                <span className="font-bold text-primary">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-dark transition"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 text-muted hover:text-dark border border-border hover:border-dark transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

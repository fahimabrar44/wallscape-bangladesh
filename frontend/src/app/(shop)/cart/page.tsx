'use client';

import { useCart } from '@/providers/cart-provider';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const trustFeatures = [
  { icon: Truck, label: 'Free delivery over 2,000 BDT' },
  { icon: RotateCcw, label: '7-day return policy' },
  { icon: ShieldCheck, label: 'Quality assured' },
];

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [deliveryCharge] = useState<number>(100);
  const FREE_DELIVERY_THRESHOLD = 2000;

  const charge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryCharge;
  const grandTotal = subtotal + charge;

  if (items.length === 0) {
    return (
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-dark font-medium">Cart</span>
        </nav>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
            <ShoppingBag size={40} className="text-primary/60" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-muted text-sm mb-8">Looks like you haven&apos;t added anything yet. Explore our premium wallpaper collection.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <ShoppingBag size={18} />
            Browse Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-dark font-medium">Cart</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900">Shopping Cart</h1>
        <span className="text-sm text-muted bg-gray-100 px-3 py-1.5 rounded-full">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => {
              const price = item.product.discountPrice || item.product.price;
              const imgSrc = item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/images/placeholder.svg';
              const lineTotal = price * item.quantity;
              const isLowStock = item.product.stock > 0 && item.product.stock <= 5;

              return (
                <motion.div key={item.product._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  className="bg-white rounded-2xl border border-border p-4 lg:p-5 flex gap-4 lg:gap-5 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={imgSrc} alt={item.product.name} fill className="object-cover" sizes="128px" />
                    {item.product.discountPrice && (
                      <span className="absolute top-1 left-1 bg-primary-light text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] text-muted font-mono">{item.product.productCode}</p>
                          <h3 className="font-medium text-sm lg:text-base text-gray-900">{item.product.name}</h3>
                          {item.product.material && <p className="text-xs text-muted mt-0.5">{item.product.material}</p>}
                        </div>
                        <button onClick={() => removeItem(item.product._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-colors shrink-0" aria-label="Remove item">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-3 mt-3">
                      <div className="flex items-center gap-1.5 border border-border rounded-xl bg-gray-50">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-l-xl transition-colors" aria-label="Decrease">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-r-xl transition-colors" aria-label="Increase">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-muted">Unit: {formatCurrency(price)}</p>
                        <p className="font-bold text-gray-900">{formatCurrency(lineTotal)}</p>
                      </div>
                    </div>
                    {isLowStock && <p className="text-[11px] text-amber-600 mt-1">Only {item.product.stock} left in stock</p>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-7 sticky top-24 space-y-6">
            <h2 className="text-lg font-bold font-heading text-gray-900">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className={charge === 0 ? 'font-semibold text-green-600' : 'text-gray-900 font-semibold'}>
                  {charge === 0 ? 'FREE' : formatCurrency(charge)}
                </span>
              </div>
              {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700">
                    Add <span className="font-semibold">{formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)}</span> more for free delivery
                  </p>
                  <div className="mt-2 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-light rounded-full" style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="font-bold text-gray-900">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full justify-center py-3 text-sm">
              Proceed to Checkout
            </Link>
            <Link href="/products" className="btn-ghost w-full justify-center gap-2 text-sm">
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>
            <div className="border-t border-border pt-5 space-y-3">
              {trustFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 text-xs text-muted">
                  <f.icon size={15} className="text-primary/60 shrink-0" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

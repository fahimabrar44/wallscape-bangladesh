'use client';

import { useCart } from '@/providers/cart-provider';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Banknote, Upload, ArrowLeft, ShieldCheck, Truck, RotateCcw, ChevronRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const checkoutSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  altPhone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  area: z.string().min(1, 'Area is required'),
  fullAddress: z.string().min(1, 'Full address is required'),
  deliveryNote: z.string().optional(),
  paymentMethod: z.enum(['cod', 'manual']),
  manualMethod: z.string().optional(),
  transactionId: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const divisions = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal',
  'Sylhet', 'Rangpur', 'Mymensingh',
];

const manualPaymentMethods = [
  { value: 'bKash', label: 'bKash' },
  { value: 'Nagad', label: 'Nagad' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

const trustBadges = [
  { icon: Truck, label: 'Free delivery over 2,000 BDT' },
  { icon: RotateCcw, label: '7-day returns' },
  { icon: ShieldCheck, label: 'Secure checkout' },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const FREE_DELIVERY_THRESHOLD = 2000;
  const DEFAULT_DELIVERY_CHARGE = 100;

  const charge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_CHARGE;
  const grandTotal = subtotal + charge;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cod' },
  });

  const paymentMethod = watch('paymentMethod');

  const orderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const orderData: any = {
        customer: {
          name: data.name,
          phone: data.phone,
          altPhone: data.altPhone || undefined,
          email: data.email || undefined,
        },
        shippingAddress: {
          division: data.division,
          district: data.district,
          area: data.area,
          fullAddress: data.fullAddress,
          deliveryNote: data.deliveryNote || undefined,
        },
        items: items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          productCode: item.product.productCode,
          image: item.product.images?.[0] || '',
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryCharge: charge,
        grandTotal,
        paymentMethod: data.paymentMethod,
      };

      if (data.paymentMethod === 'manual') {
        const formData = new FormData();
        Object.entries(orderData).forEach(([key, value]) => {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });
        formData.append('manualPayment[method]', data.manualMethod || '');
        formData.append('manualPayment[transactionId]', data.transactionId || '');
        if (paymentScreenshot) {
          formData.append('manualPayment[screenshot]', paymentScreenshot);
        }
        return api.post<any>('/api/orders', formData);
      }

      return api.post<any>('/api/orders', orderData);
    },
    onSuccess: (res: any) => {
      clearCart();
      const orderNumber = res?.order?.orderNumber || res?.orderNumber || '';
      router.push(`/order/success?orderNumber=${orderNumber}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to place order. Please try again.');
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    if (data.paymentMethod === 'manual' && !data.transactionId) {
      toast.error('Please provide the transaction ID');
      return;
    }
    orderMutation.mutate(data);
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-dark font-medium">Checkout</span>
        </nav>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
            <Banknote size={40} className="text-primary/60" />
          </div>
          <h2 className="text-xl font-bold font-heading mb-2 text-gray-900">Your cart is empty</h2>
          <p className="text-muted text-sm mb-6">Add some items before checking out.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-dark font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border p-6 lg:p-7">
              <h2 className="text-lg font-bold font-heading text-gray-900 mb-5">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input {...register('name')} placeholder="Your full name" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                  <input {...register('phone')} placeholder="01XXXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Alternative Phone</label>
                  <input {...register('altPhone')} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
                  <input {...register('email')} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </motion.div>

            {/* Shipping */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl border border-border p-6 lg:p-7">
              <h2 className="text-lg font-bold font-heading text-gray-900 mb-5">Shipping Address</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Division <span className="text-red-500">*</span></label>
                  <select {...register('division')} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    <option value="">Select division</option>
                    {divisions.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                  {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">District <span className="text-red-500">*</span></label>
                  <input {...register('district')} placeholder="District" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Area <span className="text-red-500">*</span></label>
                  <input {...register('area')} placeholder="Area / Thana" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                  {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Address <span className="text-red-500">*</span></label>
                <textarea {...register('fullAddress')} rows={3} placeholder="House, road, block, etc." className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none" />
                {errors.fullAddress && <p className="text-red-500 text-xs mt-1">{errors.fullAddress.message}</p>}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Delivery Note</label>
                <textarea {...register('deliveryNote')} rows={2} placeholder="Any special instructions (optional)" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none" />
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border p-6 lg:p-7">
              <h2 className="text-lg font-bold font-heading text-gray-900 mb-5">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 bg-white'}`}>
                  <input type="radio" value="cod" {...register('paymentMethod')} className="accent-primary w-4 h-4" />
                  <Banknote size={22} className={paymentMethod === 'cod' ? 'text-primary' : 'text-muted'} />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-muted">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'manual' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 bg-white'}`}>
                  <input type="radio" value="manual" {...register('paymentMethod')} className="accent-primary w-4 h-4" />
                  <CreditCard size={22} className={paymentMethod === 'manual' ? 'text-primary' : 'text-muted'} />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Manual Payment</p>
                    <p className="text-xs text-muted">Pay via bKash, Nagad, or Bank Transfer</p>
                  </div>
                </label>
              </div>

              <AnimatePresence>
                {paymentMethod === 'manual' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 space-y-4 overflow-hidden">
                    <div className="bg-gray-50 rounded-xl p-4 border border-border space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Payment Method <span className="text-red-500">*</span></label>
                        <select {...register('manualMethod')} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                          <option value="">Select method</option>
                          {manualPaymentMethods.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                        </select>
                      </div>
                      <div className="text-sm bg-white p-3 rounded-lg border border-border">
                        <p className="font-semibold text-gray-900 mb-1">Send payment to:</p>
                        <p className="text-muted">bKash: <span className="font-semibold text-gray-900">01XXXXXXXXX</span></p>
                        <p className="text-muted">Nagad: <span className="font-semibold text-gray-900">01XXXXXXXXX</span></p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Transaction ID <span className="text-red-500">*</span></label>
                        <input {...register('transactionId')} placeholder="Enter transaction ID" className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Payment Screenshot</label>
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium hover:file:bg-primary/20 cursor-pointer" />
                        </div>
                        <p className="text-xs text-muted mt-1 flex items-center gap-1"><Info size={12} /> Optional. Upload a screenshot of your payment.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button type="submit" disabled={orderMutation.isPending}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="btn-primary w-full py-3.5 text-base rounded-xl lg:hidden">
              {orderMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Placing Order...
                </span>
              ) : `Place Order — ${formatCurrency(grandTotal)}`}
            </motion.button>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-6 lg:p-7 sticky top-24 space-y-6">
              <h2 className="text-lg font-bold font-heading text-gray-900">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  const imgSrc = item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/images/placeholder.svg';
                  return (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image src={imgSrc} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-muted">Qty: {item.quantity}</p>
                        <p className="font-semibold text-sm text-gray-900 mt-0.5">{formatCurrency(price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery</span>
                  <span className={charge === 0 ? 'font-semibold text-green-600' : 'font-semibold text-gray-900'}>
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
              <button type="submit" disabled={orderMutation.isPending}
                className="btn-primary w-full justify-center py-3 text-sm rounded-xl hidden lg:flex">
                {orderMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : `Place Order — ${formatCurrency(grandTotal)}`}
              </button>
              <div className="border-t border-border pt-5 space-y-3">
                {trustBadges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2.5 text-xs text-muted">
                    <b.icon size={15} className="text-primary/60 shrink-0" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

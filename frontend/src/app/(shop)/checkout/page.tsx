'use client';

import { useCart } from '@/providers/cart-provider';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { CreditCard, Banknote, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

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
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
    },
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
        <div className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-primary">Cart</Link>
          <span>/</span>
          <span className="text-dark font-medium">Checkout</span>
        </div>
        <div className="max-w-md mx-auto text-center py-16">
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted text-sm mb-6">Add some items to your cart before checking out.</p>
          <Link
            href="/products"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            <ArrowLeft size={18} />
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
        <Link href="/cart" className="hover:text-primary">Cart</Link>
        <span>/</span>
        <span className="text-dark font-medium">Checkout</span>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8 text-gradient">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-modern p-6">
              <h2 className="font-bold text-lg mb-5">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Your full name"
                    className="input-modern w-full"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('phone')}
                    placeholder="01XXXXXXXXX"
                    className="input-modern w-full"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Alternative Phone</label>
                  <input
                    {...register('altPhone')}
                    placeholder="Optional"
                    className="input-modern w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input
                    {...register('email')}
                    placeholder="Optional"
                    className="input-modern w-full"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            <div className="card-modern p-6">
              <h2 className="font-bold text-lg mb-5">Shipping Address</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('division')}
                    className="select-modern w-full"
                  >
                    <option value="">Select division</option>
                    {divisions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('district')}
                    placeholder="District"
                    className="input-modern w-full"
                  />
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('area')}
                    placeholder="Area / Thana"
                    className="input-modern w-full"
                  />
                  {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('fullAddress')}
                  rows={3}
                  placeholder="House, road, block, etc."
                  className="input-modern w-full resize-none"
                />
                {errors.fullAddress && <p className="text-red-500 text-xs mt-1">{errors.fullAddress.message}</p>}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5">Delivery Note</label>
                <textarea
                  {...register('deliveryNote')}
                  rows={2}
                  placeholder="Any special instructions (optional)"
                  className="input-modern w-full resize-none"
                />
              </div>
            </div>

            <div className="card-modern p-6">
              <h2 className="font-bold text-lg mb-5">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input
                    type="radio"
                    value="cod"
                    {...register('paymentMethod')}
                    className="accent-primary"
                  />
                  <Banknote size={20} className="text-muted" />
                  <div>
                    <p className="font-medium text-sm">Cash on Delivery</p>
                    <p className="text-xs text-muted">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'manual' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input
                    type="radio"
                    value="manual"
                    {...register('paymentMethod')}
                    className="accent-primary"
                  />
                  <CreditCard size={20} className="text-muted" />
                  <div>
                    <p className="font-medium text-sm">Manual Payment</p>
                    <p className="text-xs text-muted">Pay via bKash, Nagad, or Bank Transfer</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'manual' && (
                <div className="mt-5 card-modern p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Payment Method <span className="text-red-500">*</span></label>
                    <select
                      {...register('manualMethod')}
                      className="select-modern w-full"
                    >
                      <option value="">Select method</option>
                      {manualPaymentMethods.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm text-muted bg-white p-3 rounded-lg border border-border">
                    <p className="font-medium text-dark mb-1">Send payment to:</p>
                    <p>bKash (Merchant): <span className="font-semibold text-dark">01XXXXXXXXX</span></p>
                    <p>Nagad (Merchant): <span className="font-semibold text-dark">01XXXXXXXXX</span></p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('transactionId')}
                      placeholder="Enter transaction ID"
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Payment Screenshot</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted mt-1">Optional. Upload a screenshot of your payment.</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={orderMutation.isPending}
              className="btn-primary w-full py-3.5 text-base"
            >
              {orderMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Placing Order...
                </span>
              ) : (
                `Place Order — ${formatCurrency(grandTotal)}`
              )}
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="card-modern p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  const imgSrc = item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/images/placeholder.svg';
                  return (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={imgSrc} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted">Qty: {item.quantity}</p>
                        <p className="price-current text-sm mt-0.5">{formatCurrency(price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr className="border-border mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="price-current">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery Charge</span>
                  <span className="font-medium">
                    {charge === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span className="price-current">{formatCurrency(charge)}</span>
                    )}
                  </span>
                </div>
                {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
                  <p className="text-xs text-muted">
                    Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
                  </p>
                )}
              </div>
              <hr className="border-border my-4" />
              <div className="flex justify-between text-base">
                <span className="font-bold">Grand Total</span>
                <span className="font-bold price-current">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

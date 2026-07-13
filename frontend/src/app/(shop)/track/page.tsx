'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { Package, Search, Truck, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-500' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue-600' },
  packed: { label: 'Packed', icon: Package, color: 'text-purple-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-orange-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500' },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);

  const queryParams = new URLSearchParams();
  if (orderNumber) queryParams.set('orderNumber', orderNumber);
  if (phone) queryParams.set('phone', phone);

  const { data, isLoading, error } = useQuery({
    queryKey: ['track-order', orderNumber, phone],
    queryFn: () => api.get<{ order: Order }>(`/api/orders/track?${queryParams}`),
    enabled: searched && (!!orderNumber || !!phone),
  });

  const order = data?.order;
  const currentStatusIndex = order ? statusFlow.indexOf(order.orderStatus) : -1;
  const isCancelled = order?.orderStatus === 'cancelled';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber || phone) setSearched(true);
  };

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted">Enter your order number or phone number to track your order</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-xl border border-border p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. WS-XXXX-XXXX"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01XXXXXXXXX"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            <Search size={18} /> Track Order
          </button>
        </form>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted">Searching for your order...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <XCircle size={32} className="text-red-500 mx-auto mb-2" />
            <p className="font-medium text-red-700">Order not found</p>
            <p className="text-sm text-red-500 mt-1">Please check your order number or phone number and try again</p>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <p className="text-sm text-muted">Order Number</p>
                  <p className="text-lg font-bold">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCancelled ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'
                }`}>
                  {statusConfig[order.orderStatus].label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === 'verified' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Status Timeline */}
            {!isCancelled && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-6">Order Progress</h3>
                <div className="relative">
                  {statusFlow.map((status, i) => {
                    const StatusIcon = statusConfig[status].icon;
                    const isCompleted = i <= currentStatusIndex;
                    const isCurrent = i === currentStatusIndex;
                    return (
                      <div key={status} className="flex items-start gap-3 pb-6 last:pb-0 relative">
                        {i < statusFlow.length - 1 && (
                          <div className={`absolute left-[15px] top-8 w-0.5 h-full -translate-x-1/2 ${
                            i < currentStatusIndex ? 'bg-primary' : 'bg-gray-200'
                          }`} />
                        )}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}>
                          <StatusIcon size={16} />
                        </div>
                        <div className="pt-1">
                          <p className={`font-medium text-sm ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                            {statusConfig[status].label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-3">Customer Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted">Name</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-muted">Phone</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted">Address</p>
                  <p className="font-medium">
                    {order.shippingAddress.fullAddress}, {order.shippingAddress.area},
                    {order.shippingAddress.district}, {order.shippingAddress.division}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted">{item.productCode}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery Charge</span>
                  <span>{formatCurrency(order.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

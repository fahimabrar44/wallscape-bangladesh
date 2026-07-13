'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, getImageUrl } from '@/lib/utils';
import { Order } from '@/types';
import { ArrowLeft, Printer, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => api.get<{ order: Order }>(`/api/admin/orders/${id}`),
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderStatus, cancelReason }: { orderStatus: string; cancelReason?: string }) =>
      api.put(`/api/admin/orders/${id}/status`, { orderStatus, cancelReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      toast.success('Order updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const paymentMutation = useMutation({
    mutationFn: (paymentStatus: string) =>
      api.put(`/api/admin/orders/${id}/payment`, { paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      toast.success('Payment status updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const order = data?.order;

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-64 bg-gray-200 rounded" /></div>;
  }

  if (!order) return <div className="text-center py-12 text-muted">Order not found</div>;

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700', packed: 'bg-purple-100 text-purple-700',
    shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.orderStatus]}`}>
          {order.orderStatus}
        </span>
        <button
          onClick={() => window.print()}
          className="ml-auto flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-gray-50"
        >
          <Printer size={16} /> Print
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted">Name</span><p className="font-medium">{order.customer.name}</p></div>
              <div><span className="text-muted">Phone</span><p className="font-medium">{order.customer.phone}</p></div>
              {order.customer.altPhone && <div><span className="text-muted">Alt Phone</span><p className="font-medium">{order.customer.altPhone}</p></div>}
              {order.customer.email && <div><span className="text-muted">Email</span><p className="font-medium">{order.customer.email}</p></div>}
            </div>
            <div className="mt-4">
              <span className="text-sm text-muted">Shipping Address</span>
              <p className="font-medium text-sm mt-1">
                {order.shippingAddress.fullAddress}, {order.shippingAddress.area},
                {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
              {order.shippingAddress.deliveryNote && (
                <p className="text-sm text-muted mt-2">Note: {order.shippingAddress.deliveryNote}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted">{item.productCode} × {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 mt-2 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{formatCurrency(order.deliveryCharge)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span><span className="text-primary">{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <div className="space-y-2">
              {['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'].map((s) => (
                <button
                  key={s}
                  onClick={() => statusMutation.mutate({ orderStatus: s })}
                  disabled={order.orderStatus === s || order.orderStatus === 'cancelled'}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    order.orderStatus === s
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50 text-gray-600 border border-border'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
              <hr className="my-2" />
              <button
                onClick={() => statusMutation.mutate({ orderStatus: 'cancelled', cancelReason: 'Cancelled by admin' })}
                disabled={order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition"
              >
                Cancel Order
              </button>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Payment</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Method</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-muted">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'verified' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{order.paymentStatus}</span>
              </div>
              {order.manualPayment && (
                <>
                  <div><span className="text-muted">Method</span><p className="font-medium">{order.manualPayment.method}</p></div>
                  <div><span className="text-muted">Transaction ID</span><p className="font-medium">{order.manualPayment.transactionId}</p></div>
                </>
              )}
              {order.paymentStatus === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => paymentMutation.mutate('verified')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                    <CheckCircle size={14} /> Verify
                  </button>
                  <button onClick={() => paymentMutation.mutate('rejected')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Order Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Created</span><span>{formatDate(order.createdAt)}</span></div>
              {order.paidAt && <div className="flex justify-between"><span className="text-muted">Paid</span><span>{formatDate(order.paidAt)}</span></div>}
              {order.deliveredAt && <div className="flex justify-between"><span className="text-muted">Delivered</span><span>{formatDate(order.deliveredAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

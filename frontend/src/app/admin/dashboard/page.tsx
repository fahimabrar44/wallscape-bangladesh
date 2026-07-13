'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Clock, CheckCircle, TrendingUp, Package, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get<{
      stats: {
        totalOrders: number;
        todayOrders: number;
        pendingOrders: number;
        deliveredOrders: number;
        monthlyRevenue: number;
      };
      recentOrders: any[];
      bestSellers: any[];
      lowStock: any[];
    }>('/api/admin/orders/dashboard'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: "Today's Orders", value: stats?.todayOrders || 0, icon: Clock, color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Delivered Orders', value: stats?.deliveredOrders || 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Monthly Revenue', value: formatCurrency(stats?.monthlyRevenue || 0), icon: TrendingUp, color: 'bg-primary' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted">{card.label}</span>
              <div className={`w-10 h-10 rounded-lg ${card.color} bg-opacity-10 flex items-center justify-center`}>
                <card.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {data?.recentOrders?.slice(0, 8).map((order: any) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{order.customer.name} · {formatCurrency(order.grandTotal)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.orderStatus}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Best Selling Products</h2>
            <Link href="/admin/products" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {data?.bestSellers?.slice(0, 8).map((product: any) => (
              <div key={product._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted">{product.totalSold} sold · {formatCurrency(product.price)}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">{product.totalSold}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-500" />
            <h2 className="font-semibold">Low Stock Products</h2>
          </div>
          {data?.lowStock?.length === 0 ? (
            <p className="text-sm text-muted">All products have sufficient stock</p>
          ) : (
            <div className="space-y-3">
              {data?.lowStock?.slice(0, 8).map((product: any) => (
                <div key={product._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted">Stock: {product.stock}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    product.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.stock <= 0 ? 'Out of Stock' : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

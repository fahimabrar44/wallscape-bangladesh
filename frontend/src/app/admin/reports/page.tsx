'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, ShoppingCart, TrendingUp, Package } from 'lucide-react';

export default function AdminReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get<any>('/api/admin/orders/dashboard'),
  });

  const stats = data?.stats;

  if (isLoading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Reports</h1><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="bg-white rounded-xl border border-border p-6 animate-pulse"><div className="h-4 bg-gray-200 rounded w-24 mb-3" /><div className="h-8 bg-gray-200 rounded w-16" /></div>))}</div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart },
          { label: 'Delivered Orders', value: stats?.deliveredOrders || 0, icon: Package },
          { label: 'Monthly Revenue', value: formatCurrency(stats?.monthlyRevenue || 0), icon: TrendingUp },
          { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: BarChart3 },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted">{card.label}</span>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <card.icon size={20} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <p className="text-sm text-muted">View and export order reports from the Orders section.</p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Export CSV</button>
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium">Print Report</button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get<{ settings: Record<string, any> }>('/api/settings'),
  });

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) => api.put('/api/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings saved');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const fields = [
    { key: 'siteName', label: 'Site Name', type: 'text' },
    { key: 'siteDescription', label: 'Site Description', type: 'textarea' },
    { key: 'contactPhone', label: 'Contact Phone', type: 'text' },
    { key: 'contactEmail', label: 'Contact Email', type: 'email' },
    { key: 'contactAddress', label: 'Address', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
    { key: 'facebook', label: 'Facebook URL', type: 'url' },
    { key: 'instagram', label: 'Instagram URL', type: 'url' },
    { key: 'youtube', label: 'YouTube URL', type: 'url' },
    { key: 'deliveryCharge', label: 'Delivery Charge (৳)', type: 'number' },
    { key: 'freeDeliveryMin', label: 'Free Delivery Minimum (৳)', type: 'number' },
    { key: 'bkashNumber', label: 'bKash Number', type: 'text' },
    { key: 'nagadNumber', label: 'Nagad Number', type: 'text' },
    { key: 'bankDetails', label: 'Bank Transfer Details', type: 'textarea' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-96 bg-gray-200 rounded" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Website Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-5 max-w-2xl">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <input
                type={f.type}
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>
        ))}
        <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50">
          <Save size={18} /> {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

const defaultBusinessHours = [
  { day: 'Saturday – Thursday', hours: '9:00 AM – 8:00 PM' },
  { day: 'Friday', hours: '2:00 PM – 8:00 PM' },
  { day: 'Public Holidays', hours: '10:00 AM – 6:00 PM' },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Record<string, any>>({});
  const [businessHours, setBusinessHours] = useState<{ day: string; hours: string }[]>(defaultBusinessHours);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get<{ settings: Record<string, any> }>('/api/settings'),
  });

  useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
      if (data.settings.businessHours) setBusinessHours(data.settings.businessHours);
    }
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
    { key: 'messenger', label: 'Facebook Messenger URL', type: 'text' },
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
    mutation.mutate({ ...form, businessHours });
  };

  function addHourRow() {
    setBusinessHours([...businessHours, { day: '', hours: '' }]);
  }

  function removeHourRow(i: number) {
    setBusinessHours(businessHours.filter((_, idx) => idx !== i));
  }

  function updateHourRow(i: number, field: 'day' | 'hours', value: string) {
    const updated = businessHours.map((row, idx) => (idx === i ? { ...row, [field]: value } : row));
    setBusinessHours(updated);
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-96 bg-gray-200 rounded" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Website Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
          <h2 className="text-lg font-semibold">General Information</h2>
          {fields.filter((f) => ['siteName', 'siteDescription'].includes(f.key)).map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              ) : (
                <input type={f.type} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          {fields.filter((f) => ['contactPhone', 'contactEmail', 'contactAddress', 'whatsapp', 'messenger'].includes(f.key)).map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Business Hours</h2>
            <button type="button" onClick={addHourRow} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition font-medium">
              <Plus size={16} /> Add Row
            </button>
          </div>
          <div className="space-y-3">
            {businessHours.map((row, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1">
                  <input type="text" value={row.day} onChange={(e) => updateHourRow(i, 'day', e.target.value)} placeholder="e.g. Saturday – Thursday" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex-1">
                  <input type="text" value={row.hours} onChange={(e) => updateHourRow(i, 'hours', e.target.value)} placeholder="e.g. 9:00 AM – 8:00 PM" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <button type="button" onClick={() => removeHourRow(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition mt-0.5"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
          <h2 className="text-lg font-semibold">Social Media</h2>
          {fields.filter((f) => ['facebook', 'instagram', 'youtube'].includes(f.key)).map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
        </div>

        {/* Payment & Delivery */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
          <h2 className="text-lg font-semibold">Payment &amp; Delivery</h2>
          {fields.filter((f) => ['deliveryCharge', 'freeDeliveryMin', 'bkashNumber', 'nagadNumber', 'bankDetails'].includes(f.key)).map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              ) : (
                <input type={f.type} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50">
          <Save size={18} /> {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

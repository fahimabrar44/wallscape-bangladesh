'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Phone, Mail, MapPin, MessageCircle, Clock, MailQuestion, Eye } from 'lucide-react';

const defaultBusinessHours = [
  { day: 'Saturday – Thursday', hours: '9:00 AM – 8:00 PM' },
  { day: 'Friday', hours: '2:00 PM – 8:00 PM' },
  { day: 'Public Holidays', hours: '10:00 AM – 6:00 PM' },
];

export default function AdminContactInfoPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, any>>({});
  const [businessHours, setBusinessHours] = useState<{ day: string; hours: string }[]>(defaultBusinessHours);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get<{ settings: Record<string, any> }>('/api/settings'),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => api.get<{ notifications: any[] }>('/api/admin/notifications'),
  });

  useEffect(() => {
    if (settingsData?.settings) {
      setForm(settingsData.settings);
      if (settingsData.settings.businessHours) setBusinessHours(settingsData.settings.businessHours);
    }
  }, [settingsData]);

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) => api.put('/api/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Contact info saved');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const contactMessages = (notificationsData?.notifications || []).filter((n: any) => n.type === 'contact');
  const contactInfoFields = [
    { key: 'contactPhone', label: 'Phone', icon: Phone },
    { key: 'contactEmail', label: 'Email', icon: Mail },
    { key: 'contactAddress', label: 'Address', icon: MapPin },
    { key: 'whatsapp', label: 'WhatsApp Number', icon: MessageCircle },
    { key: 'messenger', label: 'Messenger URL', icon: MessageCircle },
  ];

  function handleSave() {
    mutation.mutate({ ...form, businessHours });
  }

  function addHourRow() {
    setBusinessHours([...businessHours, { day: '', hours: '' }]);
  }

  function removeHourRow(i: number) {
    setBusinessHours(businessHours.filter((_, idx) => idx !== i));
  }

  function updateHourRow(i: number, field: 'day' | 'hours', value: string) {
    setBusinessHours(businessHours.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-96 bg-gray-200 rounded" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contact Information</h1>

      {/* Contact Details */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Phone size={18} className="text-primary" /> Contact Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {contactInfoFields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1.5"><Icon size={14} className="text-muted" /> {f.label}</label>
                <input type="text" value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Clock size={18} className="text-primary" /> Business Hours</h2>
          <button type="button" onClick={addHourRow} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition font-medium">
            <Plus size={16} /> Add Row
          </button>
        </div>
        <div className="space-y-3">
          {businessHours.map((row, i) => (
            <div key={i} className="flex items-start gap-3">
              <input type="text" value={row.day} onChange={(e) => updateHourRow(i, 'day', e.target.value)} placeholder="e.g. Saturday – Thursday" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input type="text" value={row.hours} onChange={(e) => updateHourRow(i, 'hours', e.target.value)} placeholder="e.g. 9:00 AM – 8:00 PM" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <button type="button" onClick={() => removeHourRow(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={mutation.isPending} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50">
        <Save size={18} /> {mutation.isPending ? 'Saving...' : 'Save Contact Info'}
      </button>

      {/* Contact Form Submissions */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MailQuestion size={18} className="text-primary" /> Contact Form Submissions ({contactMessages.length})</h2>
        {contactMessages.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">No contact form submissions yet.</div>
        ) : (
          <div className="space-y-3">
            {contactMessages.map((msg: any) => {
              const lines = (msg.message || '').split('\n');
              const fromLine = lines[0]?.replace('From: ', '') || 'Unknown';
              const body = lines.slice(1).join('\n');
              return (
                <div key={msg._id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-border/50">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <MailQuestion size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{msg.title}</p>
                      <span className="text-[10px] text-muted shrink-0">{new Date(msg.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{fromLine}</p>
                    {body && <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 whitespace-pre-wrap">{body}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
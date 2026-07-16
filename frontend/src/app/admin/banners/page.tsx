'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Banner } from '@/types';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', mobileImage: '', link: '', buttonText: '', isActive: true, order: 0 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => api.get<{ banners: Banner[] }>('/api/banners'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/banners', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner created'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to create banner'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/banners/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner updated'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to update banner'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/banners/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const banners = data?.banners || [];

  function closeModal() { setShowModal(false); setEditing(null); setForm({ title: '', subtitle: '', image: '', mobileImage: '', link: '', buttonText: '', isActive: true, order: 0 }); }

  function openEdit(banner: Banner) { setEditing(banner); setForm({ title: banner.title, subtitle: banner.subtitle || '', image: banner.image, mobileImage: banner.mobileImage || '', link: banner.link || '', buttonText: banner.buttonText || '', isActive: banner.isActive, order: banner.order }); setShowModal(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.image.trim()) return toast.error('Title and image are required');
    const payload = { ...form, subtitle: form.subtitle || undefined, mobileImage: form.mobileImage || undefined, link: form.link || undefined, buttonText: form.buttonText || undefined };
    if (editing) updateMutation.mutate({ id: editing._id, data: payload });
    else createMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Homepage Banners</h1>
        <button onClick={() => { setEditing(null); setForm({ title: '', subtitle: '', image: '', mobileImage: '', link: '', buttonText: '', isActive: true, order: 0 }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Plus size={16} /> Add Banner
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-border">
            <th className="text-left px-4 py-3 font-medium text-muted">Title</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Order</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                {Array.from({ length: 4 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>))}
              </tr>
            )) : banners.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12"><Image size={40} className="mx-auto text-muted mb-3" /><p className="text-muted font-medium">No banners found</p><p className="text-xs text-muted mt-1">Add your first banner to display on the homepage</p></td></tr>
            ) : banners.map((b) => (
              <tr key={b._id} className="border-b border-border hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3">{b.order}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1">
                  <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete this banner?')) deleteMutation.mutate(b._id); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Image URL</label>
                <input type="text" value={form.mobileImage} onChange={(e) => setForm({ ...form, mobileImage: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Link</label>
                  <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input type="text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

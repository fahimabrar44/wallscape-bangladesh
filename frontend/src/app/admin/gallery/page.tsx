'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminGalleryPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', image: '', category: 'after', beforeImage: '', afterImage: '', isPublished: true });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-gallery'], queryFn: () => api.get<{ items: any[] }>('/api/gallery') });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/gallery', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); toast.success('Image added'); setShowModal(false); setForm({ title: '', image: '', category: 'after', beforeImage: '', afterImage: '', isPublished: true }); },
    onError: (err: any) => toast.error(err?.message || 'Failed to add image'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/gallery/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }); toast.success('Deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const items = data?.items || [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    createMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"><Plus size={16} /> Add Image</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
        )) : items.map((item) => (
          <div key={item._id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src={item.image || item.beforeImage} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(item._id); }} className="p-2 bg-red-500 text-white rounded-lg"><Trash2 size={16} /></button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">
              <p className="text-white text-sm font-medium truncate">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Gallery Image</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="before">Before</option>
                  <option value="after">After</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Before Image</label>
                <input type="text" value={form.beforeImage} onChange={(e) => setForm({ ...form, beforeImage: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">After Image</label>
                <input type="text" value={form.afterImage} onChange={(e) => setForm({ ...form, afterImage: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="rounded border-border" />
                <span className="text-sm font-medium">Published</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">{createMutation.isPending ? 'Adding...' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

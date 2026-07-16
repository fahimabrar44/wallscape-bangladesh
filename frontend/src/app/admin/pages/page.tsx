'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Page } from '@/types';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPagesPage() {
  const [editing, setEditing] = useState<Page | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', isPublished: true });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => api.get<{ pages: Page[] }>('/api/pages'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/pages', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pages'] }); toast.success('Page created'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to create page'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/pages/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pages'] }); toast.success('Page updated'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to update page'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/pages/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pages'] }); toast.success('Page deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const pages = data?.pages || [];

  function closeModal() { setShowModal(false); setEditing(null); setForm({ title: '', content: '', isPublished: true }); }

  function openEdit(p: Page) { setEditing(p); setForm({ title: p.title, content: p.content, isPublished: p.isPublished }); setShowModal(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    if (editing) updateMutation.mutate({ id: editing._id, data: form });
    else createMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Static Pages</h1>
        <button onClick={() => { setEditing(null); setForm({ title: '', content: '', isPublished: true }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Plus size={16} /> Add Page
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-border">
            <th className="text-left px-4 py-3 font-medium text-muted">Title</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Slug</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                {Array.from({ length: 4 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>))}
              </tr>
            )) : pages.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12"><FileText size={40} className="mx-auto text-muted mb-3" /><p className="text-muted font-medium">No pages found</p><p className="text-xs text-muted mt-1">Add your first static page</p></td></tr>
            ) : pages.map((p) => (
              <tr key={p._id} className="border-b border-border hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted">{p.slug}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.isPublished ? 'Published' : 'Draft'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete this page?')) deleteMutation.mutate(p._id); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Page' : 'Add Page'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="rounded border-border" />
                <span className="text-sm font-medium">Published</span>
              </label>
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

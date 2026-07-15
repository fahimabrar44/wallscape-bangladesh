'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [editing, setEditing] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', order: 0 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/api/categories'),
  });

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    queryClient.invalidateQueries({ queryKey: ['nav-categories'] });
    queryClient.invalidateQueries({ queryKey: ['footer-categories'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/categories', data),
    onSuccess: () => { invalidateAll(); toast.success('Category created'); closeModal(); },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/categories/${id}`, data),
    onSuccess: () => { invalidateAll(); toast.success('Category updated'); closeModal(); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/categories/${id}`),
    onSuccess: () => { invalidateAll(); toast.success('Category deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const categories = data?.categories || [];

  function closeModal() { setShowModal(false); setEditing(null); setForm({ name: '', description: '', order: 0 }); }

  function openEdit(cat: Category) { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', order: cat.order || 0 }); setShowModal(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (editing) updateMutation.mutate({ id: editing._id, data: form });
    else createMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', description: '', order: 0 }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Order</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                </tr>
              ))
            ) : categories.map((cat) => (
              <tr key={cat._id} className="border-b border-border hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted">{cat.slug}</td>
                <td className="px-4 py-3">{cat.order}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete this category?')) deleteMutation.mutate(cat._id); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


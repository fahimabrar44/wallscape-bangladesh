'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Admin } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [editing, setEditing] = useState<Admin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' as 'super_admin' | 'admin' | 'manager', isActive: true });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<{ admins: Admin[] }>('/api/admins'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/admins', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Admin created'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to create admin'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/admins/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Admin updated'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to update admin'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admins/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Admin deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const admins = data?.admins || [];

  function closeModal() { setShowModal(false); setEditing(null); setForm({ name: '', email: '', password: '', role: 'admin', isActive: true }); }

  function openEdit(a: Admin) { setEditing(a); setForm({ name: a.name, email: a.email, password: '', role: a.role, isActive: a.isActive }); setShowModal(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email are required');
    const payload: any = { name: form.name, email: form.email, role: form.role, isActive: form.isActive };
    if (!editing) {
      if (!form.password.trim()) return toast.error('Password is required');
      payload.password = form.password;
    } else if (form.password.trim()) {
      payload.password = form.password;
    }
    if (editing) updateMutation.mutate({ id: editing._id, data: payload });
    else createMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'admin', isActive: true }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Plus size={16} /> Add Admin
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-border">
            <th className="text-left px-4 py-3 font-medium text-muted">Name</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Email</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Role</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Last Login</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                {Array.from({ length: 6 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>))}
              </tr>
            )) : admins.map((a) => (
              <tr key={a._id} className="border-b border-border hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3">{a.email}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium capitalize">{a.role.replace('_', ' ')}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3 text-muted text-xs">{a.lastLogin ? formatDate(a.lastLogin) : 'Never'}</td>
                <td className="px-4 py-3"><div className="flex gap-1">
                  <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete this admin?')) deleteMutation.mutate(a._id); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Admin' : 'Add Admin'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{editing ? 'Password (leave blank to keep)' : 'Password'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" />
                <span className="text-sm font-medium">Active</span>
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

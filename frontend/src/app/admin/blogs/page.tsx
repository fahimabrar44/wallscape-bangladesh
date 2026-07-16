'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Blog } from '@/types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

export default function AdminBlogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Blog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', author: '', image: '', tags: '', isPublished: true });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', page, search],
    queryFn: () => api.get<{ blogs: Blog[] }>(`/api/blogs?page=${page}&limit=20${search ? `&search=${search}` : ''}`),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/blogs', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }); toast.success('Blog created'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to create blog'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/blogs/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }); toast.success('Blog updated'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to update blog'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/blogs/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }); toast.success('Blog deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const blogs = data?.blogs || [];

  function closeModal() { setShowModal(false); setEditing(null); setForm({ title: '', excerpt: '', content: '', author: '', image: '', tags: '', isPublished: true }); }

  function openEdit(blog: Blog) { setEditing(blog); setForm({ title: blog.title, excerpt: blog.excerpt, content: blog.content, author: blog.author, image: blog.image || '', tags: blog.tags?.join(', ') || '', isPublished: blog.isPublished }); setShowModal(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...form, tags, image: form.image || undefined };
    if (editing) updateMutation.mutate({ id: editing._id, data: payload });
    else createMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <button onClick={() => { setEditing(null); setForm({ title: '', excerpt: '', content: '', author: '', image: '', tags: '', isPublished: true }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Plus size={16} /> Add Blog
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search blogs..." className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-border">
            <th className="text-left px-4 py-3 font-medium text-muted">Title</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Author</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
            <th className="text-left px-4 py-3 font-medium text-muted">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                {Array.from({ length: 5 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>))}
              </tr>
            )) : blogs.map((blog) => (
              <tr key={blog._id} className="border-b border-border hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{blog.title}</td>
                <td className="px-4 py-3">{blog.author}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{blog.isPublished ? 'Published' : 'Draft'}</span></td>
                <td className="px-4 py-3 text-muted">{formatDate(blog.createdAt)}</td>
                <td className="px-4 py-3"><div className="flex gap-1">
                  <button onClick={() => openEdit(blog)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(blog._id); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Blog' : 'Add Blog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <div className="flex items-center gap-2">
                    <CloudinaryUpload currentImage={form.image} onUpload={(url) => setForm({ ...form, image: url })} onRemove={() => setForm({ ...form, image: '' })} />
                    <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. wallpaper, interior, tips" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
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

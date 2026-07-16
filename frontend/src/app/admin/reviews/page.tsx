'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Review } from '@/types';
import { Star, Edit2, CheckCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [editing, setEditing] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 5, review: '', isApproved: false });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get<{ reviews: Review[] }>('/api/admin/reviews'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/admin/reviews/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review updated'); closeModal(); },
    onError: (err: any) => toast.error(err?.message || 'Failed to update review'),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/api/admin/reviews/${id}/approve`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review approved'); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/reviews/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review deleted'); },
    onError: (err: any) => toast.error(err.message),
  });

  const reviews = data?.reviews || [];

  function closeModal() { setShowModal(false); setEditing(null); setForm({ customerName: '', rating: 5, review: '', isApproved: false }); }

  function openEdit(r: Review) { setEditing(r); setForm({ customerName: r.customerName, rating: r.rating, review: r.review, isApproved: r.isApproved }); setShowModal(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim() || !form.review.trim()) return toast.error('Customer name and review are required');
    if (editing) updateMutation.mutate({ id: editing._id, data: { customerName: form.customerName, rating: form.rating, review: form.review, isApproved: form.isApproved } });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Review</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>))}
                </tr>
              ))
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted">No reviews yet</td></tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="border-b border-border hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{review.customerName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-300'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{review.review}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(review)} className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Edit"><Edit2 size={14} /></button>
                      {!review.isApproved && (
                        <button onClick={() => approveMutation.mutate(review._id)} className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition" title="Approve">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button onClick={() => { if (confirm('Delete this review?')) deleteMutation.mutate(review._id); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Edit Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="p-1">
                      <Star size={20} className={star <= form.rating ? 'text-gold fill-gold' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review</label>
                <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} rows={4} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isApproved} onChange={(e) => setForm({ ...form, isApproved: e.target.checked })} className="rounded border-border" />
                <span className="text-sm font-medium">Approved</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

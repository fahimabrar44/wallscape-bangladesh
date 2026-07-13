'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    material: '',
    color: '',
    pattern: '',
    rollSize: '',
    coverageArea: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    images: [''],
    description: '',
    specifications: '',
    isInstallationAvailable: false,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    tags: '',
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/api/categories'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/products', data),
    onSuccess: () => {
      toast.success('Product created');
      router.push('/admin/products');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to create product'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.category) { toast.error('Category is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    if (form.price <= 0) { toast.error('Price must be greater than 0'); return; }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const images = form.images.filter(img => img.trim());
    createMutation.mutate({
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      tags,
      images,
    });
  };

  const updateField = (field: string, value: any) => setForm({ ...form, [field]: value });
  const updateImage = (index: number, value: string) => {
    const images = [...form.images];
    images[index] = value;
    updateField('images', images);
  };
  const addImage = () => updateField('images', [...form.images, '']);
  const removeImage = (index: number) => {
    if (form.images.length <= 1) return;
    updateField('images', form.images.filter((_, i) => i !== index));
  };

  const categories = catData?.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-6 max-w-3xl">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select value={form.category} onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (৳) *</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Price</label>
            <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input type="text" value={form.material} onChange={(e) => updateField('material', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input type="text" value={form.color} onChange={(e) => updateField('color', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pattern</label>
            <input type="text" value={form.pattern} onChange={(e) => updateField('pattern', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input type="text" value={form.brand} onChange={(e) => updateField('brand', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Roll Size</label>
            <input type="text" value={form.rollSize} onChange={(e) => updateField('rollSize', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Coverage Area</label>
          <input type="text" value={form.coverageArea} onChange={(e) => updateField('coverageArea', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium mb-1">Specifications (HTML)</label>
          <textarea value={form.specifications} onChange={(e) => updateField('specifications', e.target.value)} rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Images (URLs)</label>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={img} onChange={(e) => updateImage(i, e.target.value)}
                  placeholder={`Image URL ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button type="button" onClick={() => removeImage(i)}
                  className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addImage}
            className="mt-2 text-sm text-primary hover:underline">+ Add image</button>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={(e) => updateField('tags', e.target.value)}
            placeholder="e.g. premium, waterproof, floral"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'isFeatured', label: 'Featured' },
            { key: 'isNewArrival', label: 'New Arrival' },
            { key: 'isBestSeller', label: 'Best Seller' },
            { key: 'isInstallationAvailable', label: 'Installation' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(form as any)[key]} onChange={(e) => updateField(key, e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary/20" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Link href="/admin/products"
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</Link>
          <button type="submit" disabled={createMutation.isPending}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition">
            {createMutation.isPending ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

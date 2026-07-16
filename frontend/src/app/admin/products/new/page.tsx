'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { ArrowLeft, Upload, Package, Grid3X3, Palette, Ruler, Tag, DollarSign, Layers, Image } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    productCode: '',
    category: '',
    brand: '',
    material: '',
    color: '',
    pattern: '',
    rollSize: '',
    coverageArea: '',
    room: '',
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
      productCode: form.productCode.trim() || undefined,
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

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Icon size={16} className="text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );

  const inputClass = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        {/* Basic Info */}
        <Section title="Basic Information" icon={Package}>
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="e.g. Premium PVC Wallpaper" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Code</label>
              <input type="text" value={form.productCode} onChange={(e) => updateField('productCode', e.target.value)} className={inputClass} placeholder="WS-00001 (auto if empty)" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className={inputClass}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Pricing & Stock */}
        <Section title="Pricing & Stock" icon={DollarSign}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (৳) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Price</label>
              <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} className={inputClass} />
            </div>
          </div>
        </Section>

        {/* Product Details */}
        <Section title="Product Details" icon={Grid3X3}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Material</label>
              <input type="text" value={form.material} onChange={(e) => updateField('material', e.target.value)} className={inputClass} placeholder="e.g. PVC, Vinyl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input type="text" value={form.color} onChange={(e) => updateField('color', e.target.value)} className={inputClass} placeholder="e.g. White, Beige" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pattern</label>
              <input type="text" value={form.pattern} onChange={(e) => updateField('pattern', e.target.value)} className={inputClass} placeholder="e.g. Floral, Geometric" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input type="text" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} className={inputClass} placeholder="e.g. Wallscape, LG" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room</label>
              <select value={form.room} onChange={(e) => updateField('room', e.target.value)} className={inputClass}>
                <option value="">Select room</option>
                {['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Kids Room', 'Office', 'Hallway', 'Dining Room'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Dimensions */}
        <Section title="Dimensions & Coverage" icon={Ruler}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Roll Size</label>
              <input type="text" value={form.rollSize} onChange={(e) => updateField('rollSize', e.target.value)} className={inputClass} placeholder="e.g. 0.53m x 10m" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Coverage Area</label>
              <input type="text" value={form.coverageArea} onChange={(e) => updateField('coverageArea', e.target.value)} className={inputClass} placeholder="e.g. 5.3 sqm per roll" />
            </div>
          </div>
        </Section>

        {/* Description */}
        <Section title="Description & Specs" icon={Layers}>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} className={`${inputClass} resize-y`} placeholder="Detailed product description..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Specifications (HTML)</label>
            <textarea value={form.specifications} onChange={(e) => updateField('specifications', e.target.value)} rows={3} className={`${inputClass} resize-y font-mono text-xs`} placeholder="<ul><li>Feature 1</li><li>Feature 2</li></ul>" />
          </div>
        </Section>

        {/* Images */}
        <Section title="Images" icon={Image}>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="flex items-start gap-2 p-3 border border-border rounded-xl bg-gray-50">
                <CloudinaryUpload
                  currentImage={img}
                  onUpload={(url) => updateImage(i, url)}
                  onRemove={() => removeImage(i)}
                />
                <div className="flex flex-col gap-1">
                  <input type="text" value={img} onChange={(e) => updateImage(i, e.target.value)}
                    placeholder="Image URL"
                    className="w-44 px-2 py-1.5 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 bg-white" />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImage(i)}
                      className="text-xs text-red-400 hover:text-red-600 self-end px-1">Remove</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addImage}
              className="w-28 h-28 rounded-xl border-2 border-dashed border-border hover:border-primary transition flex flex-col items-center justify-center gap-1 text-muted hover:text-primary text-xs bg-gray-50/50">
              <Upload size={18} />
              Add Image
            </button>
          </div>
        </Section>

        {/* Tags & Toggles */}
        <Section title="Marketing" icon={Tag}>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => updateField('tags', e.target.value)}
              placeholder="e.g. premium, waterproof, floral" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'isFeatured', label: 'Featured' },
              { key: 'isNewArrival', label: 'New Arrival' },
              { key: 'isBestSeller', label: 'Best Seller' },
              { key: 'isInstallationAvailable', label: 'Installation Available' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-border hover:bg-gray-50 transition">
                <input type="checkbox" checked={(form as any)[key]} onChange={(e) => updateField(key, e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary/20" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Link href="/admin/products"
            className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</Link>
          <button type="submit" disabled={createMutation.isPending}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition">
            {createMutation.isPending ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

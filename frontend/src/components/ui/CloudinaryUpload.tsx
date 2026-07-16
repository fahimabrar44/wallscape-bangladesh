'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Upload, X, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
}

export default function CloudinaryUpload({ onUpload, onRemove, currentImage }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { signature, timestamp, cloudName, apiKey, folder } = await api.get<{ signature: string; timestamp: number; cloudName: string; apiKey: string; folder: string }>('/api/upload/signature');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', String(timestamp));
      formData.append('api_key', apiKey);
      formData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const url = data.secure_url as string;

      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleRemove() {
    setPreview('');
    onRemove?.();
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {preview ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary transition flex items-center justify-center disabled:opacity-50"
        >
          {uploading ? <Loader2 size={20} className="animate-spin text-muted" /> : <Upload size={20} className="text-muted" />}
        </button>
      )}
    </div>
  );
}

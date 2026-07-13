'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { api } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { Project } from '@/types';
import { FolderOpen, MapPin, Calendar } from 'lucide-react';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<{ projects: Project[] }>('/api/projects?isPublished=true'),
  });

  const projects = data?.projects || [];
  const categories = [...new Set(projects.map((p) => p.category))];
  const filtered = activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Our Projects</h1>
        <p className="text-muted">Explore our completed wallpaper and interior projects</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-white border border-border hover:border-primary'}`}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white border border-border hover:border-primary'}`}>{cat}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-gray-200" />
              <div className="p-5 space-y-2"><div className="h-4 bg-gray-200 rounded w-2/3" /><div className="h-3 bg-gray-200 rounded w-full" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div key={project._id} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={getImageUrl(project.images?.[0] || '')} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                <span className="text-xs text-primary font-medium bg-primary/5 px-2 py-1 rounded">{project.category}</span>
                <h3 className="font-semibold mt-2 mb-1 group-hover:text-primary transition">{project.title}</h3>
                <p className="text-sm text-muted line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                  {project.location && <span className="flex items-center gap-1"><MapPin size={12} />{project.location}</span>}
                  {project.completionDate && <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(project.completionDate)}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

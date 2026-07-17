'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl, formatDate } from '@/lib/utils';
import type { Project } from '@/types';
import { MapPin, Calendar } from 'lucide-react';

export default function ProjectClient({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = [...new Set(projects.map((p) => p.category))];
  const filtered = activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setActiveCategory('all')} className={activeCategory === 'all' ? 'btn-primary' : 'btn-ghost'}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={activeCategory === cat ? 'btn-primary' : 'btn-ghost'}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <div key={project._id} className="group card-modern overflow-hidden hover:shadow-lg transition-all">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={getImageUrl(project.images?.[0] || '')} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </div>
            <div className="p-5">
              <span className="badge-primary">{project.category}</span>
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
    </>
  );
}

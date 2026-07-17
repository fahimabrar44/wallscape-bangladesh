import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-api';
import type { Project } from '@/types';
import ProjectClient from './project-client';

export const metadata: Metadata = {
  title: 'Projects - WALLSCAPE BANGLADESH',
  description: 'Explore our completed wallpaper and interior design projects across Bangladesh.',
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try { const d = await serverFetch<{ projects: Project[] }>('/api/projects?isPublished=true'); projects = d.projects; } catch {}

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">Our Projects</h1>
        <p className="text-muted">Explore our completed wallpaper and interior projects</p>
      </div>
      <ProjectClient projects={projects} />
    </div>
  );
}

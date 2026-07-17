import type { Metadata } from 'next';
import { Ruler } from 'lucide-react';
import WallAreaClient from './wall-area-client';

export const metadata: Metadata = {
  title: 'Wall Area Calculator - WALLSCAPE BANGLADESH',
  description: 'Calculate the total wall area for your wallpaper installation project.',
};

export default function WallAreaCalculator() {
  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Ruler size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-gradient text-2xl lg:text-3xl font-bold">Wall Area Calculator</h1>
            <p className="text-muted text-sm">Calculate the total wall area for your project</p>
          </div>
        </div>
        <WallAreaClient />
      </div>
    </div>
  );
}

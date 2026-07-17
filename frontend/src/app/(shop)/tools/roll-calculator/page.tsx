import type { Metadata } from 'next';
import { Calculator } from 'lucide-react';
import RollCalcClient from './roll-calc-client';

export const metadata: Metadata = {
  title: 'Wallpaper Roll Calculator - WALLSCAPE BANGLADESH',
  description: 'Calculate how many rolls of wallpaper you need for your project.',
};

export default function RollCalculator() {
  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Calculator size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-gradient text-2xl lg:text-3xl font-bold">Wallpaper Roll Calculator</h1>
            <p className="text-muted text-sm">Estimate how many rolls you need</p>
          </div>
        </div>
        <RollCalcClient />
      </div>
    </div>
  );
}

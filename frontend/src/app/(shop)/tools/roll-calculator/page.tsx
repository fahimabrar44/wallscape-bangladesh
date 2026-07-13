'use client';

import { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export default function RollCalculator() {
  const [wallArea, setWallArea] = useState(0);
  const [rollCoverage, setRollCoverage] = useState(28.5);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (wallArea <= 0) return;
    const rolls = Math.ceil(wallArea / rollCoverage);
    setResult(rolls);
  };

  const reset = () => { setWallArea(0); setRollCoverage(28.5); setResult(null); };

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Calculator size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Wallpaper Roll Calculator</h1>
            <p className="text-muted text-sm">Estimate how many rolls you need</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Total Wall Area (sq ft)</label>
            <input type="number" value={wallArea || ''} onChange={(e) => setWallArea(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 280" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Roll Coverage (sq ft) <span className="text-muted font-normal">— Standard: 28.5 sq ft</span></label>
            <input type="number" value={rollCoverage || ''} onChange={(e) => setRollCoverage(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={calculate} className="flex-1 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition">Calculate</button>
            <button onClick={reset} className="flex items-center gap-1 px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-gray-50 transition"><RotateCcw size={16} /> Reset</button>
          </div>
        </div>

        {result !== null && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6">
            <h3 className="font-semibold mb-2">You Need</h3>
            <p className="text-3xl font-bold text-primary">{result} roll{result > 1 ? 's' : ''}</p>
            <p className="text-sm text-muted mt-1">Based on {wallArea} sq ft wall area and {rollCoverage} sq ft per roll</p>
            <p className="text-xs text-muted mt-2">* We recommend buying 1 extra roll for pattern matching and waste</p>
          </div>
        )}
      </div>
    </div>
  );
}

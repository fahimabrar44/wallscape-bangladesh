'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function RollCalcClient() {
  const [wallArea, setWallArea] = useState(0);
  const [rollCoverage, setRollCoverage] = useState(28.5);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => { if (wallArea > 0) setResult(Math.ceil(wallArea / rollCoverage)); };
  const reset = () => { setWallArea(0); setRollCoverage(28.5); setResult(null); };

  return (
    <>
      <div className="card-modern p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Total Wall Area (sq ft)</label>
          <input type="number" value={wallArea || ''} onChange={(e) => setWallArea(parseFloat(e.target.value) || 0)}
            className="input-modern" placeholder="e.g. 280" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Roll Coverage (sq ft) <span className="text-muted font-normal">Standard: 28.5 sq ft</span>
          </label>
          <input type="number" value={rollCoverage || ''} onChange={(e) => setRollCoverage(parseFloat(e.target.value) || 0)} className="input-modern" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">Calculate</button>
          <button onClick={reset} className="btn-ghost"><RotateCcw size={16} /> Reset</button>
        </div>
      </div>

      {result !== null && (
        <div className="card-modern p-6 mt-6">
          <h3 className="font-semibold mb-2">You Need</h3>
          <p className="text-3xl font-bold text-gradient">{result} roll{result > 1 ? 's' : ''}</p>
          <p className="text-sm text-muted mt-1">Based on {wallArea} sq ft wall area and {rollCoverage} sq ft per roll</p>
          <p className="text-xs text-muted mt-2">* We recommend buying 1 extra roll for pattern matching and waste</p>
        </div>
      )}
    </>
  );
}

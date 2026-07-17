'use client';

import { useState } from 'react';
import { Plus, X, RotateCcw } from 'lucide-react';

export default function WallAreaClient() {
  const [walls, setWalls] = useState([{ height: 0, width: 0 }]);
  const [result, setResult] = useState<number | null>(null);

  const addWall = () => setWalls([...walls, { height: 0, width: 0 }]);
  const removeWall = (i: number) => setWalls(walls.filter((_, idx) => idx !== i));
  const updateWall = (i: number, field: 'height' | 'width', value: number) => {
    const updated = [...walls];
    updated[i][field] = value;
    setWalls(updated);
  };
  const calculate = () => setResult(walls.reduce((sum, w) => sum + w.height * w.width, 0));
  const reset = () => { setWalls([{ height: 0, width: 0 }]); setResult(null); };

  return (
    <>
      <div className="card-modern p-6 space-y-5">
        {walls.map((wall, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted mb-1">Height (ft)</label>
              <input type="number" value={wall.height || ''} onChange={(e) => updateWall(i, 'height', parseFloat(e.target.value) || 0)} className="input-modern text-sm" placeholder="0" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted mb-1">Width (ft)</label>
              <input type="number" value={wall.width || ''} onChange={(e) => updateWall(i, 'width', parseFloat(e.target.value) || 0)} className="input-modern text-sm" placeholder="0" />
            </div>
            {walls.length > 1 && <button onClick={() => removeWall(i)} className="btn-ghost p-2 text-red-500"><X size={16} /></button>}
          </div>
        ))}
        <button onClick={addWall} className="btn-ghost text-sm"><Plus size={16} /> Add another wall</button>

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">Calculate</button>
          <button onClick={reset} className="btn-ghost"><RotateCcw size={16} /> Reset</button>
        </div>
      </div>

      {result !== null && result > 0 && (
        <div className="card-modern p-6 mt-6">
          <h3 className="font-semibold mb-2">Result</h3>
          <p className="text-3xl font-bold text-gradient">{result.toFixed(2)} sq ft</p>
          <p className="text-sm text-muted mt-1">Total wall area</p>
        </div>
      )}
    </>
  );
}

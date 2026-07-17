'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem { q: string; a: string; }
interface FAQGroup { category: string; items: FAQItem[]; }

export default function FAQClient({ faqs }: { faqs: FAQGroup[] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const allCategories = ['all', ...faqs.map((g) => g.category)];
  const filtered = activeTab === 'all' ? faqs : faqs.filter((g) => g.category === activeTab);
  const toggle = (key: string) => setOpenIndex(openIndex === key ? null : key);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((cat) => (
          <button key={cat} onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
            className={activeTab === cat ? 'btn-primary' : 'btn-ghost'}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {filtered.map((group) => (
        <div key={group.category} className="mb-8">
          <h2 className="section-label mb-4">{group.category}</h2>
          <div className="space-y-2">
            {group.items.map((item, idx) => {
              const key = `${group.category}-${idx}`;
              const isOpen = openIndex === key;
              return (
                <div key={key} className="card-modern overflow-hidden">
                  <button onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-sm lg:text-base hover:bg-gray-50/50 transition">
                    <span>{item.q}</span>
                    <ChevronDown size={18} className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 pb-4 text-sm text-muted leading-relaxed">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

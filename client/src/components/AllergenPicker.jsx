import React, { useState, useMemo } from 'react';
import { ALLERGEN_LIST } from '../constants/allergens';
import { Search, ChevronDown, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

const BIG_8 = ['peanuts', 'milk', 'eggs', 'wheat', 'fish', 'soybean', 'sesame', 'mustard'];

export default function AllergenPicker({ mode, selected, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCats, setExpandedCats] = useState({});
  const isDonor = mode === 'donor';

  const toggleAllergen = (id) => {
    onChange(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };

  const toggleCategory = (cat) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const selectBig8 = () => {
    onChange([...new Set([...selected, ...BIG_8])]);
  };

  const categories = useMemo(() => {
    const filtered = ALLERGEN_LIST.filter(a =>
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || [];
      acc[curr.category].push(curr);
      return acc;
    }, {});
  }, [searchTerm]);

  const activeColor = isDonor ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-red-200 bg-red-50 text-red-600';
  const countColor = isDonor ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden text-sm shadow-sm">
      {/* Search bar */}
      <div className="p-3 border-b border-slate-200 flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text" placeholder="Search ingredients…"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition"
          />
        </div>
        <button type="button" onClick={selectBig8}
          className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-500 transition">
          <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">8</span>
          Quick-select common allergens (Big-8)
        </button>
      </div>

      {/* Category list */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
        {Object.entries(categories).map(([category, items]) => {
          const selectedCount = items.filter(i => selected.includes(i.id)).length;
          const isExpanded = searchTerm.length > 0 || expandedCats[category];

          return (
            <div key={category}>
              <button type="button"
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition text-slate-600"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  {category}
                </div>
                {selectedCount > 0 && (
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-bold', countColor)}>
                    {selectedCount} ✓
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {items.map(item => {
                    const isSelected = selected.includes(item.id);
                    return (
                      <button key={item.id} type="button" onClick={() => toggleAllergen(item.id)}
                        className={clsx(
                          'flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-all',
                          isSelected ? activeColor : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        )}>
                        {isSelected && <Check size={11} />}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {Object.keys(categories).length === 0 && (
          <div className="text-slate-500 text-center py-8 text-sm">No ingredients found</div>
        )}
      </div>

      {/* Footer summary */}
      <div className="px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 text-center font-medium bg-slate-50">
        {selected.length === 0
          ? 'None selected'
          : isDonor ? `${selected.length} ingredients marked as used` : `${selected.length} allergens to avoid`}
      </div>
    </div>
  );
}

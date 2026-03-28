import React, { useState, useMemo } from 'react';
import { ALLERGEN_LIST } from '../constants/allergens';
import { Search, ChevronDown, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

const BIG_8 = ['peanuts', 'milk', 'eggs', 'wheat', 'fish', 'soybean', 'sesame', 'mustard_seed'];

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

  const toggleBig8 = () => {
    const allBig8Selected = BIG_8.every(id => selected.includes(id));
    if (allBig8Selected) {
      onChange(selected.filter(id => !BIG_8.includes(id)));
    } else {
      onChange([...new Set([...selected, ...BIG_8])]);
    }
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

  // Pill states: unchecked=grey border | donor-checked=amber #EF9F27 | needer-checked=red #E24B4A
  const getPillStyles = (isSelected) => {
    if (!isSelected) return 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50';
    if (isDonor) return 'border-[#EF9F27] bg-[#EF9F27]/10 text-[#EF9F27] font-bold';
    return 'border-[#E24B4A] bg-[#E24B4A] text-white font-bold';
  };

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
        <button type="button" onClick={toggleBig8}
          className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-500 transition">
          <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">8</span>
          Quick-select "Big 8" allergens (toggle)
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
                  {category} ({selectedCount})
                </div>
                {selectedCount > 0 && (
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700')}>
                    {selectedCount} selected
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
                          'group relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95',
                          getPillStyles(isSelected)
                        )}>
                        {isSelected && <Check size={11} className="animate-in fade-in zoom-in duration-300" />}
                        {item.label}
                        {BIG_8.includes(item.id) && (
                          <span className="absolute -top-1.5 -right-1 px-1 bg-rose-500 text-white text-[7px] font-black rounded-full border border-white shadow-sm scale-90">8</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 text-center font-medium bg-slate-50">
        {selected.length === 0
          ? 'None selected'
          : isDonor ? `[${selected.length}] ingredients marked as used` : `[${selected.length}] allergens to avoid`}
      </div>
    </div>
  );
}

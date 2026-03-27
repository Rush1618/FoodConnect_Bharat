import React, { useState, useMemo } from 'react';
import { ALLERGEN_LIST } from '../constants/allergens';
import { Search, ChevronDown, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

const BIG_8 = ["peanuts", "milk", "eggs", "wheat", "fish", "soybean", "sesame", "mustard"];

export default function AllergenPicker({ mode, selected, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCats, setExpandedCats] = useState({});

  const isDonor = mode === 'donor';

  const toggleAllergen = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(item => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCats(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const selectBig8 = () => {
    const newSelected = [...new Set([...selected, ...BIG_8])];
    onChange(newSelected);
  };

  const categories = useMemo(() => {
    const filtered = ALLERGEN_LIST.filter(a => 
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || [];
      acc[curr.category].push(curr);
      return acc;
    }, {});

    return grouped;
  }, [searchTerm]);

  const pillStyle = isDonor 
    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm' 
    : 'border-red-400 bg-red-50 text-red-900 shadow-sm';
  const pillCheckStyle = isDonor ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="w-full border rounded-xl overflow-hidden bg-white shadow-sm font-sans text-sm">
      <div className="p-4 border-b bg-gray-50 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search ingredients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          type="button"
          onClick={selectBig8}
          className="text-left flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors py-1"
        >
          <span className="bg-blue-100 text-blue-700 font-bold px-2 rounded-full text-xs py-0.5">8</span>
          Select common allergens (Big-8)
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto p-4 space-y-4">
        {Object.entries(categories).map(([category, items]) => {
          const selectedInCategory = items.filter(i => selected.includes(i.id)).length;
          const isExpanded = searchTerm.length > 0 || expandedCats[category];

          return (
            <div key={category} className="border border-gray-100 rounded-lg overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-gray-700"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {category}
                </div>
                {selectedInCategory > 0 && (
                  <span className={clsx("px-2 py-0.5 rounded-full text-xs", isDonor ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800")}>
                    {selectedInCategory} selected
                  </span>
                )}
              </button>
              
              {isExpanded && (
                <div className="p-3 flex flex-wrap gap-2">
                  {items.map(item => {
                    const isSelected = selected.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAllergen(item.id)}
                        className={clsx(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200",
                          isSelected ? pillStyle : "border-gray-300 hover:border-gray-400 bg-white text-gray-700"
                        )}
                      >
                        {isSelected && <Check size={14} className={pillCheckStyle} />}
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          );
        })}
        {Object.keys(categories).length === 0 && (
          <div className="text-gray-500 text-center py-6">No ingredients found.</div>
        )}
      </div>

      <div className="p-3 border-t bg-gray-50 text-gray-600 text-center font-medium">
        {selected.length === 0 ? (
          "None selected"
        ) : (
          isDonor 
            ? `${selected.length} ingredients marked as used` 
            : `${selected.length} allergens to avoid`
        )}
      </div>
    </div>
  );
}

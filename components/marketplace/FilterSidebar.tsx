
import React, { useState } from 'react';
import { 
  Filter, ChevronDown, Search, Zap, 
  Globe, Shield, Activity, 
  Clock, DollarSign, Link2, Languages,
  ChevronUp, CheckCircle2, LayoutGrid
} from 'lucide-react';
import { FilterState } from '../../pages/Marketplace';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Offering': true,
    'Metrics': true,
    'Traffic': true,
    'Category': true,
    'Price': true,
    'TAT': false,
    'Location': false,
    'LinkType': false,
    'Language': false
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateFilters = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (key: 'offerings' | 'categories' | 'tat' | 'locations' | 'linkTypes' | 'languages', label: string) => {
    const current = filters[key] as string[];
    const next = current.includes(label) 
      ? current.filter(item => item !== label) 
      : [...current, label];
    updateFilters(key, next);
  };

  const handleRange = (key: 'da' | 'dr' | 'priceRange' | 'traffic', index: 0 | 1, value: number) => {
    const current = [...filters[key]] as [number, number];
    current[index] = value;
    updateFilters(key, current);
  };

  const [categorySearch, setCategorySearch] = useState('');
  const allCategories = ['SaaS', 'Agriculture', 'Automotive', 'Blogging', 'Crypto', 'Education', 'Fintech', 'Healthcare', 'Real Estate', 'Tech', 'Health'];
  const filteredCategories = allCategories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()));

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm h-auto lg:h-[calc(100vh-160px)] lg:max-h-[85vh] flex flex-col overflow-hidden transition-all hover:shadow-md">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center text-white">
            <Filter size={14} strokeWidth={3} />
          </div>
          <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.1em]">Asset Filters</h2>
        </div>
        <button 
          onClick={() => setFilters({
            search: '', offerings: [], da: [0, 100], dr: [0, 100], traffic: [0, 1000000], categories: [], priceRange: [0, 5000], tat: [], locations: [], linkTypes: [], languages: []
          })}
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-sidebar-scroll divide-y divide-slate-50 pb-10">
        
        {/* 1. OFFERING TYPE - PRIORITY */}
        <FilterSection 
          title="Offering Protocol" 
          icon={<Zap size={14} className="text-orange-500" />}
          isOpen={expandedSections['Offering']} 
          onToggle={() => toggleSection('Offering')}
        >
          <div className="space-y-4">
            {['Brand Mention', 'Guest Post', 'Link Insertion'].map((label) => (
              <FilterCheckbox 
                key={label} 
                label={label} 
                checked={filters.offerings.includes(label)} 
                onChange={() => handleCheckbox('offerings', label)}
                isNew={label === 'Brand Mention'}
              />
            ))}
          </div>
        </FilterSection>

        {/* 2. AUTHORITY METRICS */}
        <FilterSection 
          title="Authority Metrics" 
          icon={<Shield size={14} className="text-blue-500" />}
          isOpen={expandedSections['Metrics']} 
          onToggle={() => toggleSection('Metrics')}
        >
          <div className="space-y-6">
            <MetricRange 
              label="Moz Domain Authority" 
              min={0} max={100} 
              current={filters.da[1]} 
              onChange={(v: number) => handleRange('da', 1, v)}
            />
            <MetricRange 
              label="Ahrefs Domain Rating" 
              min={0} max={100} 
              current={filters.dr[1]} 
              onChange={(v: number) => handleRange('dr', 1, v)}
            />
          </div>
        </FilterSection>

        {/* 3. ORGANIC TRAFFIC */}
        <FilterSection 
          title="Traffic Velocity" 
          icon={<Activity size={14} className="text-emerald-500" />}
          isOpen={expandedSections['Traffic']} 
          onToggle={() => toggleSection('Traffic')}
        >
          <div className="space-y-6">
            <MetricRange 
              label="Monthly Organic Min" 
              min={0} max={1000000} 
              step={1000}
              current={filters.traffic[0]} 
              onChange={(v: number) => handleRange('traffic', 0, v)}
              isTraffic
            />
            <div className="flex gap-2">
              {[1000, 5000, 10000, 50000].map(v => (
                <button 
                  key={v}
                  onClick={() => handleRange('traffic', 0, v)}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black border transition-all ${filters.traffic[0] === v ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                >
                  {v > 1000 ? v/1000 + 'k' : v}+
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* 4. PRICING */}
        <FilterSection 
          title="Liquidity Range" 
          icon={<DollarSign size={14} className="text-amber-500" />}
          isOpen={expandedSections['Price']} 
          onToggle={() => toggleSection('Price')}
        >
          <div className="space-y-6">
            <MetricRange 
              label="Max Budget ($)" 
              min={0} max={5000} 
              step={50}
              current={filters.priceRange[1]} 
              onChange={(v: number) => handleRange('priceRange', 1, v)}
            />
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Max USD</span>
                <input 
                  type="number" 
                  value={filters.priceRange[1]} 
                  onChange={(e) => handleRange('priceRange', 1, Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-black outline-none" 
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* 5. CATEGORY / NICHE */}
        <FilterSection 
          title="Niche Protocol" 
          icon={<LayoutGrid size={14} className="text-indigo-500" />}
          isOpen={expandedSections['Category']} 
          onToggle={() => toggleSection('Category')}
        >
          <div className="space-y-5">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={12} />
              <input 
                type="text" 
                placeholder="Search Category" 
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-[11px] font-bold text-slate-900 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto custom-sidebar-scroll pr-2">
              {filteredCategories.map((label) => (
                <FilterCheckbox 
                  key={label} 
                  label={label} 
                  checked={filters.categories.includes(label)} 
                  onChange={() => handleCheckbox('categories', label)}
                />
              ))}
            </div>
          </div>
        </FilterSection>

        {/* 6. DEPLOYMENT TAT */}
        <FilterSection 
          title="Deployment TAT" 
          icon={<Clock size={14} className="text-rose-500" />}
          isOpen={expandedSections['TAT']} 
          onToggle={() => toggleSection('TAT')}
        >
          <div className="space-y-3">
            {['1 Day', '3 Days', '5 Days', '7 Days'].map(t => (
              <FilterCheckbox 
                key={t} 
                label={t} 
                checked={filters.tat.includes(t)}
                onChange={() => handleCheckbox('tat', t)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 7. LINK PROTOCOL */}
        <FilterSection 
          title="Link Protocol" 
          icon={<Link2 size={14} className="text-slate-600" />}
          isOpen={expandedSections['LinkType']} 
          onToggle={() => toggleSection('LinkType')}
        >
          <div className="space-y-3">
            {['Dofollow', 'Nofollow', 'Permanent'].map(l => (
              <FilterCheckbox 
                key={l} 
                label={l} 
                checked={filters.linkTypes.includes(l)}
                onChange={() => handleCheckbox('linkTypes', l)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 8. LINGUISTIC GATEWAY */}
        <FilterSection 
          title="Linguistic Gateway" 
          icon={<Languages size={14} className="text-purple-500" />}
          isOpen={expandedSections['Language']} 
          onToggle={() => toggleSection('Language')}
        >
          <div className="space-y-3">
            {['English', 'Spanish', 'French', 'Hindi', 'German'].map((lang) => (
              <FilterCheckbox 
                key={lang} 
                label={lang} 
                checked={filters.languages.includes(lang)}
                onChange={() => handleCheckbox('languages', lang)}
              />
            ))}
          </div>
        </FilterSection>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

const FilterSection = ({ title, icon, isOpen, onToggle, children }: any) => (
  <div className="px-8 py-6">
    <button onClick={onToggle} className="flex items-center justify-between w-full group mb-4 outline-none">
      <div className="flex items-center gap-3">
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>
        <span className={`text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
          {title}
        </span>
      </div>
      {isOpen ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
    </button>
    {isOpen && <div className="animate-in slide-in-from-top-2 duration-300">{children}</div>}
  </div>
);

const FilterCheckbox = ({ label, checked, onChange, isNew }: any) => (
  <label className="flex items-center cursor-pointer group select-none py-1" onClick={(e) => { e.preventDefault(); onChange(); }}>
    <div className="relative flex items-center">
      <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/10' : 'border-slate-200 group-hover:border-slate-300'}`}>
        {checked && <CheckCircle2 size={12} strokeWidth={4} className="text-white" />}
      </div>
    </div>
    <span className={`ml-3.5 text-[11px] font-bold transition-colors tracking-tight ${checked ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
      {label}
      {isNew && <span className="ml-2.5 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">New</span>}
    </span>
  </label>
);

const MetricRange = ({ label, min, max, step = 1, current, onChange, isTraffic = false }: any) => {
  const percent = ((current - min) / (max - min)) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-blue-600">
          {isTraffic ? (current >= 1000 ? (current/1000).toFixed(0) + 'k' : current) : current}+
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-slate-100 rounded-full cursor-pointer group">
        <div className="absolute h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
        <input 
          type="range" 
          min={min} max={max} step={step} value={current} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute h-4 w-4 bg-white border-2 border-slate-200 rounded-full top-1/2 -translate-y-1/2 pointer-events-none shadow-sm transition-all group-hover:scale-110 group-hover:border-blue-500" 
          style={{ left: `calc(${percent}% - 8px)` }}
        ></div>
      </div>
    </div>
  );
};

export default FilterSidebar;

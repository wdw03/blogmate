
import React from 'react';
import { Search, Globe, Flower2, Dices, SlidersHorizontal, Sparkles, Zap } from 'lucide-react';

interface MarketplaceHeaderProps {
  niche?: string;
  setNiche?: (n: string) => void;
  sortBy?: 'newest' | 'top' | null;
  setSortBy?: (s: 'newest' | 'top' | null) => void;
  onSearch?: (val: string) => void;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ 
  niche = 'General', 
  setNiche, 
  sortBy, 
  setSortBy, 
  onSearch 
}) => {
  const niches = [
    { id: 'General', icon: <Globe size={14} />, label: 'GENERAL', color: 'blue' },
    { id: 'CBD', icon: <Flower2 size={14} />, label: 'CBD', color: 'emerald' },
    { id: 'Casino', icon: <Dices size={14} />, label: 'CASINO', color: 'rose' }
  ];

  const handleSortToggle = (type: 'newest' | 'top') => {
    if (sortBy === type) {
      setSortBy?.(null);
    } else {
      setSortBy?.(type);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-8 p-6 mb-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm transition-all">
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-center p-1.5 bg-slate-100/50 border border-slate-200 rounded-2xl shadow-inner">
           {niches.map(n => (
             <button 
              key={n.id}
              onClick={() => setNiche?.(n.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                niche === n.id 
                  ? `bg-white text-blue-600 shadow-xl border border-slate-100 scale-105` 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
             >
               {n.icon}
               <span>{n.label}</span>
             </button>
           ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleSortToggle('newest')}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-full border-2 transition-all shadow-sm ${
              sortBy === 'newest' 
                ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/20 scale-105' 
                : 'border-orange-500/20 text-orange-600 bg-white hover:bg-orange-50 hover:shadow-orange-500/10'
            } text-[11px] font-black uppercase tracking-widest`}
          >
            <Sparkles size={14} className={sortBy === 'newest' ? 'animate-pulse' : ''} /> 
            NEWLY_ADDED
          </button>
          
          <button 
            onClick={() => handleSortToggle('top')}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-full border-2 transition-all shadow-sm ${
              sortBy === 'top' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20 scale-105' 
                : 'border-indigo-500/20 text-indigo-600 bg-white hover:bg-indigo-50 hover:shadow-indigo-500/10'
            } text-[11px] font-black uppercase tracking-widest`}
          >
            <Zap size={14} fill={sortBy === 'top' ? "currentColor" : "none"} /> 
            TOP_SELLING
          </button>
        </div>
      </div>

      <div className="relative w-full xl:w-[480px] group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
           <Search size={22} strokeWidth={3} />
        </div>
        <input 
          type="text" 
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="SEARCH ASSET INVENTORY..." 
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-16 pr-16 py-5 text-[14px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-all">
           <SlidersHorizontal size={20} />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;


import React, { useState, useEffect } from 'react';
import { Search, Globe, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  const [domainCount, setDomainCount] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const fetchDomainCount = async () => {
      try {
        const { count, error } = await supabase
          .from('domains')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          setDomainCount(count);
        }
      } catch (err) {
        console.error('Error fetching domain count:', err);
      }
    };
    fetchDomainCount();
  }, []);

  const niches = [
    { 
      id: 'General', 
      icon: <img src="/assets/images/17940458.png" alt="General" className="w-[clamp(1rem,1.4vw,1.35rem)] h-[clamp(1rem,1.4vw,1.35rem)] object-contain" />, 
      label: 'GENERAL', 
      color: 'blue' 
    },
    { 
      id: 'Grey Niche', 
      icon: <img src="/assets/images/17095398.png" alt="Grey Niche" className="w-[clamp(1rem,1.4vw,1.35rem)] h-[clamp(1rem,1.4vw,1.35rem)] object-contain" />, 
      label: 'GREY NICHE', 
      color: 'rose' 
    }
  ];

  const handleSortToggle = (type: 'newest' | 'top') => {
    if (sortBy === type) {
      setSortBy?.(null);
    } else {
      setSortBy?.(type);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 p-4 sm:p-6 mb-8 bg-white border border-slate-200 rounded-[2rem] sm:rounded-[3rem] shadow-sm transition-all w-full min-w-0">
      <div className="flex flex-row flex-wrap items-center justify-center xl:justify-start gap-3 sm:gap-4 w-full xl:w-auto">
        <div className="flex flex-row flex-wrap items-center justify-center p-1.5 bg-slate-100/50 border border-slate-200 rounded-2xl shadow-inner gap-1.5">
           {niches.map(n => (
             <button 
              key={n.id}
              onClick={() => setNiche?.(n.id)}
              className={`flex items-center justify-center gap-2 px-[clamp(0.75rem,1.5vw,1.75rem)] py-[clamp(0.5rem,1vw,0.85rem)] rounded-xl text-[clamp(0.65rem,1.1vw,0.85rem)] font-black uppercase tracking-widest transition-all ${
                niche === n.id 
                  ? `bg-white text-blue-600 shadow-xl border border-slate-100 scale-105 z-10` 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
             >
               {n.icon}
               <span>{n.label}</span>
             </button>
           ))}
        </div>

        <button 
          onClick={() => handleSortToggle('top')}
          className={`flex items-center justify-center gap-2 px-[clamp(1rem,2vw,2rem)] py-[clamp(0.6rem,1.1vw,0.95rem)] rounded-full border-2 transition-all shadow-sm ${
            sortBy === 'top' 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20 scale-105' 
              : 'border-indigo-500/20 text-indigo-600 bg-white hover:bg-indigo-50 hover:shadow-indigo-500/10'
          } text-[clamp(0.65rem,1.1vw,0.85rem)] font-black uppercase tracking-widest`}
        >
          <img src="/assets/images/2534215.png" alt="Top Selling" className="w-[clamp(1rem,1.4vw,1.35rem)] h-[clamp(1rem,1.4vw,1.35rem)] object-contain" />
          TOP_SELLING
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSearch?.(searchVal); }} className="w-full xl:w-[520px] flex flex-col gap-2 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_-20px_rgba(15,23,42,.2)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900">
        <label className="flex items-center gap-2 px-2 pt-1 text-left text-[9px] font-black uppercase tracking-[.16em] text-slate-400">
          <Globe size={13} className="text-blue-500" /> Search {domainCount !== null ? `${domainCount}` : '...'} verified websites
        </label>
        <div className="flex min-w-0 items-center gap-3 py-1.5 px-1">
          <span className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-inner">
            <img src="/assets/images/searchicons.png" alt="Search" className="w-7 h-7 object-contain" />
          </span>
          <input 
            type="text" 
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); onSearch?.(e.target.value); }}
            aria-label="Search domains"
            placeholder="SEARCH ASSET INVENTORY..." 
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base sm:text-lg font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <button type="submit" className="hidden shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-slate-950 sm:flex">
            Search domains <ArrowRight size={15} />
          </button>
        </div>
        <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[9px] font-black uppercase tracking-wider text-white transition active:scale-[.98] sm:hidden">
          Search domains <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
};

export default MarketplaceHeader;


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
    <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 p-3.5 sm:p-5 mb-8 bg-white border border-slate-200/80 rounded-[1.75rem] sm:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all w-full min-w-0 dark:bg-slate-900 dark:border-white/10">
      <div className="flex flex-row flex-nowrap items-center justify-start lg:justify-start gap-2.5 sm:gap-3.5 w-full lg:w-auto overflow-x-auto no-scrollbar max-w-full pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-row flex-nowrap items-center justify-center p-1 sm:p-1.5 bg-slate-100/70 border border-slate-200/80 rounded-2xl shadow-inner gap-1 sm:gap-1.5 shrink-0 dark:bg-slate-800/60 dark:border-white/10">
          {niches.map(n => (
            <button
              key={n.id}
              onClick={() => setNiche?.(n.id)}
              className={`flex items-center justify-center gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${niche === n.id
                ? `bg-white text-blue-600 shadow-md shadow-blue-500/5 border border-slate-200/80 ring-2 ring-blue-500/10 z-10 dark:bg-slate-900 dark:text-blue-400 dark:border-white/10`
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              {n.icon}
              <span>{n.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleSortToggle('top')}
          className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border-2 transition-all shadow-sm whitespace-nowrap shrink-0 ${sortBy === 'top'
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30'
            : 'border-indigo-500/20 text-indigo-600 bg-white hover:bg-indigo-50/50 hover:border-indigo-500/40 hover:shadow dark:bg-slate-900 dark:text-indigo-400 dark:border-indigo-500/30'
            } text-xs sm:text-[13px] font-black uppercase tracking-wider`}
        >
          <img src="/assets/images/2534215.png" alt="Top Selling" className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain" />
          TOP_SELLING
        </button>
      </div>

      <form onSubmit={(e) => { 
        e.preventDefault(); 
        onSearch?.(searchVal); 
        const el = document.getElementById('inventory-list');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} className="w-full lg:w-[400px] xl:w-[440px] flex flex-col gap-1.5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-1.5 sm:p-2 shadow-[0_15px_40px_-15px_rgba(15,23,42,.12)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900">
        <label className="flex items-center gap-1.5 px-2 pt-0.5 text-left text-[9px] font-black uppercase tracking-[.16em] text-slate-400">
          <Globe size={12} className="text-blue-500" /> Search {domainCount !== null ? `${domainCount}` : '...'} verified websites
        </label>
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 py-0.5 px-1">
          <span className="ml-1 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-inner">
            <img src="/assets/images/searchicons.png" alt="Search" className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain" />
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); onSearch?.(e.target.value); }}
            aria-label="Search domains"
            placeholder="Search Guest Post Sites..."
            className="min-w-0 flex-1 bg-transparent px-2 sm:px-2.5 py-1.5 text-sm sm:text-base font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <button type="submit" className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 sm:px-4 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-slate-950 active:scale-95 shadow-md shadow-blue-500/20">
            Search <ArrowRight size={14} className="hidden xs:inline sm:inline" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarketplaceHeader;


import React, { useEffect, useState, useMemo } from 'react';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader';
import DomainItem from '../components/marketplace/DomainItem';
import { MozLogo, AhrefsLogo } from '../components/icons/Logos';
import { supabase } from '../lib/supabase';
import { Loader2, MoreHorizontal, AlertCircle } from 'lucide-react';

export interface FilterState {
  search: string;
  offerings: string[];
  da: [number, number];
  dr: [number, number];
  traffic: [number, number];
  categories: string[];
  priceRange: [number, number];
  tat: string[];
  locations: string[];
  linkTypes: string[];
  languages: string[];
}

const Marketplace: React.FC<{
  isSection?: boolean;
  onAddToCart?: (item: any) => void;
  niche?: string;
  setNiche?: (n: string) => void;
}> = ({ isSection = false, onAddToCart, niche = 'General', setNiche }) => {
  const [domains, setDomains] = useState<any[]>([]);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'top' | null>(null);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    offerings: [],
    da: [0, 100],
    dr: [0, 100],
    traffic: [0, 1000000],
    categories: [],
    priceRange: [0, 5000],
    tat: [],
    locations: [],
    linkTypes: [],
    languages: []
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: doms, error: domErr }, { data: rules, error: rulesErr }] = await Promise.all([
        supabase.from('domains').select('*').order('created_at', { ascending: false }),
        supabase.from('pricing_rules').select('*')
      ]);

      if (domErr) throw domErr;
      if (rulesErr) throw rulesErr;

      setDomains(doms || []);
      setPricingRules(rules || []);
    } catch (err: any) {
      setError('Failed to load websites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getPricingInfo = (basePrice: number) => {
    const rule = pricingRules.find(r => basePrice >= r.min_price && basePrice <= r.max_price);
    if (rule) {
        return {
          original: basePrice,
          discounted: Math.round(basePrice * (1 - rule.discount_percent / 100)),
          percent: rule.discount_percent
        };
    }
    return {
      original: basePrice,
      discounted: basePrice,
      percent: 0
    };
  };

  const filteredAndSortedDomains = useMemo(() => {
    let result = domains.filter(d => {
      const matchesSearch = d.domain.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDA = d.da >= filters.da[0] && d.da <= filters.da[1];
      const matchesDR = (d.dr || 0) >= filters.dr[0] && (d.dr || 0) <= filters.dr[1];
      const trafficNum = parseInt(d.traffic?.replace(/[^0-9]/g, '') || '0');
      const matchesTraffic = trafficNum >= filters.traffic[0] && trafficNum <= filters.traffic[1];
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(d.category);
      
      const multiplier = niche === 'Casino' ? 3 : (niche === 'CBD' ? 1.5 : 1);
      const pricing = getPricingInfo(d.price_guest_post);
      const activePrice = pricing.discounted * multiplier;
      
      const matchesPrice = activePrice >= filters.priceRange[0] && activePrice <= filters.priceRange[1];
      const matchesTAT = filters.tat.length === 0 || filters.tat.some(t => d.tat?.toLowerCase().includes(t.toLowerCase()));
      const matchesLinks = filters.linkTypes.length === 0 || filters.linkTypes.some(lt => d.backlinks?.toLowerCase().includes(lt.toLowerCase()));
      const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(d.language);
      const matchesOffering = filters.offerings.length === 0 || (
        (filters.offerings.includes('Guest Post') && d.price_guest_post > 0) ||
        (filters.offerings.includes('Link Insertion') && d.price_insertion > 0) ||
        (filters.offerings.includes('Brand Mention') && d.price_mention > 0)
      );

      return matchesSearch && matchesDA && matchesDR && matchesTraffic && matchesCategory && 
             matchesPrice && matchesTAT && matchesLinks && matchesLanguage && matchesOffering;
    });

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'top') {
      result = [...result].sort((a, b) => {
        const trfA = parseInt(a.traffic?.replace(/[^0-9]/g, '') || '0');
        const trfB = parseInt(b.traffic?.replace(/[^0-9]/g, '') || '0');
        return (trfB + b.da) - (trfA + a.da);
      });
    }

    return result;
  }, [domains, filters, niche, sortBy, pricingRules]);

  const totalPages = Math.ceil(filteredAndSortedDomains.length / itemsPerPage);
  const currentDomains = filteredAndSortedDomains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [filters, sortBy, niche]);

  return (
    <div className={`${isSection ? 'py-16' : 'pt-40 pb-32'} bg-[#f8fafc] min-h-screen relative`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1600px] relative">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <aside className="w-full lg:w-[320px] shrink-0 sticky top-[120px] z-[400]">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <main className="flex-1 min-w-0">
            <MarketplaceHeader 
              niche={niche} 
              setNiche={setNiche} 
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSearch={(val) => setFilters(prev => ({...prev, search: val}))} 
            />
            
            <div className="hidden xl:flex items-center px-10 py-6 bg-slate-950 rounded-[2rem] shadow-xl text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-white/5">
              <div className="w-[18%] text-blue-400">Website List</div>
              <div className="w-[10%] flex flex-col items-center gap-1.5">
                <MozLogo className="h-2.5 opacity-60 brightness-200" />
                <span className="leading-none">Authority</span>
              </div>
              <div className="w-[10%] flex flex-col items-center gap-1.5">
                <AhrefsLogo className="h-2.5 opacity-60 brightness-200" />
                <span className="leading-none">Growth</span>
              </div>
              <div className="w-[8%] text-center">Type</div>
              <div className="w-[10%] text-center">Safety</div>
              <div className="w-[9%] text-center">Post Cost</div>
              <div className="w-[10%] text-center">Link Cost</div>
              <div className="w-[10%] text-center text-slate-600">Mention</div>
              <div className="w-[15%] text-right pr-4"><MoreHorizontal size={18} className="inline opacity-20" /></div>
            </div>

            <div className="mt-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-60 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                  <Loader2 className="animate-spin text-blue-600" size={48} />
                  <span className="mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading Websites...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center py-40 text-rose-500 font-black uppercase bg-white rounded-[3rem] border border-rose-100 shadow-xl">{error}</div>
              ) : filteredAndSortedDomains.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-200 text-center px-10">
                  <AlertCircle size={48} className="text-slate-200 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">No Results Found</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase mt-4">Try changing your filters.</p>
                  <button onClick={() => {
                    setFilters({
                      search: '', offerings: [], da: [0, 100], dr: [0, 100], traffic: [0, 1000000], categories: [], priceRange: [0, 5000], tat: [], locations: [], linkTypes: [], languages: []
                    });
                    setSortBy(null);
                  }} className="mt-8 text-blue-600 font-black text-[10px] uppercase tracking-widest border-b-2 border-blue-600/20 hover:border-blue-600 transition-all">Reset All Filters</button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-6">
                    {currentDomains.map((d) => (
                      <DomainItem 
                        key={d.id}
                        domain={d.domain}
                        category={d.category}
                        da={d.da}
                        traffic={d.traffic}
                        visits={d.visits || '0'}
                        tat={d.tat || '1 day'}
                        backlinks={d.backlinks || '2 Dofollow'}
                        prices={{ 
                            guestPost: getPricingInfo(d.price_guest_post), 
                            insertion: getPricingInfo(d.price_insertion), 
                            mention: getPricingInfo(d.price_mention) 
                        }}
                        metrics={{ 
                          dr: d.dr, 
                          refDomains: d.ref_domains, 
                          totalBacklinks: d.total_backlinks, 
                          totalKeywords: d.total_keywords, 
                          authScore: d.auth_score || '26', 
                          spamScore: d.spam_score || '1%', 
                          trustFlow: d.trust_flow || '7', 
                          citationFlow: d.citation_flow || '39', 
                          language: d.language || 'English' 
                        }}
                        niche={niche}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-8 mt-16 py-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="flex items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 shadow-sm">
                        PREVIOUS
                      </button>
                      <div className="flex flex-col items-center">
                         <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1">Page</span>
                         <span className="text-[14px] font-black text-slate-900 tracking-tight">{currentPage} of {totalPages}</span>
                      </div>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="flex items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 shadow-sm">
                        NEXT
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

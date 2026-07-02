
import React, { useEffect, useState, useMemo } from 'react';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader';
import DomainItem from '../components/marketplace/DomainItem';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle, Filter } from 'lucide-react';

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
}> = ({ isSection = false, onAddToCart, niche: propNiche, setNiche: propSetNiche }) => {
  const [localNiche, setLocalNiche] = useState('General');
  const niche = propNiche !== undefined ? propNiche : localNiche;
  const setNiche = propSetNiche !== undefined ? propSetNiche : setLocalNiche;
  const [domains, setDomains] = useState<any[]>([]);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'top' | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState<FilterState>({
    search: new URLSearchParams(window.location.search).get('search') || '',
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

      if (domErr && !domErr.message.includes('does not exist')) throw domErr;
      if (rulesErr && !rulesErr.message.includes('does not exist')) throw rulesErr;

      let finalDomains = doms || [];
      if (finalDomains.length === 0) {
        const seedDomains = [
          { domain: 'techcrunch-insider.com', category: 'Technology', da: 72, dr: 68, traffic: '120K', price_guest_post: 250, price_insertion: 200, price_mention: 120, language: 'English', tat: '2 Days', backlinks: 'Dofollow', ref_domains: 3500, total_backlinks: 18000, total_keywords: 4200, auth_score: 45, spam_score: '2%', trust_flow: 32, citation_flow: 48 },
          { domain: 'health-digest-pro.com', category: 'Health', da: 55, dr: 50, traffic: '45K', price_guest_post: 150, price_insertion: 120, price_mention: 70, language: 'English', tat: '3 Days', backlinks: 'Dofollow', ref_domains: 1800, total_backlinks: 8500, total_keywords: 2100, auth_score: 38, spam_score: '1%', trust_flow: 25, citation_flow: 35 },
          { domain: 'financeworld-hub.com', category: 'Finance', da: 63, dr: 60, traffic: '80K', price_guest_post: 200, price_insertion: 170, price_mention: 100, language: 'English', tat: '2 Days', backlinks: 'Dofollow', ref_domains: 2800, total_backlinks: 14000, total_keywords: 3500, auth_score: 42, spam_score: '1%', trust_flow: 28, citation_flow: 40 },
          { domain: 'lifestyle-beacon.net', category: 'Lifestyle', da: 48, dr: 42, traffic: '30K', price_guest_post: 100, price_insertion: 80, price_mention: 50, language: 'English', tat: '4 Days', backlinks: 'Dofollow', ref_domains: 1200, total_backlinks: 5500, total_keywords: 1500, auth_score: 30, spam_score: '3%', trust_flow: 18, citation_flow: 28 },
          { domain: 'crypto-sentinel.io', category: 'Crypto', da: 60, dr: 55, traffic: '65K', price_guest_post: 300, price_insertion: 250, price_mention: 150, language: 'English', tat: '1 Day', backlinks: 'Dofollow', ref_domains: 2200, total_backlinks: 11000, total_keywords: 2800, auth_score: 40, spam_score: '2%', trust_flow: 22, citation_flow: 38 },
          { domain: 'saas-weekly.com', category: 'SaaS', da: 58, dr: 52, traffic: '55K', price_guest_post: 180, price_insertion: 150, price_mention: 90, language: 'English', tat: '3 Days', backlinks: 'Dofollow', ref_domains: 2000, total_backlinks: 9500, total_keywords: 2400, auth_score: 36, spam_score: '1%', trust_flow: 24, citation_flow: 36 },
          { domain: 'realestate-insider.com', category: 'Real Estate', da: 50, dr: 45, traffic: '35K', price_guest_post: 130, price_insertion: 100, price_mention: 65, language: 'English', tat: '3 Days', backlinks: 'Dofollow', ref_domains: 1500, total_backlinks: 7000, total_keywords: 1800, auth_score: 32, spam_score: '2%', trust_flow: 20, citation_flow: 30 },
          { domain: 'business-daily-news.com', category: 'Business', da: 65, dr: 62, traffic: '95K', price_guest_post: 220, price_insertion: 180, price_mention: 110, language: 'English', tat: '2 Days', backlinks: 'Dofollow', ref_domains: 3000, total_backlinks: 15000, total_keywords: 3800, auth_score: 44, spam_score: '1%', trust_flow: 30, citation_flow: 42 }
        ];
        try {
          const { data: inserted } = await supabase.from('domains').insert(seedDomains).select('*');
          finalDomains = inserted || seedDomains;
        } catch (e) {
          finalDomains = seedDomains;
        }
      }

      setDomains(finalDomains);
      setPricingRules(rules || []);
    } catch (err: any) {
      setError('Failed to load websites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription?.unsubscribe();
  }, []);

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
      
      const multiplier = niche === 'Casino' ? 3 : (niche === 'Grey Niche' ? 2 : (niche === 'CBD' ? 1.5 : 1));
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

      let matchesNicheRule = true;
      if (niche === 'General') {
        matchesNicheRule = (d.price_guest_post === 10 || d.price_guest_post <= 10);
      } else if (niche === 'Grey Niche') {
        matchesNicheRule = (['Casino', 'CBD', 'Crypto', 'Grey Niche', 'Betting', 'Gambling'].includes(d.category) || d.price_guest_post > 10);
      } else if (niche === 'Casino') {
        matchesNicheRule = (d.category?.toLowerCase().includes('casino') || d.category?.toLowerCase().includes('bet') || d.price_guest_post > 10);
      } else if (niche === 'CBD') {
        matchesNicheRule = (d.category?.toLowerCase().includes('cbd') || d.category?.toLowerCase().includes('health') || d.price_guest_post > 10);
      }

      return matchesSearch && matchesDA && matchesDR && matchesTraffic && matchesCategory && 
             matchesPrice && matchesTAT && matchesLinks && matchesLanguage && matchesOffering && matchesNicheRule;
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

    const metaMap = JSON.parse(localStorage.getItem('blogmate_domain_meta') || '{}');
    result = [...result].sort((a, b) => {
      const isPinnedA = metaMap[a.domain?.toLowerCase()]?.is_pinned !== undefined ? metaMap[a.domain?.toLowerCase()]?.is_pinned : !!a.is_new;
      const isPinnedB = metaMap[b.domain?.toLowerCase()]?.is_pinned !== undefined ? metaMap[b.domain?.toLowerCase()]?.is_pinned : !!b.is_new;
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;
      return 0;
    });

    return result;
  }, [domains, filters, niche, sortBy, pricingRules]);

  const totalPages = Math.ceil(filteredAndSortedDomains.length / itemsPerPage);
  const currentDomains = filteredAndSortedDomains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [filters, sortBy, niche]);

  useEffect(() => {
    if (!isMobileFiltersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsMobileFiltersOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMobileFiltersOpen]);

  useEffect(() => {
    const syncSearchFromUrl = () => {
      const query = new URLSearchParams(window.location.search).get('search') || '';
      setFilters(prev => prev.search === query ? prev : { ...prev, search: query });
    };
    syncSearchFromUrl();
    window.addEventListener('popstate', syncSearchFromUrl);
    return () => window.removeEventListener('popstate', syncSearchFromUrl);
  }, []);

  return (
    <div className={`${isSection ? 'pt-4 sm:pt-6 pb-16 sm:pb-24' : 'pt-40 pb-32'} bg-[#f8fafc] min-h-screen relative`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 max-w-[1600px] relative">

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden w-full bg-slate-900 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl hover:bg-blue-600 transition-colors"
          >
            <Filter size={18} />
            {isMobileFiltersOpen ? 'Hide Filters' : 'Show GP Filters'}
          </button>

{isMobileFiltersOpen && (
            <button aria-label="Close filters" onClick={() => setIsMobileFiltersOpen(false)} className="fixed inset-0 z-[2100] bg-slate-950/55 backdrop-blur-sm lg:hidden" />
          )}
          <aside className={`fixed inset-y-0 left-0 z-[2200] w-[min(88vw,360px)] shrink-0 transform p-2 transition-transform duration-300 ease-out lg:sticky lg:top-[120px] lg:z-[400] lg:block lg:w-[320px] lg:translate-x-0 lg:p-0 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setIsMobileFiltersOpen(false)} />
          </aside>

          <main className="flex-1 min-w-0 w-full">
            <MarketplaceHeader 
              niche={niche} 
              setNiche={setNiche} 
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSearch={(val) => setFilters(prev => ({...prev, search: val}))} 
            />
            
            <div id="inventory-list" className="mt-0 scroll-mt-28">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex items-center animate-pulse">
                      <div className="w-[18%] pr-6 border-r border-slate-100 dark:border-slate-800">
                         <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3"></div>
                         <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                      </div>
                      <div className="w-[10%] text-center px-4"><div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto"></div></div>
                      <div className="w-[10%] text-center px-4"><div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto"></div></div>
                      <div className="w-[8%] text-center px-4"><div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto"></div></div>
                      <div className="w-[10%] text-center px-4"><div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto"></div></div>
                      <div className="w-[8%] text-center px-4"><div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto"></div></div>
                      <div className="w-[12%] text-center px-4"><div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto"></div></div>
                      <div className="w-[15%] text-right pl-4"><div className="h-12 w-full bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto"></div></div>
                    </div>
                  ))}
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
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {currentDomains.map((d) => {
                      const metaMap = JSON.parse(localStorage.getItem('blogmate_domain_meta') || '{}');
                      const localMeta = metaMap[d.domain?.toLowerCase()] || {};
                      const isPinned = localMeta.is_pinned !== undefined ? localMeta.is_pinned : !!d.is_new;
                      return (
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
                        isNew={d.is_new}
                        isPinned={isPinned}
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
                        isLoggedIn={isLoggedIn}
                        onAddToCart={onAddToCart}
                      />
                    );})}
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


import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Globe, ShieldCheck, Activity, 
  Lock, Zap, Search, Calendar, 
  ArrowRight, CheckCircle, 
  Loader2, AlertCircle, Percent
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../src/components/seo/SEO';
import ProductSchema from '../src/components/seo/ProductSchema';
import BreadcrumbSchema from '../src/components/seo/BreadcrumbSchema';

interface DomainDetailProps {
  domainName: string;
  addToCart?: (item: any) => void;
  niche?: string;
}

const DomainDetail: React.FC<DomainDetailProps> = ({ domainName, addToCart, niche = 'General' }) => {
  const [latency, setLatency] = useState(24);
  const [domainData, setDomainData] = useState<any>(null);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'guestPost' | 'insertion' | 'mention'>('guestPost');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const [{ data: dom, error: domErr }, { data: rules, error: rulesErr }] = await Promise.all([
          supabase.from('domains').select('*').eq('domain', domainName).single(),
          supabase.from('pricing_rules').select('*')
        ]);

        if (domErr) throw domErr;
        if (rulesErr) throw rulesErr;

        setDomainData(dom);
        setPricingRules(rules || []);
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(() => {
      setLatency(22 + Math.floor(Math.random() * 8));
    }, 3000);
    return () => {
      clearInterval(interval);
      subscription?.unsubscribe();
    };
  }, [domainName]);

  const goBack = () => window.location.hash = '/domains';

  const getPricingInfo = (basePrice: number) => {
    const multiplier = niche === 'Casino' ? 3 : (niche === 'Grey Niche' ? 2 : (niche === 'CBD' ? 1.5 : 1));
    const rule = pricingRules.find(r => basePrice >= r.min_price && basePrice <= r.max_price);
    
    const original = Math.round(basePrice * multiplier);
    const discounted = rule 
      ? Math.round((basePrice * (1 - rule.discount_percent / 100)) * multiplier) 
      : original;
    
    return {
      original,
      discounted,
      percent: rule ? rule.discount_percent : 0,
      isDiscounted: original > discounted
    };
  };

  const currentPricing = () => {
    if (!domainData) return { original: 0, discounted: 0, percent: 0, isDiscounted: false };
    const base = selectedOption === 'guestPost' 
      ? domainData.price_guest_post 
      : (selectedOption === 'insertion' ? domainData.price_insertion : domainData.price_mention);
    return getPricingInfo(base || 0);
  };

  const getServiceName = () => {
    if (selectedOption === 'guestPost') return 'Guest Post';
    if (selectedOption === 'insertion') return 'Link Insertion';
    return 'Brand Mention';
  };

  const handleTransaction = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.hash = '/login';
      return;
    }
    
    if (addToCart && domainData) {
      const price = currentPricing().discounted;
      addToCart({
        domain: domainData.domain,
        category: domainData.category,
        da: domainData.da,
        dr: domainData.dr,
        price,
        serviceType: getServiceName()
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!domainData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-tighter">Website Not Found</h1>
        <button onClick={goBack} className="mt-8 text-blue-400 font-bold uppercase tracking-widest text-xs hover:underline">Go back to list</button>
      </div>
    );
  }

  const pInfo = currentPricing();

  return (
    <div className="pt-24 pb-20 bg-[#f8fafc] min-h-screen relative overflow-hidden text-slate-700">
      <SEO title={`${domainData.domain} Guest Post & Link Placement`} description={`Review verified SEO metrics, pricing, and placement options for ${domainData.domain}. Compare DA, DR, traffic, and available editorial services.`} path={`/domain/${domainData.domain}`} keywords={[domainData.domain, "guest post", "link insertion", domainData.category || niche]} ogType="product" />
      <ProductSchema name={`${domainData.domain} editorial placement`} description={`Verified guest post and link placement opportunity on ${domainData.domain}.`} path={`/domain/${domainData.domain}`} category={domainData.category || niche} price={currentPricing().discounted} />
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "Marketplace", path: "/domains" }, { name: domainData.domain, path: `/domain/${domainData.domain}` }]} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 py-3 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-6">
            <button onClick={goBack} className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back To List</span>
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">ID:</span>
              <span className="text-[10px] font-mono text-blue-600 font-black">{domainData.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 font-bold">Speed: {latency}ms</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={12} fill="currentColor" /> Verified
              </div>
              <div className="bg-slate-100 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
                {niche} Category
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-6 italic">
              {domainData.domain}
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                <Globe size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-600">{domainData.language || 'English'}</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                <Calendar size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-600">Secure Service</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              {isLoggedIn && (
                <>
                  {pInfo.isDiscounted && (
                    <div className="absolute -right-12 top-6 bg-emerald-500 text-white py-1.5 px-14 rotate-45 text-[9px] font-black uppercase tracking-widest shadow-lg">
                      DEAL_ACTIVE
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Institutional Pricing</span>
                      <div className="flex flex-col">
                        {pInfo.isDiscounted && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg text-slate-300 line-through font-bold decoration-rose-400 decoration-2">${pInfo.original}</span>
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">SAVE {pInfo.percent}%</span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className={`text-6xl font-black tracking-tighter ${pInfo.isDiscounted ? 'text-blue-600' : 'text-slate-900'}`}>${pInfo.discounted}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ POST NODE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                     <PriceOption 
                      label="Guest Post" 
                      pricing={getPricingInfo(domainData.price_guest_post || 0)}
                      selected={selectedOption === 'guestPost'} 
                      onClick={() => setSelectedOption('guestPost')}
                     />
                     <PriceOption 
                      label="Link Insertion" 
                      pricing={getPricingInfo(domainData.price_insertion || 0)}
                      selected={selectedOption === 'insertion'} 
                      onClick={() => setSelectedOption('insertion')}
                     />
                     <PriceOption 
                      label="Brand Mention" 
                      pricing={getPricingInfo(domainData.price_mention || 0)}
                      selected={selectedOption === 'mention'} 
                      onClick={() => setSelectedOption('mention')}
                     />
                  </div>
                </>
              )}
              <button 
                onClick={handleTransaction}
                className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 active:scale-95 group/btn"
              >
                 ADD TO MANIFEST <ArrowRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden shadow-sm">
               <MetricBlock label="Moz DA" value={domainData.da} color="blue" />
               <MetricBlock label="Ahrefs DR" value={domainData.dr} color="indigo" />
               <MetricBlock label="Auth Score" value={domainData.auth_score || '44'} color="emerald" />
               <MetricBlock label="Spam Score" value={domainData.spam_score || '3%'} color="rose" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden shadow-xl group/visitors">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] transition-transform duration-1000 group-hover/visitors:scale-110">
                    <Activity size={120} class="text-white" />
                  </div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] block mb-10 relative z-10">Monthly Visitors</span>
                  <div className="flex items-baseline gap-3 mb-1 relative z-10">
                     <span className="text-7xl font-black text-white tracking-tighter">{domainData.traffic}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-12 relative z-10">Verified Domain Flow</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-[3rem] p-10 relative shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-10">Link Analytics</span>
                  <div className="grid grid-cols-2 gap-8 mb-10">
                     <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ref Domains</span>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{domainData.ref_domains}</span>
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Backlinks</span>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{domainData.total_backlinks}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white border border-slate-200 rounded-[3rem] p-10 relative overflow-hidden shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-10">Operational Manifest</span>
                <div className="space-y-6">
                   <ManifestItem label="Delivery Protocol" value={domainData.tat} />
                   <ManifestItem label="Link Specification" value={domainData.backlinks} />
                   <ManifestItem label="Semantic Keywords" value={domainData.total_keywords} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBlock = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className="flex flex-col group/metric">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</span>
    <span className="text-6xl font-black text-slate-900 tracking-tighter transition-all duration-500 group-hover/metric:text-blue-600">{value}</span>
  </div>
);

const PriceOption = ({ label, pricing, selected, onClick }: { label: string, pricing: any, selected?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
      selected 
        ? 'bg-slate-950 border-slate-950 text-white shadow-2xl scale-[1.03] z-10' 
        : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-300'
    }`}
  >
     <div className="flex flex-col">
       <span className={`text-[11px] font-black uppercase tracking-widest ${selected ? 'text-blue-400' : 'text-slate-700'}`}>{label}</span>
       {pricing.isDiscounted && (
         <span className={`text-[8px] font-bold uppercase ${selected ? 'text-slate-500' : 'text-slate-400'}`}>Automated Value Apply</span>
       )}
     </div>
     <div className="flex items-center gap-3">
       {pricing.isDiscounted && (
         <span className={`text-xs line-through opacity-40 font-bold ${selected ? 'text-white' : 'text-slate-400'}`}>${pricing.original}</span>
       )}
       <span className={`text-base font-black tabular-nums ${selected ? 'text-white' : 'text-slate-950'}`}>${pricing.discounted}</span>
     </div>
  </div>
);

const ManifestItem = ({ label, value }: { label: string, value: any }) => (
  <div className="flex justify-between items-center text-xs py-3 border-b border-dashed border-slate-100 last:border-0">
    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">{label}</span>
    <span className="font-mono font-black text-slate-950 tracking-tight">{value}</span>
  </div>
);

export default DomainDetail;


import React from 'react';
import { Heart, Plus, CheckCircle, ChevronUp, Info, AlertTriangle, Trash2, Eye, Activity, Globe, Shield, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DomainItemProps {
  domain: string;
  category: string;
  da: number;
  traffic: string;
  visits: string;
  tat: string;
  backlinks: string;
  prices: any;
  isNew?: boolean;
  metrics: any;
  niche?: string;
  onAddToCart?: (item: any) => void;
}

const DomainItem: React.FC<DomainItemProps> = ({ 
  domain, category, da, traffic, tat, backlinks, prices, isNew, metrics, niche = 'General', onAddToCart 
}) => {
  const multiplier = niche === 'Casino' ? 3 : (niche === 'CBD' ? 1.5 : 1);
  
  const renderPrice = (priceObj: any) => {
    if (!priceObj || priceObj.discounted === undefined) return '---';
    const original = Math.round(priceObj.original * multiplier);
    const discounted = Math.round(priceObj.discounted * multiplier);
    const isDiscounted = original > discounted;

    return (
      <div className="flex flex-col items-center">
        {isDiscounted && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-slate-300 line-through font-bold decoration-rose-400 decoration-2 tabular-nums">
              ${original}
            </span>
            <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded leading-none">
              -{priceObj.percent}%
            </span>
          </div>
        )}
        <span className={`text-[18px] font-black tracking-tight leading-none ${isDiscounted ? 'text-blue-600' : 'text-slate-900'}`}>
          ${discounted}
        </span>
      </div>
    );
  };

  const navigateToDetail = () => {
    window.location.hash = `#/domains/${domain}`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.hash = '#/login'; return; }
    const discountedPrice = Math.round(prices.guestPost.discounted * multiplier);
    onAddToCart?.({ domain, category, da, dr: metrics.dr, price: discountedPrice, serviceType: 'Guest Post' });
  };

  return (
    <div 
      onClick={navigateToDetail}
      className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-blue-500/20 transition-all duration-500 overflow-hidden cursor-pointer group mb-2"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 opacity-60"></div>

      <div className="flex items-center px-10 pt-10 pb-6">
        <div className="w-[18%] flex flex-col pr-6 border-r border-slate-50">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[17px] font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tight">
              {domain}
            </span>
            <CheckCircle size={14} className="text-blue-500 fill-blue-50" />
            {isNew && <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">New</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category}</span>
          </div>
        </div>
        
        <div className="w-[10%] text-center">
          <div className="text-[10px] font-black text-slate-300 uppercase mb-1">Moz DA</div>
          <div className="text-[18px] font-black text-blue-600">{da}</div>
        </div>
        
        <div className="w-[10%] text-center">
          <div className="text-[10px] font-black text-slate-300 uppercase mb-1">Visitors</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[16px] font-black text-slate-900">{traffic}</span>
          </div>
        </div>
        
        <div className="w-[8%] text-center">
          <div className="text-[10px] font-black text-slate-300 uppercase mb-1">Delivery</div>
          <div className="text-[14px] font-bold text-slate-600">{tat}</div>
        </div>

        <div className="w-[10%] text-center">
          <div className="text-[10px] font-black text-slate-300 uppercase mb-1">Type</div>
          <div className="text-[14px] font-black text-indigo-600">{backlinks}</div>
        </div>

        <div className="flex-1 flex items-center justify-between ml-6 pl-6 border-l border-slate-50">
           <div className="text-center">
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Post Cost</div>
             {renderPrice(prices.guestPost)}
           </div>
           <div className="text-center">
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Link Cost</div>
             {renderPrice(prices.insertion)}
           </div>
           <div className="text-center">
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Mention</div>
             {renderPrice(prices.mention)}
           </div>
        </div>
        
        <div className="w-[15%] flex items-center justify-end gap-3 pr-2 ml-4">
           <button 
             onClick={(e) => { e.stopPropagation(); }}
             className="w-12 h-12 border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all bg-white shadow-sm flex items-center justify-center"
           >
            <Heart size={20} />
           </button>
           
           <button 
             onClick={handleAddToCart} 
             className="group/btn flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[12px] font-black tracking-[0.1em] shadow-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
           >
              <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" /> 
              <span>ADD</span>
           </button>
        </div>
      </div>

      <div className="px-10 pb-10 pt-4">
        <div className="grid grid-cols-5 gap-y-8 mb-10 border-t border-slate-50 pt-10">
          <DetailMetric icon={<Activity size={14} className="text-blue-500" />} label="Domain Rating" value={metrics.dr} color="text-blue-600" />
          <DetailMetric icon={<Globe size={14} className="text-emerald-500" />} label="Ref Sites" value={metrics.refDomains} color="text-slate-900" />
          <DetailMetric icon={<Shield size={14} className="text-indigo-500" />} label="Safety Score" value={metrics.authScore} color="text-slate-900" />
          <DetailMetric icon={<CheckCircle size={14} className="text-orange-500" />} label="Trust Flow" value={metrics.trustFlow} color="text-slate-900" />
          <DetailMetric icon={<ChevronUp size={14} className="text-blue-500" />} label="Total Keywords" value={metrics.totalKeywords} color="text-slate-900" />
          
          <DetailMetric label="Spam Score" value={metrics.spamScore} sub="RISK: LOW" />
          <DetailMetric label="Language" value={metrics.language} sub="NATIVE" color="text-blue-600" />
          <DetailMetric label="Validity" value="Permanent" sub="LOCK" color="text-emerald-600" />
          <DetailMetric label="Citation" value={metrics.citationFlow} sub="MAJESTIC" />
          <DetailMetric label="Category" value={category} sub="SECTOR" />
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
           <FooterBtn icon={<Info size={14} />} label="View Guide" color="blue" />
           <FooterBtn icon={<Eye size={14} />} label="Live Example" color="emerald" />
           <div className="h-6 w-px bg-slate-200 mx-2"></div>
           <FooterBtn icon={<AlertTriangle size={14} />} label="Report Issue" color="orange" />
           <FooterBtn icon={<Trash2 size={14} />} label="Hide Site" color="rose" />
        </div>
      </div>
    </div>
  );
};

const DetailMetric = ({ icon, label, value, color, sub }: { icon?: any, label: string, value: any, color?: string, sub?: string }) => (
  <div className="flex flex-col gap-1.5 group/item">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className={`text-[15px] font-black ${color || 'text-slate-900'} tracking-tight`}>{value}</div>
    {sub && <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover/item:text-blue-400 transition-colors">{sub}</span>}
  </div>
);

const FooterBtn = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => {
  const colors = {
    blue: 'bg-white text-blue-600 border-slate-100 hover:border-blue-500/30 hover:shadow-lg',
    orange: 'bg-white text-orange-600 border-slate-100 hover:border-orange-500/30 hover:shadow-lg',
    rose: 'bg-white text-rose-600 border-slate-100 hover:border-rose-500/30 hover:shadow-lg',
    emerald: 'bg-white text-emerald-600 border-slate-100 hover:border-emerald-500/30 hover:shadow-lg'
  };
  return (
    <button className={`flex items-center gap-3 px-5 py-2.5 border rounded-xl text-[11px] font-black tracking-widest uppercase transition-all shadow-sm ${colors[color as keyof typeof colors]}`}>
      {icon} <span>{label}</span>
    </button>
  );
};

export default DomainItem;

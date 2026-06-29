
import React from 'react';
import { Command, ShieldCheck, History, Tag } from 'lucide-react';

interface Props {
  items: any[];
  niche: string;
  writingFee: number;
  surcharge: number;
  finalValuation: number;
  coupon: string;
  setCoupon: (c: string) => void;
  discount: number;
}

const SummarySidebar: React.FC<Props> = ({ items, niche, writingFee, surcharge, finalValuation, coupon, setCoupon, discount }) => {
  const multiplier = niche === 'Casino' ? 3 : (niche === 'CBD' ? 1.5 : 1);

  return (
    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl sticky top-32">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
          <Command size={20} className="text-blue-600" /> Valuation
        </h3>
        <span className="text-[9px] font-black text-blue-500 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 uppercase tracking-widest">{niche}_MOD</span>
      </div>
      
      <div className="space-y-5 mb-10 pb-8 border-b border-slate-100">
        {items.map((i: any) => (
          <div key={i.domain} className="flex justify-between items-start">
            <div className="max-w-[70%]">
              <div className="text-[13px] font-black text-slate-900 truncate">{i.domain}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{i.category}</div>
            </div>
            <div className="text-sm font-black text-slate-900">${(i.basePrice * multiplier).toFixed(0)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-10">
        <Row label="Node Multiplier" val={`${multiplier}x`} />
        <Row label="Authoring Protocol" val={`$${(items.length * writingFee).toFixed(0)}`} />
        {surcharge > 0 && <Row label="B2B Surcharge (10%)" val={`+$${surcharge.toFixed(0)}`} color="rose" />}
        
        <div className="relative mt-8">
           <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
           <input 
             type="text" 
             placeholder="VOUCHER_CODE" 
             value={coupon} 
             onChange={(e) => setCoupon(e.target.value)} 
             className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-12 py-3.5 text-[10px] font-black placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all shadow-inner uppercase" 
           />
           {discount > 0 && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 animate-pulse">-20%</div>}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">Final Asset Worth</div>
        <div className="flex items-end justify-between">
           <div className="text-5xl font-black text-slate-900 tracking-tighter leading-none">${finalValuation.toFixed(0)}</div>
           <div className={`flex flex-col items-end ${surcharge > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {surcharge > 0 ? <History size={18} /> : <ShieldCheck size={18} />}
              <span className="text-[8px] font-black uppercase tracking-widest mt-1">{surcharge > 0 ? 'DEFERRED' : 'AUTHORIZED'}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, val, color = 'slate' }: any) => (
  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
    <span className="text-slate-400">{label}</span>
    <span className={color === 'rose' ? 'text-rose-500' : 'text-slate-900'}>{val}</span>
  </div>
);

export default SummarySidebar;

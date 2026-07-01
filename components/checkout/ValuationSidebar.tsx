
import React from 'react';
import { Command, History, ShieldCheck } from 'lucide-react';

const ValuationSidebar = ({ items, niche, writingFee, net30Surcharge, coupon, setCoupon, couponDiscount, useBonus, setUseBonus, finalValuation, isPayLater }: any) => {
  const multiplier = niche === 'Casino' ? 3 : (niche === 'Grey Niche' ? 2 : (niche === 'CBD' ? 1.5 : 1));
  
  return (
    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl sticky top-32">
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
        <Command size={20} className="text-blue-600" /> Valuation_Report
      </h3>
      
      <div className="space-y-6 mb-10 pb-10 border-b border-slate-100">
        {items.map((i: any) => (
          <div key={i.domain} className="flex justify-between items-start group">
            <div>
              <div className="text-[13px] font-black text-slate-900 group-hover:text-orange-600 transition-colors">{i.domain}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{i.category}</div>
            </div>
            <div className="text-sm font-black text-slate-900">${(i.basePrice * multiplier).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-10">
        <Line label="Niche Multiplier" value={`${multiplier}x`} />
        <Line label="Content Writing Fee" value={`$${(items.length * writingFee).toFixed(2)}`} />
        {net30Surcharge > 0 && <Line label="B2B Surcharge (10%)" value={`+$${net30Surcharge.toFixed(2)}`} color="rose" />}
        
        <div className="relative mt-8">
           <input type="text" placeholder="VOUCHER_CODE" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[10px] font-black placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all" />
           {couponDiscount > 0 && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 uppercase animate-in zoom-in">-20%</div>}
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
           <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Bonus Balance: $25.00</div>
           <button onClick={() => setUseBonus(!useBonus)} className={`w-10 h-6 rounded-full transition-all relative ${useBonus ? 'bg-blue-600' : 'bg-slate-200'}`}>
             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${useBonus ? 'right-1' : 'left-1'}`}></div>
           </button>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Asset Worth</div>
           <div className="text-4xl font-black text-slate-900 tracking-tighter">${finalValuation.toFixed(2)}</div>
        </div>
        <div className={`flex items-center gap-1.5 ${isPayLater ? 'text-rose-500' : 'text-emerald-500'}`}>
          {isPayLater ? <History size={14} /> : <ShieldCheck size={14} />}
          <span className="text-[9px] font-black uppercase tracking-widest">{isPayLater ? 'DEFERRED' : 'SECURE'}</span>
        </div>
      </div>
    </div>
  );
};

const Line = ({ label, value, color = "slate" }: any) => (
  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
    <span className="text-slate-400">{label}</span>
    <span className={color === "rose" ? "text-rose-500" : "text-slate-900"}>{value}</span>
  </div>
);

export default ValuationSidebar;


import React from 'react';
import { Clock, ArrowLeft, ShieldCheck, Zap, Loader2 } from 'lucide-react';

interface Props {
  amount: number;
  onBack: () => void;
  onSuccess: () => void;
  processing: boolean;
}

const Net30Gateway: React.FC<Props> = ({ amount, onBack, onSuccess, processing }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mb-6 shadow-sm border border-emerald-100">
          <Clock size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Net-30 Credit Hub</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">B2B Institutional Deferred Protocol</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl max-w-xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Clock size={200} />
        </div>

        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100 relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Credit Amount</span>
          <span className="text-4xl font-black text-slate-900 italic tabular-nums">${amount.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Billing Cycle</span>
            <span className="text-base font-black text-slate-900">30 Days</span>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Credit Limit</span>
            <span className="text-base font-black text-emerald-600 uppercase tracking-tight">Tier 1 Elite</span>
          </div>
        </div>

        <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 mb-10 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={20} className="text-emerald-500" />
            <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">Authorized Sequence</h4>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
            Immediate deployment authorized. Full balance liquidation required via Bank Wire within 30 solar days.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <button 
            onClick={onBack}
            className="py-5 bg-slate-100/50 text-slate-400 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95"
          >
            Go Back
          </button>
          <button 
            onClick={onSuccess}
            disabled={processing}
            className="py-5 bg-[#020617] text-white rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 italic"
          >
            {processing ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                <><Zap size={18} fill="currentColor" className="text-blue-400" /> Confirm Order</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Net30Gateway;

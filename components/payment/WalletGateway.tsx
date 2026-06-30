
import React from 'react';
import { Wallet, ArrowLeft, ShieldCheck, Zap, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  amount: number;
  balance: number;
  onBack: () => void;
  onSuccess: (transactionId?: string) => void;
  processing: boolean;
}

const WalletGateway: React.FC<Props> = ({ amount, balance, onBack, onSuccess, processing }) => {
  const canAfford = balance >= amount;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-100">
          <Wallet size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Wallet Hub Settlement</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Internal Node Liquidity Transfer</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl max-w-xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Wallet size={200} />
        </div>

        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100 relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Node Balance</span>
          <span className={`text-4xl font-black italic tabular-nums ${canAfford ? 'text-emerald-600' : 'text-rose-500'}`}>${balance.toLocaleString()}</span>
        </div>

        <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl mb-10 relative z-10">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Order Total</span>
                <span className="text-xl font-black text-slate-950">${amount.toLocaleString()}</span>
            </div>
            
            <div className="h-px bg-slate-200 w-full mb-6"></div>

            {!canAfford ? (
                <div className="flex items-center gap-3 text-rose-500">
                    <AlertCircle size={20} />
                    <p className="text-[11px] font-black uppercase tracking-tight">Insufficient Funds. Node recharge required.</p>
                </div>
            ) : (
                <div className="flex items-center gap-3 text-emerald-500">
                    <ShieldCheck size={20} />
                    <p className="text-[11px] font-black uppercase tracking-tight">Liquidity Verified. Ready for deduction.</p>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <button 
            onClick={onBack}
            className="py-5 bg-slate-100/50 text-slate-400 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSuccess('WALLET-' + Date.now())}
            disabled={processing || !canAfford}
            className="py-5 bg-slate-950 text-white rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 italic"
          >
            {processing ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                <><Zap size={18} fill="currentColor" className="text-blue-400" /> Confirm Pay</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletGateway;

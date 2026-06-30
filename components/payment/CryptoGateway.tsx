
import React, { useState } from 'react';
import { Bitcoin, ArrowLeft, MessageSquare, ShieldAlert } from 'lucide-react';

interface Props {
  amount: number;
  onBack: () => void;
  onSuccess: (transactionId?: string) => void;
}

const CryptoGateway: React.FC<Props> = ({ amount, onBack, onSuccess }) => {
  const [transactionId, setTransactionId] = useState('');
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-orange-500 mb-6 shadow-xl border border-orange-100">
          <Bitcoin size={40} className="animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">USDT Asset Lock</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">TRC-20 Verification Network</p>
      </div>

      <div className="bg-[#020617] border border-white/5 rounded-[3rem] p-10 shadow-2xl max-w-xl mx-auto relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Transfer</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">${amount} USDT</span>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="text-orange-400" size={20} />
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Security Protocol</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To prevent slippage and ensure 100% security, crypto transfers are verified via our support desk. 
              Request a unique wallet address for your session below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <input value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="ENTER BLOCKCHAIN TRANSACTION ID" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-white outline-none placeholder:text-slate-600 focus:border-blue-500" />
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
              className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl"
            >
              <MessageSquare size={20} /> Get Wallet Address
            </button>
            <button 
              onClick={onBack}
              className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors py-2"
            >
              Cancel Transfer
            </button>
          </div>
        </div>
        <Bitcoin size={200} className="absolute -bottom-10 -right-10 opacity-5 text-white" />
      </div>
    </div>
  );
};

export default CryptoGateway;

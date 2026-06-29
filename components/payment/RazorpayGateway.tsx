
import React from 'react';
import { CreditCard, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
import RazorpayTerminal from '../checkout/payments/RazorpayTerminal';

interface Props {
  amount: number;
  onBack: () => void;
  onSuccess: () => void;
}

const RazorpayGateway: React.FC<Props> = ({ amount, onBack, onSuccess }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-blue-400 mb-6 shadow-xl">
          <CreditCard size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Razorpay Portal</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Cards, UPI & Netbanking Terminal</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable</span>
          <span className="text-3xl font-black text-slate-900">${amount.toLocaleString()}</span>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase">Gateway Status</span>
            <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium text-center px-4">
            Secured by 256-bit encryption. Instant activation for all supported domains.
          </p>
        </div>

        <div className="mb-10">
          <RazorpayTerminal 
            amount={amount} 
            currency="USD" 
            onSuccess={(ref) => {
              console.log("Razorpay Success:", ref);
              onSuccess();
            }} 
            onCancel={onBack}
          />
        </div>

        <button 
          onClick={onBack}
          className="w-full py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
};

export default RazorpayGateway;

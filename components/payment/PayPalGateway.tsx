
import React from 'react';
import { Globe, ArrowLeft, ShieldCheck } from 'lucide-react';
import PayPalTerminal from '../checkout/payments/PayPalTerminal';

interface Props {
  amount: number;
  onBack: () => void;
  onSuccess: (transactionId?: string) => void;
}

const PayPalGateway: React.FC<Props> = ({ amount, onBack, onSuccess }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-100">
          <Globe size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">PayPal Terminal</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Secure Global Settlement Node</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable</span>
          <span className="text-3xl font-black text-slate-900">${amount.toLocaleString()}</span>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-10 flex gap-4">
          <ShieldCheck className="text-blue-600 shrink-0" size={24} />
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Authorized via PayPal's secure vault. 
            Digital assets will be synced immediately upon confirmation.
          </p>
        </div>

        <div className="mb-10">
          <PayPalTerminal 
            amount={amount} 
            currency="USD" 
            onSuccess={(ref) => {
              console.log("PayPal Success:", ref);
              onSuccess(ref);
            }} 
            description="DomIntel Asset Acquisition" 
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

export default PayPalGateway;


import React from 'react';
import { Target, FileText, CreditCard, ShieldCheck } from 'lucide-react';

interface Props { step: number }

const OrderProgress: React.FC<Props> = ({ step }) => {
  const steps = [
    { id: 1, label: 'STRATEGY', icon: <Target size={16} /> },
    { id: 2, label: 'MANIFEST', icon: <FileText size={16} /> },
    { id: 3, label: 'PAYMENT', icon: <CreditCard size={16} /> }
  ];

  return (
    <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
        <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${(step/3)*100}%` }}></div>
      </div>
      {steps.map(s => (
        <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${step >= s.id ? 'text-blue-600' : 'text-slate-300'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-blue-50 border-blue-600 scale-110 shadow-lg' : 'border-slate-100 bg-slate-50'}`}>
            {s.icon}
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest hidden md:block">{s.label}_CONFIG</span>
        </div>
      ))}
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
         <ShieldCheck size={14} className="text-emerald-500" />
         <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Secure_Node</span>
      </div>
    </div>
  );
};

export default OrderProgress;


import React from 'react';
import { CreditCard, Globe, Bitcoin, CalendarClock, Building2, FileCheck, Briefcase, Mail } from 'lucide-react';

interface Props {
  terminal: string;
  setTerminal: (t: string) => void;
  b2bData: any;
  setB2bData: (d: any) => void;
}

const PaymentMethod: React.FC<Props> = ({ terminal, setTerminal, b2bData, setB2bData }) => {
  const updateB2B = (key: string, val: string) => setB2bData({ ...b2bData, [key]: val });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Liquidate_Order</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Select Authorized Payment Gateway</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GatewayBtn 
          active={terminal === 'Razorpay'} 
          onClick={() => setTerminal('Razorpay')} 
          label="Razorpay" sub="Card/UPI - Instant Auth" 
          icon={<CreditCard />} 
        />
        <GatewayBtn 
          active={terminal === 'PayPal'} 
          onClick={() => setTerminal('PayPal')} 
          label="PayPal" sub="Global Liquiditiy" 
          icon={<Globe />} 
        />
        <GatewayBtn 
          active={terminal === 'Crypto'} 
          onClick={() => setTerminal('Crypto')} 
          label="Crypto USDT" sub="TRC-20 Blockchain" 
          icon={<Bitcoin />} 
        />
        <GatewayBtn 
          active={terminal === 'Net30'} 
          onClick={() => setTerminal('Net30')} 
          label="B2B Net-30" sub="Institutional Credit" 
          icon={<CalendarClock />} 
          accent="rose" 
        />
      </div>

      {terminal === 'Net30' && (
        <div className="bg-white border-2 border-rose-100 rounded-[3rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <Building2 size={24} />
              </div>
              <h4 className="text-lg font-black text-rose-900 uppercase tracking-tight">Institutional Billing Profile</h4>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <B2BInput label="Entity Name" value={b2bData.companyName} onChange={(v) => updateB2B('companyName', v)} icon={<Building2 size={16} />} />
              <B2BInput label="Tax/VAT ID" value={b2bData.taxId} onChange={(v) => updateB2B('taxId', v)} icon={<FileCheck size={16} />} />
              <B2BInput label="Signatory" value={b2bData.authorizedOfficer} onChange={(v) => updateB2B('authorizedOfficer', v)} icon={<Briefcase size={16} />} />
              <B2BInput label="Billing Email" value={b2bData.billingEmail} onChange={(v) => updateB2B('billingEmail', v)} icon={<Mail size={16} />} />
           </div>
        </div>
      )}
    </div>
  );
};

const GatewayBtn = ({ active, onClick, label, sub, icon, accent = 'blue' }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center gap-5 ${
      active ? `bg-white border-${accent}-500 shadow-2xl scale-[1.02]` : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
      active ? `bg-${accent}-500 text-white shadow-lg` : 'bg-slate-50 text-slate-400'
    }`}>
      {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
    </div>
    <div>
      <div className={`text-[13px] font-black uppercase tracking-tight ${active ? `text-${accent}-600` : 'text-slate-900'}`}>{label}</div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</div>
    </div>
  </button>
);

const B2BInput = ({ label, value, onChange, icon }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-rose-300 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-200 group-focus-within:text-rose-500 transition-colors">{icon}</div>
       <input 
         type="text" 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-rose-50/30 border border-rose-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-rose-900 focus:outline-none focus:border-rose-500 shadow-inner"
       />
    </div>
  </div>
);

export default PaymentMethod;

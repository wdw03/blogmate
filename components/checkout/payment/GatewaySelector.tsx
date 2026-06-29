
import React from 'react';
import { CreditCard, Globe, Bitcoin, CalendarClock } from 'lucide-react';

const GatewaySelector = ({ terminal, setTerminal }: any) => {
  const gateways = [
    { id: 'Razorpay', label: 'Razorpay (Card/UPI)', icon: <CreditCard />, sub: 'Instant Auth' },
    { id: 'PayPal', label: 'PayPal (Global)', icon: <Globe />, sub: 'Global Liquidity' },
    { id: 'Crypto', label: 'Crypto (USDT)', icon: <Bitcoin />, sub: 'TRC-20 Verification' },
    { id: 'Net30', label: 'B2B Net-30', icon: <CalendarClock />, sub: 'Institutional Credit', accent: 'rose' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {gateways.map(g => (
        <button 
          key={g.id}
          onClick={() => setTerminal(g.id)}
          className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center gap-5 ${
            terminal === g.id ? `bg-white border-${g.accent || 'orange'}-500 shadow-2xl` : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${terminal === g.id ? `bg-${g.accent || 'orange'}-500 text-white shadow-lg` : 'bg-slate-50 text-slate-400'}`}>
            {g.icon}
          </div>
          <div>
            <div className={`text-[12px] font-black uppercase tracking-tight ${terminal === g.id ? `text-${g.accent || 'orange'}-600` : 'text-slate-900'}`}>{g.label}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{g.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default GatewaySelector;

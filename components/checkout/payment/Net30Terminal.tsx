
import React from 'react';
import { Landmark, HandCoins, Building2, FileCheck, Briefcase, Mail, FileWarning, ShieldAlert } from 'lucide-react';

const Net30Terminal = ({ data, setData }: any) => {
  return (
    <div className="bg-white border-2 border-rose-100 rounded-[3rem] p-10 animate-in zoom-in-95 duration-500 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <Landmark size={240} className="text-rose-900" />
      </div>
      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-rose-500/30">
          <HandCoins size={36} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Corporate Credit Manifest</h4>
          <div className="flex items-center gap-1 mt-1">
            <div className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9px] font-black uppercase tracking-widest">
              <ShieldAlert size={10} className="inline mr-1" /> Tier_1 Authorized
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limit: <span className="text-emerald-500">$5,000.00 Available</span></span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
        <div className="space-y-4">
          <B2BInput placeholder="Registered Company Name" icon={<Building2 size={16} />} value={data.companyName} onChange={(val: string) => setData({companyName: val})} />
          <B2BInput placeholder="Tax ID / VAT Registration" icon={<FileCheck size={16} />} value={data.taxId} onChange={(val: string) => setData({taxId: val})} />
        </div>
        <div className="space-y-4">
          <B2BInput placeholder="Authorized Signatory Name" icon={<Briefcase size={16} />} value={data.authorizedOfficer} onChange={(val: string) => setData({authorizedOfficer: val})} />
          <B2BInput placeholder="Institutional Billing Email" icon={<Mail size={16} />} value={data.billingEmail} onChange={(val: string) => setData({billingEmail: val})} />
        </div>
      </div>
      <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 relative z-10">
        <div className="flex items-start gap-4">
          <FileWarning size={24} className="text-rose-500 shrink-0" />
          <div>
            <h5 className="text-[11px] font-black text-rose-900 uppercase tracking-[0.1em] mb-2">Deferred Payment Terms (Net-30)</h5>
            <p className="text-[11px] font-medium text-rose-600/80 leading-relaxed">
              Asset deployment will initialize immediately. Liquidation of the full balance is mandatory within **30 solar days**. 10% Admin Surcharge applies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const B2BInput = ({ placeholder, icon, value, onChange }: any) => (
  <div className="relative group">
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">{icon}</div>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-500 transition-all shadow-inner"
    />
  </div>
);

export default Net30Terminal;


import React from 'react';
import { Cpu, X, ShieldCheck, Asterisk } from 'lucide-react';

const ManifestSection = ({ strategy, targetNode, data, setData, onClose, onLock }: any) => {
  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
      <header className="px-10 py-8 bg-[#0F172A] flex items-center justify-between">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white italic font-black">D</div>
           <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Manifest Protocol</h3>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target: <span className="text-blue-400">{targetNode.toUpperCase()}</span></span>
           </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
      </header>

      <div className="p-10 bg-[#F8FAFC] space-y-12">
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup required label="Anchor Text" value={data.anchorText} onChange={(v: string) => setData({anchorText: v})} placeholder="Primary keyword..." />
              <FormGroup required label="Landing URL" value={data.landingUrl} onChange={(v: string) => setData({landingUrl: v})} placeholder="https://..." />
           </div>
        </div>

        {strategy === 'Pro' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormGroup required label="Project Scope" type="textarea" value={data.projectScope} onChange={(v: string) => setData({projectScope: v})} placeholder="Article topic, tone, and specific instructions..." />
             <FormGroup label="Latent Semantics" type="textarea" value={data.latentSemantics} onChange={(v: string) => setData({latentSemantics: v})} placeholder="Additional keywords to include (optional)..." />
          </div>
        )}
      </div>

      <footer className="px-10 py-10 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest"><ShieldCheck size={18} /> Secure Sync Active</div>
         <button onClick={onLock} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">Lock Parameters</button>
      </footer>
    </div>
  );
};

const FormGroup = ({ label, placeholder, value, onChange, type = 'input', required = false }: any) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-1.5 ml-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {required && <Asterisk size={10} className="text-rose-500" />}
    </div>
    {type === 'textarea' ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold min-h-[120px] focus:border-blue-500 outline-none transition-all shadow-inner" />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-inner" />
    )}
  </div>
);

export default ManifestSection;


import React from 'react';
import { Asterisk, Globe, Link2, FileText, Info } from 'lucide-react';

interface Props {
  data: any;
  setData: (d: any) => void;
  strategy: string;
}

const ManifestForm: React.FC<Props> = ({ data, setData, strategy }) => {
  const update = (key: string, val: string) => setData({ ...data, [key]: val });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Asset_Manifest</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Configure Deployment Parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
        <FormInput 
          label="Anchor Text" 
          placeholder="Primary Keyword..." 
          value={data.anchorText} 
          onChange={(v) => update('anchorText', v)} 
          icon={<TargetIcon />} 
          required 
        />
        <FormInput 
          label="Landing URL" 
          placeholder="https://your-site.com/page" 
          value={data.landingUrl} 
          onChange={(v) => update('landingUrl', v)} 
          icon={<Link2 size={16} />} 
          required 
        />
      </div>

      {strategy === 'Pro' && (
        <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl space-y-8 border border-white/5">
           <div className="flex items-center gap-3 text-white">
              <FileText size={18} className="text-orange-500" />
              <h4 className="text-sm font-black uppercase tracking-widest">Writing Instructions (Mandatory)</h4>
           </div>
           <div className="grid gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   Project Scope <Asterisk size={10} className="text-rose-500" />
                </label>
                <textarea 
                  value={data.projectScope}
                  onChange={(e) => update('projectScope', e.target.value)}
                  placeholder="Describe the article topic, tone, and specific requirements..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-slate-700 focus:border-orange-500 outline-none transition-all h-32 resize-none"
                />
              </div>
              <FormInput 
                label="Latent Semantics (LSI Keywords)" 
                placeholder="Comma separated secondary keywords..." 
                value={data.latentSemantics} 
                onChange={(v) => update('latentSemantics', v)} 
                icon={<Info size={16} />} 
                dark 
              />
           </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, placeholder, value, onChange, icon, required, dark }: any) => (
  <div className="flex flex-col gap-3">
    <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {label} {required && <Asterisk size={10} className="text-rose-500" />}
    </label>
    <div className={`relative group transition-all rounded-2xl border ${dark ? 'bg-white/5 border-white/10 focus-within:border-orange-500' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500 focus-within:bg-white shadow-inner'}`}>
       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
       </div>
       <input 
         type="text" 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className={`w-full bg-transparent py-4 pl-14 pr-6 text-sm font-bold outline-none ${dark ? 'text-white' : 'text-slate-900'}`}
       />
    </div>
  </div>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default ManifestForm;

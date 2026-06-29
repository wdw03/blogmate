
import React from 'react';
import { UploadCloud, FileType, Binary, CheckCircle2 } from 'lucide-react';

const StrategySection = ({ strategy, setStrategy, wordCount, setWordCount }: any) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="mb-6 ml-2">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Content Deployment Strategy</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Choose how your narrative is initialized</p>
      </div>
      <div className="space-y-4">
        <Option active={strategy === 'Self'} onClick={() => setStrategy('Self')} label="Self-Drafted" desc="Zero additional fee. .DOCX verification required." icon={<UploadCloud />} color="blue" />
        <Option active={strategy === 'Pro'} onClick={() => setStrategy('Pro')} label="Elite Writing" desc="Human expert authorship. Pricing: $10 - $35." icon={<FileType />} color="orange">
          {strategy === 'Pro' && (
            <div className="mt-6 flex gap-4 animate-in fade-in">
              {[750, 1500, 3000].map(words => (
                <button key={words} onClick={(e) => { e.stopPropagation(); setWordCount(words); }} className={`flex-1 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${wordCount === words ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-400'}`}>
                  {words} Words
                </button>
              ))}
            </div>
          )}
        </Option>
        <Option active={strategy === 'Injection'} onClick={() => setStrategy('Injection')} label="Niche Injection" desc="Fastest deployment. Link mapped to existing verified post." icon={<Binary />} color="indigo" />
      </div>
    </div>
  );
};

const Option = ({ active, onClick, label, desc, icon, color, children }: any) => (
  <button onClick={onClick} className={`w-full p-8 rounded-[2.5rem] border-2 text-left transition-all group relative overflow-hidden ${active ? `bg-white border-${color}-600 shadow-2xl` : 'bg-white border-transparent hover:border-slate-200 shadow-sm'}`}>
    <div className="flex items-center gap-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? `bg-${color}-600 text-white shadow-xl rotate-6 scale-110` : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      </div>
      <div>
        <div className={`text-[15px] font-black uppercase tracking-tight mb-1 ${active ? `text-${color}-600` : 'text-slate-900'}`}>{label}</div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{desc}</p>
      </div>
      {active && <CheckCircle2 className={`ml-auto text-${color}-600`} size={24} />}
    </div>
    {children}
  </button>
);

export default StrategySection;

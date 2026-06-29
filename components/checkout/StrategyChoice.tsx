
import React from 'react';
import { UploadCloud, FileType, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  strategy: string;
  setStrategy: (s: string) => void;
  wordCount: number;
  setWordCount: (w: number) => void;
}

const StrategyChoice: React.FC<Props> = ({ strategy, setStrategy, wordCount, setWordCount }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Deployment_Strategy</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Initialize Content Initialization Protocol</p>
      </div>

      <div className="grid gap-4">
        <Option 
          active={strategy === 'Self'} 
          onClick={() => setStrategy('Self')} 
          label="Self-Drafted Payload" 
          desc="Zero fee. User provides ready-to-publish .docx file." 
          icon={<UploadCloud />} 
          color="blue" 
        />
        
        <div className={`transition-all duration-500 ${strategy === 'Pro' ? 'bg-orange-50/30 rounded-[3rem] p-4' : ''}`}>
          <Option 
            active={strategy === 'Pro'} 
            onClick={() => setStrategy('Pro')} 
            label="Elite Writing Hub" 
            desc="Expert human authorship optimized for domain authority." 
            icon={<FileType />} 
            color="orange" 
          />
          {strategy === 'Pro' && (
            <div className="mt-4 flex gap-3 px-4 pb-4 animate-in slide-in-from-top-2">
              {[750, 1500, 3000].map(words => (
                <button 
                  key={words} 
                  onClick={() => setWordCount(words)}
                  className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                    wordCount === words ? 'bg-orange-600 text-white border-orange-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {words} Words
                </button>
              ))}
            </div>
          )}
        </div>

        <Option 
          active={strategy === 'Injection'} 
          onClick={() => setStrategy('Injection')} 
          label="Link Injection Node" 
          desc="Fastest sync. Link mapped to existing high-traffic post." 
          icon={<Zap />} 
          color="indigo" 
        />
      </div>
    </div>
  );
};

const Option = ({ active, onClick, label, desc, icon, color }: any) => (
  <button 
    onClick={onClick} 
    className={`w-full p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden ${
      active ? `bg-white border-${color}-600 shadow-2xl scale-[1.02]` : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
    }`}
  >
    <div className="flex items-center gap-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
        active ? `bg-${color}-600 text-white shadow-xl rotate-6` : 'bg-slate-50 text-slate-400'
      }`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      </div>
      <div className="flex-1">
        <div className={`text-[15px] font-black uppercase tracking-tight mb-1 ${active ? `text-${color}-600` : 'text-slate-900'}`}>{label}</div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed">{desc}</p>
      </div>
      {active && <CheckCircle2 className={`text-${color}-600 animate-in zoom-in`} size={24} />}
    </div>
  </button>
);

export default StrategyChoice;

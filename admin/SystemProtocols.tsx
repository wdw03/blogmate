
import React from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

const SystemProtocols = () => (
  <div className="py-40 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-[4rem] shadow-sm">
    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-xl mb-10 border border-slate-100">
      <Terminal size={48} />
    </div>
    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-4">System Protocols (Settings)</h3>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] mb-12 max-w-sm mx-auto leading-relaxed">API Configs & Platform Security Protocols Deployment</p>
    <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-4 group">
      Deploy Protocols <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default SystemProtocols;


import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

const ContentEngine = () => (
  <div className="py-40 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-[4rem] shadow-sm">
    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-xl mb-10 border border-slate-100">
      <FileText size={48} />
    </div>
    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-4">Intelligence Feed (Content)</h3>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] mb-12 max-w-sm mx-auto leading-relaxed">Manage Blog Intel & Service Tier Pricing Protocols</p>
    <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-4 group">
      Initialize Engine <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default ContentEngine;


import React from 'react';
import { Search, ChevronRight, TrendingUp, BarChart3, Lock } from 'lucide-react';
import AnimatedHeadline from './hero/AnimatedHeadline';
const Hero: React.FC = () => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <section className="relative pt-44 pb-32 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 dark:from-blue-900/10 to-transparent blur-3xl -z-10"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100/30 dark:bg-orange-900/10 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem] font-black tracking-tighter leading-[0.95] text-slate-950 dark:text-white mb-8">
                DOMINATE SERPS WITH{" "}
                <span className="text-blue-600 dark:text-blue-400 italic">
                  AUTHORITY
                </span>
              </h1>
              <p className="text-lg md:text-2xl font-bold text-slate-500 dark:text-slate-400 mb-12 max-w-3xl mx-auto uppercase tracking-widest leading-relaxed">
                Acquire elite programmatic assets. Command the flow of institutional traffic. Outrank the algorithms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 mb-16">
              <a
                href="#/domains"
                onClick={(e) => handleNav(e, '#/domains')}
                className="group w-full sm:w-auto relative flex items-center justify-center space-x-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 sm:px-12 py-6 rounded-[2rem] font-black text-[13px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/20 active:scale-[0.97]"
              >
                <span>ACCESS TERMINAL</span>
                <Search size={18} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
              </a>

              <a
                href="#/services"
                onClick={(e) => handleNav(e, '#/services')}
                className="flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-6 sm:px-10 py-6 rounded-[2rem] font-black text-[13px] tracking-[0.2em] hover:border-slate-900 dark:hover:border-slate-500 transition-all active:scale-[0.97] shadow-sm"
              >
                <span>VIEW PROTOCOLS</span>
                <ChevronRight size={18} strokeWidth={3} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;

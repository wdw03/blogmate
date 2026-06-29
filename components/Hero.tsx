
import React from 'react';
import { Search, ChevronRight, TrendingUp, BarChart3, Lock } from 'lucide-react';
import AnimatedHeadline from './hero/AnimatedHeadline';
import VisualDashboard from './hero/VisualDashboard';

const Hero: React.FC = () => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <section className="relative pt-44 pb-32 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent blur-3xl -z-10"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100/30 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
          <div className="flex-1 w-full max-w-2xl text-left animate-in fade-in slide-in-from-left-12 duration-1000">
            <AnimatedHeadline />
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium max-w-lg opacity-90">
              The premier ecosystem for <span className="text-blue-600 font-bold italic">high-liquidity</span> digital assets. Verified metrics, zero-trust security, and institutional-grade acquisition.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mb-16">
              <a 
                href="#/domains" 
                onClick={(e) => handleNav(e, '#/domains')}
                className="group relative flex items-center justify-center space-x-4 bg-slate-950 text-white px-12 py-6 rounded-[2rem] font-black text-[13px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/20 active:scale-[0.97]"
              >
                <span>ACCESS TERMINAL</span>
                <Search size={18} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
              </a>
              
              <a 
                href="#/services" 
                onClick={(e) => handleNav(e, '#/services')}
                className="flex items-center justify-center space-x-3 bg-white text-slate-900 border-2 border-slate-100 px-10 py-6 rounded-[2rem] font-black text-[13px] tracking-[0.2em] hover:border-slate-900 transition-all active:scale-[0.97] shadow-sm"
              >
                <span>VIEW PROTOCOLS</span>
                <ChevronRight size={18} strokeWidth={3} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <HeroMetric icon={<TrendingUp size={16} />} label="Asset Flow" value="$24.8M+" color="text-blue-600" />
              <HeroMetric icon={<BarChart3 size={16} />} label="Avg Authority" value="DA 68.2" color="text-emerald-600" />
              <div className="p-6 rounded-[2.5rem] bg-slate-950 text-white hidden sm:block border border-white/10 shadow-xl">
                <div className="flex items-center space-x-2 text-orange-400 mb-2">
                  <Lock size={16} fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">SECURE_NODE</span>
                </div>
                <div className="text-2xl font-black tracking-tighter italic">v4.8.2</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <VisualDashboard />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroMetric = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className={`flex items-center space-x-2 ${color} mb-3`}>
      {icon}
      <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70">{label}</span>
    </div>
    <div className="text-2xl font-black text-slate-900 tracking-tighter">{value}</div>
  </div>
);

export default Hero;

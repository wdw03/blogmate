
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Cpu, Database, Network, Terminal, Search, Lock, Zap, BarChart3 } from 'lucide-react';

const domains = [
  { name: 'fintech', tld: '.ai', color: 'text-blue-600', val: '$14.2k', dr: '92.4', type: 'Premium AI' },
  { name: 'nexus', tld: '.io', color: 'text-emerald-500', val: '$8.9k', dr: '88.1', type: 'Infrastructure' },
  { name: 'quantum', tld: '.xyz', color: 'text-indigo-500', val: '$24.5k', dr: '94.2', type: 'Computing' },
  { name: 'prime', tld: '.net', color: 'text-amber-500', val: '$5.2k', dr: '76.8', type: 'Network' },
  { name: 'cipher', tld: '.com', color: 'text-slate-900', val: '$42.0k', dr: '98.0', type: 'Security' },
  { name: 'delta', tld: '.ai', color: 'text-purple-600', val: '$12.4k', dr: '85.5', type: 'Automation' }
];

const VisualDashboard: React.FC = () => {
  const [latency, setLatency] = useState(24);
  const [domainIndex, setDomainIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const latencyInterval = setInterval(() => {
      setLatency(22 + Math.floor(Math.random() * 8));
    }, 2000);

    const domainInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setDomainIndex((prev) => (prev + 1) % domains.length);
        setIsTransitioning(false);
      }, 350); // Snappy transition
    }, 1500);

    return () => {
      clearInterval(latencyInterval);
      clearInterval(domainInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-[2500px]">
      {/* Background Ambient Glows */}
      <div className="absolute -inset-24 bg-gradient-to-tr from-blue-600/10 via-indigo-500/5 to-emerald-500/10 blur-[140px] rounded-full animate-pulse"></div>
      
      {/* Glass Stack */}
      <div className="relative z-10 transform rotate-y-[-8deg] rotate-x-[4deg] hover:rotate-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
        
        {/* MAIN SCANNER MODULE */}
        <div className="bg-white/90 backdrop-blur-3xl border border-white/50 rounded-[3rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.18)] p-5 md:p-10 overflow-hidden relative mb-6">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-slate-200 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200 shadow-inner"></div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-slate-800">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </div>
              <span className="text-[10px] font-black text-white tracking-[0.25em] uppercase">SECURE.SCAN.0x{latency}</span>
            </div>
          </div>

          {/* DYNAMIC DOMAIN DISPLAY AREA */}
          <div className="relative mb-12 py-6 px-4 group">
            {/* Technical HUD Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3 text-slate-400">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <Search size={14} className="text-blue-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">Proprietary Metrics Engine</span>
                </div>
                <div className={`flex items-center space-x-2 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                  <Zap size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{domains[domainIndex].type}</span>
                </div>
              </div>

              {/* KINETIC TYPOGRAPHY CONTAINER */}
              <div className="relative h-20 flex items-center overflow-hidden">
                <div className={`flex items-baseline transition-all duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isTransitioning ? 'opacity-0 -translate-y-8 blur-md' : 'opacity-100 translate-y-0 blur-0'
                }`}>
                  <span className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-[-0.06em]">
                    {domains[domainIndex].name}
                  </span>
                  <span className={`text-3xl sm:text-5xl md:text-7xl font-black tracking-[-0.06em] transition-colors duration-500 ${domains[domainIndex].color}`}>
                    {domains[domainIndex].tld}
                  </span>
                  <div className="w-1.5 h-16 bg-blue-600 rounded-full ml-4 animate-pulse"></div>
                </div>
              </div>
              
              {/* STATUS BAR UNDER TEXT */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-4 sm:gap-0">
                <div className="h-1.5 flex-1 w-full sm:w-auto bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ${isTransitioning ? 'w-0' : 'w-full'}`}
                  ></div>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-black text-blue-600/50">
                  <Lock size={10} />
                  <span>AES-256</span>
                </div>
              </div>
            </div>
          </div>

          {/* ANALYTICS TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</span>
               <span className={`text-3xl font-black text-slate-900 tracking-tighter transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                 {domains[domainIndex].val}
               </span>
            </div>
            <div className="flex flex-col p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DR Index</span>
               <span className={`text-3xl font-black text-slate-900 tracking-tighter transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                 {domains[domainIndex].dr}
               </span>
            </div>
            <div className="flex flex-col p-6 rounded-[2.5rem] bg-slate-900 shadow-2xl hover:scale-105 transition-all duration-500">
               <div className="flex items-center justify-between mb-1">
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Latency</span>
                 <Activity size={10} className="text-blue-400" />
               </div>
               <span className="text-3xl font-black text-white tracking-tighter">{latency}ms</span>
            </div>
          </div>
        </div>

        {/* SECONDARY WIDGET LAYER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <Network size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Hub</span>
                  <span className="text-sm font-black text-slate-900">Traffic Node 1A</span>
                </div>
              </div>
              <BarChart3 size={18} className="text-slate-300" />
            </div>
            <div className="flex items-end space-x-2 h-16">
              {[35, 65, 40, 85, 55, 75, 45, 80, 95, 60, 70].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-emerald-500/20 rounded-t-lg group-hover:bg-emerald-500/50 transition-all duration-700"
                  style={{ 
                    height: `${h}%`, 
                    animation: `bar-grow 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${i * 0.05}s` 
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between relative z-10">
               <Cpu size={24} className="text-blue-500 group-hover:rotate-180 transition-transform duration-1000" />
               <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">Active Thread</span>
               </div>
            </div>
            <div className="mt-8 relative z-10">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Internal Payload</div>
              <div className="text-[10px] font-mono text-blue-300 transition-opacity duration-300 px-3 py-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
                0x{Math.random().toString(16).slice(2, 14)}
              </div>
            </div>
            {/* Background Icon */}
            <Database size={100} className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
          </div>
        </div>

        {/* FLOATING ACTION OVERLAY */}
        <div className="absolute -top-10 -right-4 bg-white px-6 py-4 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.1)] flex items-center space-x-3 border border-slate-100 animate-float active:scale-95 transition-transform cursor-pointer group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Portfolio Lock</span>
            <span className="text-[13px] font-black text-slate-900 leading-none">PROTECTED</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bar-grow {
          from { height: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .rotate-y-[-8deg] { transform: rotateY(-8deg); }
        .rotate-x-[4deg] { transform: rotateX(4deg); }
      `}} />
    </div>
  );
};

export default VisualDashboard;

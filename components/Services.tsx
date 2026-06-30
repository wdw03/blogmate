
import React from 'react';
import {
  ArrowRight, Globe, BarChart3, FileSearch, ShieldCheck,
  Zap, Search, CheckCircle2, Cpu, Database, Network,
  Lock, ArrowUpRight, Fingerprint, Activity, Radio, Binary,
  Sparkles, Target, Layers, ShieldAlert, Cpu as CpuIcon,
  Maximize2, Box
} from 'lucide-react';

interface ServicesProps {
  isFullPage?: boolean;
}

const Services: React.FC<ServicesProps> = ({ isFullPage = false }) => {
  const services = [
    {
      title: 'Domain Intel saranhs',
      tag: 'FORENSIC SCAN',
      description: 'Historical ownership cycles and DNS latency forensics.',
      icon: <Globe className="w-6 h-6" />,
      color: 'blue',
      borderColor: 'border-blue-100',
      hoverBorder: 'group-hover:border-blue-400',
      features: ['WHOIS History', 'Risk AI Scans'],
      stat: 'v4.2'
    },
    {
      title: 'SEO Validator',
      tag: 'METRIC ENGINE',
      description: 'Real-time traffic flow and toxic backlink verification.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'emerald',
      borderColor: 'border-emerald-100',
      hoverBorder: 'group-hover:border-emerald-400',
      features: ['Traffic Maps', 'Toxic Scan'],
      stat: '99.9%'
    },
    {
      title: 'Liquidity Hub',
      tag: 'SECURE ESCROW',
      description: 'Fast acquisition protocol with multi-sig protection.',
      icon: <Zap className="w-6 h-6" />,
      color: 'amber',
      borderColor: 'border-amber-100',
      hoverBorder: 'group-hover:border-amber-400',
      features: ['Instant Sync', 'Smart Escrow'],
      stat: '< 2hr'
    },
    {
      title: 'Digital Audit',
      tag: 'TECH AUDIT',
      description: 'CMS security and server integrity optimization.',
      icon: <FileSearch className="w-6 h-6" />,
      color: 'indigo',
      borderColor: 'border-indigo-100',
      hoverBorder: 'group-hover:border-indigo-400',
      features: ['Stack Audit', 'Security Scan'],
      stat: '50+ Pt'
    }

  ]

  return (
    <section
      id="services-section"
      className={`relative overflow-hidden ${isFullPage ? 'py-32' : 'py-24'} bg-[#fffcfd] transition-all duration-1000`}
    >
      {/* Precision Technical Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fce7f3_1.5px,transparent_1.5px),linear-gradient(to_bottom,#fce7f3_1.5px,transparent_1.5px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-rose-50/50 to-transparent blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative">

        {/* KINETIC HEADER */}
        <div className="flex flex-col items-center text-center mb-24 relative">
          <div className="inline-flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl mb-8 shadow-xl border border-white/10">
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Proprietary Hub Services</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-[-0.05em] mb-8">
            <span className="text-rose-400 dark:text-rose-500 opacity-60 dark:opacity-80 text-2xl md:text-3xl block mb-4 uppercase tracking-[0.2em] font-black">All Systems Verified</span>
            Everything for <br />
            <span className="gradient-text italic px-2">Digital Growth.</span>
          </h2>

          <p className="text-slate-500 font-bold max-w-xl text-lg opacity-80 mb-10">
            Institutional marketplace protocols for high-liquidity asset scaling.
          </p>

          <div className="w-px h-24 bg-gradient-to-b from-rose-400 via-blue-400 to-transparent opacity-40"></div>
        </div>

        {/* COMPACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-44">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`group relative p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border ${service.borderColor} dark:border-slate-800 ${service.hoverBorder} rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_50px_90px_-20px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_50px_90px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-3 transition-all duration-500 overflow-hidden cursor-pointer`}
            >
              <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${service.color}-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 bg-${service.color}-600 rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-${service.color}-500/20 border border-white/20 group-hover:scale-110 group-hover:-rotate-12 transition-transform`}>
                  <div className="text-white">{service.icon}</div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black text-${service.color}-600 uppercase tracking-[0.15em]`}>
                    {service.tag}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-2 h-2 rounded-full bg-${service.color}-500 animate-pulse`}></div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{service.stat}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tighter">
                  {service.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed mb-10 font-medium">
                  {service.description}
                </p>

                <div className="space-y-3 mt-auto">
                  {service.features.map(f => (
                    <div key={f} className="flex items-center space-x-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      <CheckCircle2 size={14} className={`text-${service.color}-500 opacity-80`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-all duration-500`}>
                  <span className={`text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider`}>Protocol: Start</span>
                  <div className={`p-2 bg-${service.color}-50 dark:bg-slate-800 rounded-xl group-hover:bg-slate-900 dark:group-hover:bg-slate-700 group-hover:text-white transition-colors`}>
                    <ArrowUpRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HIGH-DENSITY "HARD UI" TRUST SECTION */}
        <div className="relative bg-[#020617] rounded-[4rem] p-8 md:p-16 lg:p-20 overflow-hidden shadow-3xl shadow-blue-500/10 border border-white/5">

          {/* Cyber Grid & Data Streams */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>

          {/* Kinetic Elements */}
          <div className="absolute h-px w-[60%] bg-gradient-to-r from-transparent via-blue-500 to-transparent top-0 left-1/2 -translate-x-1/2 animate-laser-move"></div>
          <div className="absolute h-[60%] w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent top-1/2 -translate-y-1/2 right-0 animate-laser-vertical"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Side: Information Density Area (4 cols) */}
            <div className="lg:col-span-5 text-left space-y-10">
              <div>
                <div className="group relative inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 mb-8 transition-all hover:border-blue-500/30">
                  <div className="flex items-center space-x-2">
                    <Fingerprint size={16} className="text-blue-400 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] leading-none">Identity Verified</span>
                  </div>
                  <div className="w-[1px] h-3 bg-white/20"></div>
                  <span className="text-[9px] font-mono text-slate-500">ID: DOM-INTEL-889</span>
                </div>

                <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                  Trust The <br />
                  <span className="text-blue-500 italic drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">Infrastructure.</span>
                </h3>

                <p className="text-base text-slate-400 font-medium leading-relaxed max-w-sm mb-10 opacity-80">
                  Institutional-grade nodes verify every metric in real-time. We provide zero-trust digital asset forensics.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="group relative bg-white dark:bg-slate-800 text-slate-950 dark:text-white px-8 py-5 rounded-2xl font-black text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl uppercase flex items-center gap-3">
                  <span>Initiate Protocol</span>
                  <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-slate-900 text-white/40 px-8 py-5 rounded-2xl font-black text-[11px] tracking-widest border border-slate-800 hover:text-white hover:bg-slate-800 transition-all uppercase flex items-center gap-3">
                  <Box size={14} />
                  <span>Node Specs</span>
                </button>
              </div>

              {/* System Readouts Overlay */}
              <div className="pt-10 border-t border-white/5 flex items-center gap-8 opacity-40">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-blue-400 uppercase mb-1">Status</span>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">Online</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-blue-400 uppercase mb-1">Protocol</span>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">v4.2.1</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-blue-400 uppercase mb-1">Auth</span>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">AES-256</span>
                </div>
              </div>
            </div>

            {/* Right Side: High-Density Tech Grid (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Real accurate metrics', icon: <Target size={22} className="text-blue-400" />, sub: '6h REFRESH', id: 'M-01', p: 92, accent: 'blue' },
                { label: 'Automated data', icon: <CpuIcon size={22} className="text-amber-400" />, sub: 'AI ENGINE', id: 'M-02', p: 88, accent: 'amber' },
                { label: 'Secure escrow', icon: <Lock size={22} className="text-emerald-400" />, sub: 'MULTI-SIG', id: 'M-03', p: 99, accent: 'emerald' },
                { label: 'Verified domains', icon: <ShieldAlert size={22} className="text-rose-400" />, sub: 'FORENSIC', id: 'M-04', p: 95, accent: 'rose' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-7 rounded-[2.5rem] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-700 overflow-hidden flex flex-col justify-between h-[220px]"
                >
                  {/* Grid Highlight */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 bg-slate-950/80 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-${item.accent}-500/40 transition-all shadow-2xl group-hover:scale-110 group-hover:rotate-6`}>
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 font-bold">{item.id}</span>
                  </div>

                  <div>
                    <h4 className={`text-white font-black text-sm mb-1 uppercase tracking-tight group-hover:text-white/100 transition-colors`}>{item.label}</h4>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${item.accent}-500 shadow-[0_0_8px_rgba(var(--${item.accent}-500),0.6)] animate-pulse`}></div>
                      <span className={`text-[9px] text-${item.accent}-400/70 font-black tracking-[0.2em] uppercase`}>{item.sub}</span>
                    </div>

                    {/* Hard UI Progress Indictor */}
                    <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                      <div
                        className={`absolute top-0 left-0 h-full bg-${item.accent}-500/60 transition-all duration-1000`}
                        style={{ width: `${item.p}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                      <span>Efficiency</span>
                      <span>{item.p}%</span>
                    </div>
                  </div>

                  {/* Technical Detail Overlay - Corners */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={12} className="text-white/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes laser-move {
          0% { transform: translateX(-100%) skewX(45deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(100%) skewX(45deg); opacity: 0; }
        }
        @keyframes laser-vertical {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-laser-move {
          animation: laser-move 8s linear infinite;
        }
        .animate-laser-vertical {
          animation: laser-vertical 12s linear infinite;
        }
      `}} />
    </section>
  );
};

export default Services;

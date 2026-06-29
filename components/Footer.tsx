
import React from 'react';
import { 
  Twitter, Linkedin, Facebook, Send, Mail, MapPin, 
  Cpu, ShieldCheck, Globe, Zap, 
  ArrowUpRight, Terminal, Fingerprint, Activity,
  Binary, Command, Code
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#020617] pt-16 pb-8 overflow-hidden border-t border-white/10">
      {/* Technical UI Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.03]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
        {/* Ambient Corner Glow */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Section 1: Brand & Credit (Compact) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col space-y-4">
              <a href="#" className="flex items-center space-x-3 group w-fit">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-2xl transition-all group-hover:scale-105 group-hover:rotate-6">
                  D
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-black tracking-tighter text-white">DomIntel</span>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Institutional Hub</span>
                </div>
              </a>
              <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-xs border-l border-white/10 pl-4">
                Global gold standard for digital asset forensics. Verified by the BlackQuantum industrial node network.
              </p>
            </div>

            {/* Credit Module: High Density */}
            <div className="relative group max-w-xs">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/[0.03] border border-white/5 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between transition-all group-hover:bg-white/[0.05]">
                <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-blue-500/50">
                      <Cpu size={14} className="text-blue-400" />
                   </div>
                   <div>
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Engineered by</div>
                      <div className="text-[11px] font-black text-white uppercase tracking-tight">BlackQuantum Industries</div>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center space-x-1 mb-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      <span className="text-[8px] font-mono text-emerald-500/80">LIVE_v4.8</span>
                   </div>
                   <Code size={10} className="text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Nav Links (Unified Column) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-black text-white/40 mb-5 uppercase tracking-[0.2em] text-[9px] flex items-center gap-2">
                <Command size={10} className="text-blue-500" /> Platform
              </h4>
              <ul className="space-y-3">
                {['Marketplace', 'Domain Search', 'Pricing', 'API Access'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[11px] text-slate-500 hover:text-white font-black transition-colors uppercase tracking-widest">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-white/40 mb-5 uppercase tracking-[0.2em] text-[9px] flex items-center gap-2">
                <ShieldCheck size={10} className="text-rose-500" /> Legal
              </h4>
              <ul className="space-y-3">
                {['Documentation', 'Terms', 'Privacy', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[11px] text-slate-500 hover:text-white font-black transition-colors uppercase tracking-widest">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Tech Newsletter Area */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-black text-white/40 mb-5 uppercase tracking-[0.2em] text-[9px] flex items-center gap-2">
              <Activity size={10} className="text-amber-500" /> Terminal Feed
            </h4>
            
            <div className="flex flex-col space-y-4">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="ENCRYPTED EMAIL ADDRESS..." 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-[10px] font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg flex items-center justify-center transition-all group-hover:scale-95">
                  <Send size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-colors cursor-pointer">
                  <Mail size={12} className="text-slate-500 group-hover:text-blue-400" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">intel@domintel.com</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-colors cursor-pointer">
                  <MapPin size={12} className="text-slate-500 group-hover:text-blue-400" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">SF_CALIFORNIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Footer Bar: High Density */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-8">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">© {new Date().getFullYear()} DOMINTEL_NET</span>
            <div className="hidden sm:flex items-center space-x-4 opacity-50">
               <div className="flex items-center space-x-1.5">
                  <Terminal size={10} className="text-blue-500" />
                  <span className="text-[8px] font-mono text-slate-500">SYS: STABLE</span>
               </div>
               <div className="flex items-center space-x-1.5">
                  <Binary size={10} className="text-rose-500" />
                  <span className="text-[8px] font-mono text-slate-500">ENC: AES-256</span>
               </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-2">
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/10 hover:border-blue-500/30 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center space-x-3 group cursor-pointer grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Powered by</span>
               <div className="text-[10px] font-black text-white italic tracking-tighter group-hover:text-blue-400 transition-colors">BLACKQUANTUM</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import { 
  Twitter, Linkedin, Facebook, Send, Mail, MapPin, 
  Cpu, ShieldCheck, Globe, Zap, 
  ArrowUpRight, Terminal, Fingerprint, Activity,
  Binary, Command, Code, Github
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-50 dark:bg-[#020617] pt-16 pb-8 overflow-hidden border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      {/* Technical UI Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.4] dark:opacity-[0.03]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
        {/* Ambient Corner Glow */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Section 1: Brand & Credit (Compact) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic transform rotate-3 shadow-2xl shadow-blue-500/20">D</div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter uppercase leading-none">DomIntel</span>
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] mt-1.5">Command_Node</span>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 font-bold mb-8 max-w-sm text-sm">
                The premier ecosystem for high-liquidity digital assets. Verified metrics, zero-trust security, and institutional-grade acquisition.
              </p>
            </div>

            {/* Credit Module: High Density */}
            <div className="relative group max-w-xs">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between transition-all group-hover:bg-slate-50 dark:group-hover:bg-white/[0.05] shadow-sm dark:shadow-none">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Mainnet Status</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">100% ONLINE</span>
              </div>
            </div>
          </div>

          {/* Section 2: Nav Links (Unified Column) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Terminal size={14} className="text-blue-600" /> Protocols
              </h4>
              <ul className="space-y-4">
                {['Acquisition', 'Liquidity Pools', 'Asset Valuation', 'Smart Contracts'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group">
                      <ArrowUpRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                      <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white/40 mb-5 uppercase tracking-[0.2em] text-[9px] flex items-center gap-2">
                <ShieldCheck size={10} className="text-rose-500" /> Legal
              </h4>
              <ul className="space-y-3">
                {['Documentation', 'Terms', 'Privacy', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[11px] text-slate-600 dark:text-slate-500 hover:text-blue-600 dark:hover:text-white font-black transition-colors uppercase tracking-widest">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Tech Newsletter Area */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Activity size={14} className="text-blue-600" /> Operations
            </h4>
            
            <div className="space-y-4 mb-8">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder="Enter clearance code..." 
                    className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl px-5 py-4 text-[10px] font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <button className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    <Command size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl group hover:border-slate-300 dark:hover:border-white/10 transition-colors cursor-pointer shadow-sm dark:shadow-none">
                  <Mail size={16} className="text-slate-500 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">sys.admin@domintel.io</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl group hover:border-slate-300 dark:hover:border-white/10 transition-colors cursor-pointer shadow-sm dark:shadow-none">
                  <MapPin size={16} className="text-slate-500 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">Node 01, Silicon Valley, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Footer Bar: High Density */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>&copy; {new Date().getFullYear()} DomIntel Corp</span>
            <span className="w-1 h-1 bg-blue-600 rounded-full mx-2"></span>
            <span>All Systems Operational</span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex space-x-3">
              {[Twitter, Linkedin, Facebook, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-600 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-500/30 transition-all shadow-sm dark:shadow-none">
                  <Icon size={14} />
                </a>
              ))}
            </div>
            
            <div className="hidden md:block h-4 w-px bg-slate-300 dark:bg-white/10"></div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
              <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">TOS_Protocol</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy_Core</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Cookies_Log</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

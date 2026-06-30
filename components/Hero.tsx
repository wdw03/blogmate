import React from 'react';
import { Search, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SpinningChakri: React.FC<{ color?: string }> = ({ color = "text-blue-600 dark:text-blue-400" }) => (
  <span className="inline-flex items-center justify-center align-middle mx-1 relative">
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      whileHover={{ scale: 1.3, rotate: 720, transition: { duration: 0.6 } }}
      className={`inline-block ${color} drop-shadow-[0_0_15px_rgba(37,99,235,0.8)] cursor-pointer`}
    >
      <svg viewBox="0 0 100 100" className="w-[0.82em] h-[0.82em]">
        {/* Outer 12-point sharp geometric Chakri / Star */}
        <polygon 
          points="50,0 61,32 93,25 71,50 93,75 61,68 50,100 39,68 7,75 29,50 7,25 39,32" 
          fill="currentColor" 
        />
        {/* Concentric rings inside the Chakri */}
        <circle cx="50" cy="50" r="18" className="fill-white dark:fill-slate-950 stroke-current stroke-[5]" />
        <circle cx="50" cy="50" r="7" fill="currentColor" />
      </svg>
    </motion.span>
  </span>
);

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
          <div className="w-full max-w-5xl">
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.08] text-slate-950 dark:text-white mb-14 transition-all duration-500 select-none cursor-default uppercase">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="block mb-2"
                >
                  <span className="inline-block transition-all duration-300 hover:scale-[1.02] [-webkit-text-stroke:1px_rgba(37,99,235,0.2)] hover:[-webkit-text-stroke:2px_#2563eb] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-500 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:via-cyan-300 dark:hover:to-purple-400">
                    W<SpinningChakri />RLD'S PREMIER MARKETPLACE
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="block mb-2"
                >
                  <span className="inline-block transition-all duration-300 hover:scale-[1.02] hover:text-slate-700 dark:hover:text-slate-200">
                    F<SpinningChakri />R HIGH-AUTH<SpinningChakri color="text-indigo-500 dark:text-cyan-400" />RITY
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block"
                >
                  <span className="inline-block relative text-blue-600 dark:text-blue-400 italic transition-all duration-500 hover:scale-[1.04] hover:drop-shadow-[0_0_35px_rgba(37,99,235,0.9)] [-webkit-text-stroke:1px_rgba(59,130,246,0.3)] hover:[-webkit-text-stroke:2px_#60a5fa]">
                    PREMIUM DIGITAL ASSETS.
                  </span>
                </motion.div>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 mb-16"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

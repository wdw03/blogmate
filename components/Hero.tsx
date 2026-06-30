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

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 relative">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-full">
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-8"
              >
                <h6 className="inline-flex items-center bg-black text-white border-2 border-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-[0.25em] shadow-2xl hover:scale-105 transition-all">
                  <Sparkles size={16} className="text-blue-400 animate-pulse mr-2.5" />
                  <span>Premium Platform Intelligence</span>
                </h6>
              </motion.div>

              <h1 
                aria-label="World's premier marketplace for high-authority premium digital assets."
                className="text-[1.4rem] sm:text-[2.2rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4.5rem] font-black tracking-tighter leading-[1.15] text-slate-950 dark:text-white mb-14 transition-all duration-500 select-none cursor-default w-full"
              >
                {/* Line 1: World's premier marketplace */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="block mb-2 sm:mb-4 w-full"
                >
                  <span className="inline-block whitespace-nowrap transition-all duration-300 hover:scale-[1.02] [-webkit-text-stroke:1px_rgba(245,158,11,0.3)] hover:[-webkit-text-stroke:2px_#f59e0b] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-amber-500 hover:via-orange-600 hover:to-red-500 py-1 px-2 rounded-2xl">
                    W<SpinningChakri color="text-amber-500 dark:text-amber-400" />rld's premier marketplace
                  </span>
                </motion.div>
                
                {/* Line 2: for high-authority premium */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="block mb-2 sm:mb-4 w-full"
                >
                  <span className="inline-block whitespace-nowrap transition-all duration-300 hover:scale-[1.02] [-webkit-text-stroke:1px_rgba(16,185,129,0.3)] hover:[-webkit-text-stroke:2px_#10b981] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 py-1 px-2 rounded-2xl">
                    f<SpinningChakri color="text-emerald-500 dark:text-emerald-400" />r high-auth<SpinningChakri color="text-cyan-500 dark:text-teal-400" />rity premium
                  </span>
                </motion.div>
                
                {/* Line 3: digital assets. */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block w-full"
                >
                  <span className="inline-block whitespace-nowrap relative text-blue-600 dark:text-blue-400 italic transition-all duration-500 hover:scale-[1.04] hover:drop-shadow-[0_0_35px_rgba(59,130,246,0.9)] [-webkit-text-stroke:1px_rgba(59,130,246,0.3)] hover:[-webkit-text-stroke:2px_#60a5fa] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-500 hover:to-purple-600 py-1 px-2 rounded-2xl">
                    digital assets.
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

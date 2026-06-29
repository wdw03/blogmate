
import React, { useState, useEffect } from 'react';

const words = ["Intelligence", "Marketplace", "Analytics", "Security", "Acquisition"];

const AnimatedHeadline: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsChanging(false);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-8">
      <div className="flex flex-col gap-1">
        <span className="text-slate-400 text-sm font-black tracking-[0.3em] uppercase opacity-70 mb-2 block">Enterprise Protocol</span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-[-0.04em]">
          Institutional <br />
          <div className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
            <span 
              className={`block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isChanging ? 'translate-y-[-100%] opacity-0 scale-95 blur-sm' : 'translate-y-0 opacity-100 scale-100 blur-0'
              } gradient-text pb-2`}
            >
              {words[index]}
            </span>
          </div>
          <span className="block text-slate-900">Hub.</span>
        </h1>
      </div>
      
      {/* Precision underline */}
      <div className="flex gap-1 mt-4">
        <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
        <div className="h-1.5 w-1.5 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="h-1.5 w-1.5 bg-blue-200 rounded-full animate-pulse delay-75"></div>
      </div>
    </div>
  );
};

export default AnimatedHeadline;

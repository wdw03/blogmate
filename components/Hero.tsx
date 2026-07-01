import React from 'react';
import { ArrowRight, BarChart3, CheckCircle2, Globe2, Network, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <section className="relative overflow-hidden bg-white pb-4 sm:pb-6 pt-[clamp(6.5rem,9vw,8rem)] transition-colors duration-300 dark:bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:30px_30px] opacity-35 dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-[120px] dark:bg-blue-600/10" />
      <div className="absolute -right-20 top-10 h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-[140px] dark:bg-cyan-500/10" />

      <div className="relative mx-auto grid w-full max-w-[1450px] items-center gap-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,4vw,2.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(330px,.72fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
        <motion.div initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="order-1 min-w-0 text-center lg:text-left">
          <div className="mb-[clamp(.75rem,1.8vw,1rem)] inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-[8px] min-[380px]:px-4 min-[380px]:text-[9px] font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm backdrop-blur dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
            <Sparkles size={14} className="shrink-0 animate-pulse" /> <span className="truncate">The smarter marketplace for digital growth</span>
          </div>

          <h1 className="text-[clamp(1.85rem,4.4vw,3.25rem)] font-black leading-[1.02] tracking-[-0.06em] text-slate-950 dark:text-white">
            Find Highly .gp Domains.
            <span className="mt-2 block bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">Build Website Authority.</span>
          </h1>


          <div className="mx-auto mt-3 flex max-w-xl flex-wrap justify-center gap-2 lg:mx-0 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 size={13} /> Verified listings</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><ShieldCheck size={13} /> Secure orders</span>
          </div>


          <div className="mt-3 flex flex-col items-center gap-3 min-[400px]:flex-row lg:justify-start">
            <a href="#/services" onClick={(e) => handleNav(e, "#/services")} className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-[9px] font-black uppercase tracking-[.14em] text-blue-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 min-[400px]:w-auto">
              Explore services <Sparkles size={14} className="transition-transform group-hover:rotate-12" />
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] sm:gap-x-5 sm:text-[11px] font-bold text-slate-500 lg:justify-start">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" /> Live marketplace</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 35, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="order-2 relative mx-auto w-full max-w-[clamp(265px,58vw,420px)] lg:mr-0">
          <div className="absolute -inset-5 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[clamp(1.35rem,3vw,2.25rem)] border border-slate-200/80 bg-slate-950 p-[clamp(.7rem,2vw,1.1rem)] shadow-[0_35px_100px_-25px_rgba(15,23,42,0.55)] sm:rounded-[2.25rem] sm:p-4">
            <div className="mb-[clamp(.75rem,2vw,1.25rem)] flex min-w-0 items-center justify-between gap-2 border-b border-white/10 pb-[clamp(.75rem,2vw,1rem)]">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Network size={18} /></span><div className="min-w-0"><p className="truncate text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-white">Network intelligence</p><p className="mt-0.5 truncate text-[8px] sm:text-[9px] font-bold text-slate-500">GLOBAL SIGNAL MAP / LIVE</p></div></div>
              <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
            </div>

            <div className="relative h-[clamp(185px,42vw,215px)] overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:36px_36px] opacity-35" />
              <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 500 300" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="domainLine" x1="0" x2="1"><stop stopColor="#2563eb" stopOpacity="0" /><stop offset=".5" stopColor="#38bdf8" /><stop offset="1" stopColor="#2563eb" stopOpacity="0" /></linearGradient>
                  <filter id="signalGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <g fill="none" stroke="url(#domainLine)" strokeWidth="1.5" strokeDasharray="6 6">
                  <path id="route-us" d="M250 105 Q165 35 80 55" /><path id="route-eu" d="M250 105 Q335 32 420 60" /><path id="route-br" d="M250 105 Q165 175 95 215" /><path id="route-au" d="M250 105 Q340 175 410 218" />
                </g>
                <g fill="#67e8f9" filter="url(#signalGlow)">
                  <circle r="4"><animateMotion dur="2.2s" repeatCount="indefinite"><mpath href="#route-us" /></animateMotion></circle>
                  <circle r="3.5"><animateMotion dur="2.7s" begin="-.8s" repeatCount="indefinite"><mpath href="#route-eu" /></animateMotion></circle>
                  <circle r="4"><animateMotion dur="3s" begin="-1.4s" repeatCount="indefinite"><mpath href="#route-br" /></animateMotion></circle>
                  <circle r="3.5"><animateMotion dur="2.5s" begin="-.4s" repeatCount="indefinite"><mpath href="#route-au" /></animateMotion></circle>
                </g>
                <g fill="none" stroke="#22d3ee" strokeWidth="1">
                  <circle cx="80" cy="55" r="7"><animate attributeName="r" values="4;14;4" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="420" cy="60" r="7"><animate attributeName="r" values="4;14;4" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite" /></circle>
                  <circle cx="95" cy="215" r="7"><animate attributeName="r" values="4;13;4" dur="2.7s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0;1" dur="2.7s" repeatCount="indefinite" /></circle>
                  <circle cx="410" cy="218" r="7"><animate attributeName="r" values="4;13;4" dur="2.2s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0;1" dur="2.2s" repeatCount="indefinite" /></circle>
                </g>
              </svg>

              <motion.div animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-[11%] h-[clamp(4.5rem,15vw,6rem)] w-[clamp(4.5rem,15vw,6rem)] -translate-x-1/2 rounded-full border border-cyan-300/50 bg-[radial-gradient(circle_at_35%_30%,#38bdf8,#1d4ed8_48%,#07111f_72%)] shadow-[0_0_55px_rgba(14,165,233,.45)]">
                <div className="absolute inset-[12%] rounded-full border border-white/20" />
                <div className="absolute left-1/2 top-0 h-full w-[38%] -translate-x-1/2 rounded-[50%] border-x border-cyan-100/25" />
                <div className="absolute left-0 top-1/2 h-[35%] w-full -translate-y-1/2 rounded-[50%] border-y border-cyan-100/25" />
                <Globe2 className="absolute inset-0 m-auto text-white/90" size="34%" />
              </motion.div>
              <div className="absolute left-1/2 top-[52%] -translate-x-1/2 whitespace-nowrap rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-[.18em] text-blue-200">Global domain network</div>

              <DomainNode className="left-[5%] top-[11%]" domain="techflow.io" metric="DA 72" delay={0} />
              <DomainNode className="right-[4%] top-[13%]" domain="finpeak.com" metric="DR 81" delay={0.5} />
              <DomainNode className="left-[7%] top-[67%]" domain="healthwire.co" metric="18K traffic" delay={1} />
              <DomainNode className="right-[5%] top-[68%]" domain="dailybyte.net" metric="DA 68" delay={1.5} />

            </div>
          </div>

          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-2 top-12 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-slate-900 sm:block lg:-right-5">
            <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> System online</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const DomainNode = ({ className, domain, metric, delay }: { className: string; domain: string; metric: string; delay: number }) => (
  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, delay, repeat: Infinity }} className={`absolute ${className}`}>
    <div className="relative rounded-xl border border-cyan-400/20 bg-slate-950/85 px-2 py-1.5 shadow-[0_0_22px_rgba(34,211,238,.12)] backdrop-blur sm:px-2.5">
      <span className="absolute -left-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
      <strong className="block max-w-[90px] truncate text-[8px] font-black text-white sm:text-[9px]">{domain}</strong>
      <span className="mt-0.5 block text-[7px] font-bold uppercase tracking-wider text-cyan-400">{metric}</span>
    </div>
  </motion.div>
);


export default Hero;

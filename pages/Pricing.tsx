
import React, { useState } from 'react';
import { 
  Check, Zap, Shield, Crown, Terminal, Activity, 
  Lock, Cpu, Globe, ArrowRight, Sparkles, Binary,
  ShieldCheck, Command, Database, Server, Fingerprint
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Terminal',
      tier: 'BASIC_v1',
      description: 'Standard access for independent domain hunters.',
      price: { monthly: 0, annual: 0 },
      icon: <Terminal className="w-6 h-6" />,
      features: [
        '5 Domain Forensics / Day',
        'Basic SEO Metrics',
        'Standard Search Filters',
        'Community Support',
        'Manual Escrow Protocol'
      ],
      cta: 'Start Scouting',
      highlight: false,
      color: 'slate'
    },
    {
      name: 'Validator',
      tier: 'PRO_v4',
      description: 'Professional grade metrics for portfolio scaling.',
      price: { monthly: 49, annual: 39 },
      icon: <Zap className="w-6 h-6" />,
      features: [
        '100 Domain Forensics / Day',
        'Full SEO Validator Suite',
        'API Read-only Access',
        'Priority Node Queue',
        'Toxic Link Detection',
        '24h TAT Guarantee'
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
      color: 'blue'
    },
    {
      name: 'Institutional',
      tier: 'CORE_ELITE',
      description: 'Zero-latency infrastructure for enterprise hubs.',
      price: { monthly: 199, annual: 159 },
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Unlimited Forensics',
        'Multi-sig Smart Escrow',
        'Full Write-API Access',
        'Dedicated Node Server',
        'Institutional Risk Reports',
        'Account Architect Support',
        'Early Access to Drops'
      ],
      cta: 'Contact Sales',
      highlight: false,
      color: 'emerald'
    }
  ];

  const handlePlanClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.hash = '/login';
      return;
    }
    // Proceed with upgrade/scouting logic
    alert("Initializing plan subscription sequence...");
  };

  return (
    <div className="pt-32 pb-24 bg-[#020617] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-xl mb-6">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Pricing Protocols v4.8</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter mb-6">
            Scalable <span className="text-blue-500 italic drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Infrastructure.</span> <br />
            Transparent Cost.
          </h1>
          
          <p className="text-slate-400 font-medium max-w-lg text-base opacity-80 mb-10">
            Institutional marketplace access optimized for high-liquidity asset acquisition. Choose your operational tier.
          </p>

          <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                billingCycle === 'monthly' ? 'text-slate-900 bg-white shadow-xl' : 'text-slate-500 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`relative z-10 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                billingCycle === 'annual' ? 'text-slate-900 bg-white shadow-xl' : 'text-slate-500 hover:text-white'
              }`}
            >
              Annual Access
            </button>
            {billingCycle === 'annual' && (
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/50 animate-bounce">
                SAVE 20%
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`group relative flex flex-col p-8 rounded-[2rem] border transition-all duration-700 ${
                plan.highlight 
                  ? 'bg-white/[0.05] border-blue-500/30 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.25)] scale-105 z-20 hover:border-blue-500/60' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/20 z-10'
              }`}
            >
              <div className="absolute top-6 right-6 text-[8px] font-mono text-white/20 font-bold tracking-tighter">
                MOD_PRC_{plan.tier}
              </div>

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                  plan.highlight 
                    ? 'bg-blue-600 text-white border-white/20 shadow-xl shadow-blue-500/20' 
                    : 'bg-white/5 text-slate-400 border-white/5'
                }`}>
                  {plan.icon}
                </div>
                <div className="flex items-center space-x-3 mb-2">
                   <h3 className="text-2xl font-black text-white tracking-tighter">{plan.name}</h3>
                   {plan.highlight && (
                     <span className="bg-blue-500/20 text-blue-400 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-[0.2em] border border-blue-500/20">Popular</span>
                   )}
                </div>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">
                  ${billingCycle === 'annual' ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">/ Month</span>
              </div>

              <div className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center space-x-3 group/item">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      plan.highlight ? 'bg-blue-600/20 border-blue-500/40' : 'bg-white/5 border-white/10'
                    }`}>
                      <Check size={10} className={plan.highlight ? 'text-blue-400' : 'text-slate-500'} strokeWidth={3} />
                    </div>
                    <span className="text-[12px] font-bold text-slate-400 group-hover/item:text-white transition-colors tracking-tight">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handlePlanClick}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                plan.highlight 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-95' 
                  : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
              }`}>
                {plan.cta}
                <ArrowRight size={12} strokeWidth={3} />
              </button>

              {plan.highlight && (
                <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-24 pt-16 border-t border-white/5 relative">
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div className="max-w-lg">
               <div className="flex items-center space-x-3 mb-5">
                  <Fingerprint size={18} className="text-blue-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Zero-Trust Security</span>
               </div>
               <h2 className="text-3xl font-black text-white tracking-tight mb-6">
                 Institutional-Grade <br />
                 <span className="text-blue-500 italic">Protection Protocols.</span>
               </h2>
               <p className="text-slate-400 font-medium leading-relaxed mb-8 text-sm">
                 Every tier includes AES-256 encryption, SOC2 Type II compliance, and real-time DNS forensic scanning as standard architecture.
               </p>
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                     <Lock size={16} className="text-emerald-500 mb-2" />
                     <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">AES-256</div>
                     <div className="text-[8px] font-bold text-slate-600 uppercase">Standard Encryption</div>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                     <Server size={16} className="text-blue-500 mb-2" />
                     <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Multi-Node</div>
                     <div className="text-[8px] font-bold text-slate-600 uppercase">Global Redundancy</div>
                  </div>
               </div>
            </div>

            <div className="w-full lg:w-[450px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[2rem] p-8 shadow-3xl">
               <div className="flex items-center justify-between mb-8">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">System Stats</span>
                  <Binary size={14} className="text-slate-600" />
               </div>
               
               <div className="space-y-6">
                  <StatLine label="Network Latency" value="24ms" p={94} color="blue" />
                  <StatLine label="Metric Accuracy" value="99.9%" p={99} color="emerald" />
                  <StatLine label="Node Uptime" value="100%" p={100} color="blue" />
                  <StatLine label="Encryption Strength" value="RSA-4096" p={92} color="amber" />
               </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center p-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] shadow-3xl shadow-blue-600/20 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
           
           <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter">Ready to Scale Your Digital Portfolio?</h2>
             <p className="text-blue-100 text-base font-medium max-w-xl mx-auto mb-10 opacity-80">
               Join 5,000+ institutional investors who rely on BlogMet's proprietary forensics to secure high-value digital assets.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handlePlanClick}
                  className="bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Create Account
                </button>
                <button 
                  onClick={handlePlanClick}
                  className="bg-slate-900/40 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-3"
                >
                  <Command size={12} /> View Documentation
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatLine = ({ label, value, p, color }: { label: string, value: string, p: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
      <span className="text-slate-500">{label}</span>
      <span className="text-white">{value}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 bg-${color}-500/60 shadow-[0_0_8px_rgba(var(--${color}-500),0.5)]`}
        style={{ width: `${p}%` }}
      ></div>
    </div>
  </div>
);

export default Pricing;

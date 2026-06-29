
import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Send, ShieldCheck, Zap, 
  Cpu, Globe, Terminal, Activity, MessageSquare, 
  Clock, Fingerprint, Lock, ArrowRight, Sparkles, 
  Binary, Command, Database, Headphones, Scan,
  Radio, Wifi, Server, ShieldAlert, ChevronRight,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(21 + Math.floor(Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.hash = '#/login';
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Transmission successful. Our support node will respond shortly.");
    }, 2000);
  };

  return (
    <div className="pt-40 pb-24 bg-[#f8fafc] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_0.8px,transparent_0.8px)] bg-[size:32px_32px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
              Partner Support
            </span>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Node: {ping}ms</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Institutional <span className="text-blue-600">Inquiry.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Connect with our specialized domain acquisition team for secure digital asset management and institutional support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <ContactPill 
              icon={<Mail size={20} />}
              label="Email Gateway"
              value="dilkashr690@gmail.com"
              sub="Secure Primary Channel"
            />
            <ContactPill 
              icon={<Phone size={20} />}
              label="Direct Line"
              value="+91 99554 78552"
              sub="Mon-Fri, 9am - 6pm IST"
            />
            <ContactPill 
              icon={<MapPin size={20} />}
              label="Location"
              value="Ranchi, Jharkhand, India"
              sub="Headquarters Node"
            />

            <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em]">System Manifest</span>
                    <Terminal size={14} className="text-slate-600" />
                  </div>
                  <div className="space-y-4">
                     <TechRow label="Priority Level" value="Institutional" />
                     <TechRow label="Security Mode" value="Quantum Encrypted" />
                     <TechRow label="Node Region" value="Asia_SE_01" />
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                  <ShieldCheck size={120} />
               </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 lg:p-12 shadow-xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                       <MessageSquare size={22} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transmission Portal</h2>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Encrypted Channel Established</span>
                    </div>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <RefinedInput label="FullName" placeholder="John Doe" type="text" required />
                     <RefinedInput label="EmailAddress" placeholder="john@company.com" type="email" required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RefinedInput label="AssetID" placeholder="Optional Domain Ref" type="text" />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none">
                        <option>Standard Inquiry</option>
                        <option>Urgent Acquisition</option>
                        <option>Institutional Partnership</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">PayloadMessage</label>
                     <textarea 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all h-40 resize-none shadow-inner"
                        placeholder="Describe your requirements or project parameters..."
                     ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                     <div className="flex items-center gap-3">
                        <Lock size={16} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encryption Enabled</span>
                     </div>

                     <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`group relative bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70' : ''}`}
                     >
                        {isSubmitting ? 'Transmitting...' : 'Send Transmission'}
                        {!isSubmitting && <ArrowRight size={16} />}
                     </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPill = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-start gap-5 hover:border-blue-500/30 transition-all group">
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
       <span className="text-base font-black text-slate-900 tracking-tight mb-1">{value}</span>
       <span className="text-[10px] font-medium text-slate-500">{sub}</span>
    </div>
  </div>
);

const TechRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
    <span className="text-slate-500">{label}</span>
    <span className="text-white">{value}</span>
  </div>
);

const RefinedInput = ({ label, placeholder, type, required }: { label: string, placeholder: string, type: string, required?: boolean }) => (
  <div className="flex flex-col gap-2">
     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <input 
        type={type} 
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
     />
  </div>
);

export default Contact;

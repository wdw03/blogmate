
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, ArrowRight, ShieldCheck, 
  Loader2, Globe, ArrowLeft, Eye, EyeOff,
  Check, Building2, Phone, Zap, Key, Shield
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendEmailViaEmailJS } from '../lib/emailService';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sysTime, setSysTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setSysTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            full_name: fullName,
            phone: phone,
            company: company
          } 
        },
      });
      if (authError) throw authError;

      // Trigger Welcome Email via EmailJS
      const env = import.meta.env;
      await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_WELCOME, {
        name: fullName,
        to_email: email,
        login_url: `${window.location.origin}/#/login`
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  const passValid = {
    length: password.length >= 8,
    symbol: /[0-9!@#$%^&*]/.test(password),
    case: /[a-z]/.test(password) && /[A-Z]/.test(password)
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#020617] flex items-center justify-center p-4 font-['Inter']">
        <div className="bg-white rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.2)] max-w-2xl w-full text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mb-6 sm:mb-8 shadow-2xl animate-pulse">
              <Mail size={48} strokeWidth={2.5} />
            </div>
            
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Email Verification Required</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-6 italic tracking-tighter uppercase leading-none">
              Account Created.
            </h2>
            
            <p className="text-slate-500 font-bold mb-12 leading-relaxed uppercase tracking-tight text-[11px] opacity-80 max-w-sm mx-auto">
              A verification link has been sent to: <span className="text-slate-900 font-black">{email}</span>. Please check your inbox to activate your account.
            </p>

            <button 
              onClick={() => navigateTo('#/login')}
              className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <div className="flex items-center justify-center gap-4">
                <span>Go to Login</span>
                <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#020617] flex items-center justify-center p-3 sm:p-6 overflow-x-hidden overflow-y-auto font-['Inter'] selection:bg-blue-600 selection:text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="w-full max-w-[1100px] min-h-0 lg:min-h-[680px] bg-white rounded-2xl sm:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex overflow-hidden border border-white/10 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        
        <div className="w-full lg:w-[50%] p-5 sm:p-8 md:p-10 flex flex-col justify-between relative bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between shrink-0 mb-8">
            <button 
              onClick={() => navigateTo('#/')} 
              className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
            >
              <ArrowLeft size={14} />
              <span>Go Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Already a member?</span>
              <button 
                onClick={() => navigateTo('#/login')}
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline px-3 py-1 bg-blue-50 rounded-lg"
              >
                Login
              </button>
            </div>
          </div>

          <div className="max-w-md mx-auto w-full mb-8">
            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 border border-orange-100 mb-4">
                <Zap size={12} className="text-orange-600" />
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Join our Community</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-2 tracking-tighter leading-none italic uppercase">Get Started.</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] pl-1">Create your domain management account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-tight animate-in fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RegInput icon={<User size={16} />} label="Full Name" placeholder="John Doe" value={fullName} onChange={(e: any) => setFullName(e.target.value)} required />
                <RegInput icon={<Mail size={16} />} label="Email Address" placeholder="name@email.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RegInput icon={<Phone size={16} />} label="Phone Number" placeholder="+1..." value={phone} onChange={(e: any) => setPhone(e.target.value)} />
                <RegInput icon={<Building2 size={16} />} label="Company" placeholder="Company Name" value={company} onChange={(e: any) => setCompany(e.target.value)} />
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block ml-1">Password</label>
                  <div className="relative border-2 border-slate-100 bg-slate-50 rounded-2xl focus-within:border-blue-500 focus-within:bg-white transition-all p-1">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Lock size={18} className="text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm font-black text-slate-950"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-300 hover:text-slate-950 p-1">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 px-1">
                  <StatusTag valid={passValid.length} text="8+ Characters" />
                  <StatusTag valid={passValid.symbol} text="Symbol/Digit" />
                  <StatusTag valid={passValid.case} text="A-z Case" />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block ml-1">Confirm Password</label>
                  <div className="relative border-2 border-slate-100 bg-slate-50 rounded-2xl focus-within:border-blue-500 focus-within:bg-white transition-all p-1">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <ShieldCheck size={18} className="text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="password"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm font-black text-slate-950"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Create My Account</span>
                    <ArrowRight size={18} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between shrink-0 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3">
              <Globe size={14} strokeWidth={3} className="text-blue-500" />
              <span>DomIntel Network: Global</span>
            </div>
            <div className="font-mono">{sysTime}</div>
          </div>
        </div>

        {/* RIGHT PANE: BRANDING VISUALS */}
        <div className="hidden lg:flex flex-1 relative bg-blue-600 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]"></div>
          
          <div className="relative z-10 w-full max-w-sm flex flex-col gap-10">
            <div className="bg-white rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/20 animate-float">
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <Shield size={14} className="text-blue-600" />
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Network Security</span>
                   </div>
                   <div className="text-4xl font-black text-slate-950 mt-1 tracking-tighter leading-none italic">SECURE.</div>
                 </div>
                 <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white border-[4px] border-white shadow-xl group">
                    <Check size={24} className="text-emerald-500 animate-pulse" strokeWidth={4} />
                 </div>
              </div>
              <div className="flex items-end gap-2 h-16 w-full mt-4">
                 {[40, 70, 45, 90, 65, 80, 55, 75, 85, 40, 60, 95].map((h, i) => (
                   <div 
                     key={i} 
                     style={{ height: `${h}%` }} 
                     className={`flex-1 rounded-full transition-all duration-700 ${i % 3 === 0 ? 'bg-orange-500' : 'bg-blue-600 opacity-20'}`}
                   ></div>
                 ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Marketplace</span>
                <span className="text-xs font-black text-slate-900">Verified Assets</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl group hover:scale-105 transition-all">
               <div className="flex gap-6 items-center">
                 <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all">
                    <Key size={32} className="text-blue-500" strokeWidth={2.5} />
                 </div>
                 <div className="pt-1">
                    <h3 className="text-xl font-black text-slate-900 leading-none mb-1 uppercase tracking-tighter italic">PROTECTED.</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy First Architecture</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-20px) rotate(-1deg); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
};

const RegInput = ({ icon, label, placeholder, value, onChange, required }: any) => (
  <div className="group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block ml-1">{label}</label>
    <div className="relative border-2 border-slate-100 bg-slate-50 rounded-2xl focus-within:border-blue-500 focus-within:bg-white transition-all p-1">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="text-slate-300 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input 
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-[13px] font-black text-slate-950 placeholder:text-slate-200"
          required={required}
        />
      </div>
    </div>
  </div>
);

const StatusTag = ({ valid, text }: any) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-tight transition-all border ${
    valid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'
  }`}>
    {valid ? <Check size={10} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
    <span>{text}</span>
  </div>
);

export default Signup;


import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, ArrowRight, Loader2, Globe, ArrowLeft, Eye, EyeOff,
  Activity, ShieldCheck, Zap, Fingerprint, Database, Shield, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendEmailViaEmailJS } from '../lib/emailService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sysTime, setSysTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setSysTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setResetLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}//profile`,
      });
      if (resetError) throw resetError;

      // Trigger Password Reset Email via EmailJS
      const env = import.meta.env;
      await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_PASSWORD_RESET, {
        to_email: email,
        reset_url: `${window.location.origin}//profile` // In a real app, this would be a specific reset link
      });

      setSuccess("Password reset link sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      if (user) {
        const { data: profile, error: profError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profError) throw profError;

        if (profile?.role === 'admin' || profile?.role === 'superadmin') {
          window.location.hash = '/admin';
        } else {
          window.location.hash = '/';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#020617] flex items-center justify-center p-3 sm:p-6 overflow-x-hidden overflow-y-auto font-['Inter'] selection:bg-blue-600 selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)] opacity-10"></div>
      </div>
      
      <div className="w-full max-w-[1000px] min-h-0 lg:min-h-[620px] bg-white rounded-2xl sm:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex overflow-hidden border border-white/10 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* LEFT PANE: LOGIN FORM */}
        <div className="w-full lg:w-[50%] p-5 sm:p-8 md:p-10 flex flex-col justify-between relative bg-white border-r overflow-y-auto border-slate-100">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigateTo('/')} 
              className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all hover:bg-white hover:shadow-lg"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">System</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure & Active</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full py-8 sm:py-10">
            <div className="mb-7 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 mb-4">
                <Shield size={12} className="text-blue-600" />
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Authorized Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tighter leading-none mb-4 uppercase italic">Welcome Back.</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] pl-1">Login to manage your domain portfolio</p>
            </div>

            {error && (
              <div className="mb-5 p-3 sm:p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-tight animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 sm:p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-[10px] font-black uppercase tracking-tight animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <Check size={16} />
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              <div className="space-y-4 sm:space-y-5">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block ml-1">Email Address</label>
                  <div className="relative border-2 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl transition-all p-1">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Mail size={18} className="text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="email" 
                        placeholder="yourname@email.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="flex-1 bg-transparent outline-none text-sm font-black text-slate-900 placeholder:text-slate-200" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-end mb-3 ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Password</label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      disabled={resetLoading}
                      className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline disabled:opacity-50"
                    >
                      {resetLoading ? 'Sending...' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative border-2 border-slate-100 bg-slate-50/50 rounded-2xl focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl transition-all p-1">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Lock size={18} className="text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="flex-1 bg-transparent outline-none text-sm font-black text-slate-900 placeholder:text-slate-200" 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="text-slate-300 hover:text-slate-900 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={loading} 
                className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:-translate-y-1 active:scale-[0.97] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Login to Account</span>
                    <ArrowRight size={18} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-center gap-3">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">New user?</span>
              <button 
                onClick={() => navigateTo('/signup')} 
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-xl"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] cursor-default">
            <div className="flex items-center gap-3">
              <Globe size={14} strokeWidth={3} className="text-blue-500" />
              <span>Current Server: Global</span>
            </div>
            <div className="font-mono">{sysTime}</div>
          </div>
        </div>

        {/* RIGHT PANE: BRANDING VISUALS */}
        <div className="hidden lg:flex flex-1 relative bg-slate-950 items-center justify-center overflow-hidden">
          {/* Visual Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e3a8a_0%,transparent_70%)] opacity-30"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03]"></div>
          
          <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
            {/* Status Display */}
            <div className="bg-white rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/20 animate-float">
              <div className="flex justify-between items-start mb-10">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <ShieldCheck size={14} className="text-blue-600" />
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Platform Status</span>
                   </div>
                   <div className="text-4xl font-black text-slate-950 tracking-tighter italic">RELIABLE.</div>
                 </div>
                 <div className="p-3 bg-emerald-50 rounded-2xl">
                    <Activity size={24} className="text-emerald-500 animate-pulse" />
                 </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Active Sessions</span>
                    <span className="text-slate-900">12,400+</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className="h-full w-[65%] bg-blue-600 rounded-full animate-grow-x"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Security Status</span>
                    <span className="text-emerald-500">100% Protected</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className="h-full w-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Overlay */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all cursor-default group">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={18} className="text-blue-400" />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Performance</div>
                <div className="text-xs font-black text-white uppercase tracking-tight">HIGH_SPEED</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all cursor-default group">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database size={18} className="text-amber-400" />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Database</div>
                <div className="text-xs font-black text-white uppercase tracking-tight">SYNCED</div>
              </div>
            </div>

            {/* Encryption badge */}
            <div className="flex items-center justify-center pt-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                 <Shield size={14} className="text-slate-500" />
                 <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Encryption: Bank-Level Secure</span>
              </div>
            </div>
          </div>

          {/* Background glows */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-900/20 rounded-full blur-[100px]"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes grow-x {
          from { width: 0; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-grow-x { animation: grow-x 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default Login;

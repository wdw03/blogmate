
import React, { useEffect, useState, useRef } from 'react';
import { 
  User, Mail, ShieldCheck, Key, Terminal, LogOut, Loader2, 
  Activity, Database, Server, Fingerprint, Command, Star, 
  Calendar, ArrowRight, Share2, MessageSquare, Plus,
  MoreHorizontal, MapPin, Briefcase, Globe, Zap,
  Heart, LayoutGrid, Settings, Info, CheckCircle,
  Bell, History, Trash2, Save, Phone, Building2,
  Wallet, TrendingUp, ShoppingBag, CreditCard, RefreshCcw,
  ArrowUpRight, ArrowDownLeft, ShieldAlert, X, CreditCard as CardIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import PayPalGateway from '../components/payment/PayPalGateway';
import RazorpayGateway from '../components/payment/RazorpayGateway';

const STICKERS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffcfd2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=d1d4f9",
];

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Wallet');
  const [stickerUrl, setStickerUrl] = useState(STICKERS[0]);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletStatus, setWalletStatus] = useState<'active' | 'frozen'>('active');
  
  // Wallet Modal States
  const [walletModal, setWalletModal] = useState<{show: boolean, type: 'topup' | 'withdraw', step: 'amount' | 'gateway'}>({
    show: false,
    type: 'topup',
    step: 'amount'
  });
  const [actionAmount, setActionAmount] = useState('');
  const [withdrawalDetails, setWithdrawalDetails] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<'PayPal' | 'Razorpay'>('PayPal');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/login';
  };

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.hash = '#/login';
      return;
    }
    
    const currentUser = session.user;
    setUser(currentUser);
    
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
    
    if (profile) {
      setFormData({
        fullName: profile.full_name || 'Operator',
        company: profile.company || 'Institutional Node',
        phone: profile.phone || ''
      });
      setWalletBalance(profile.wallet_balance || 0);
      setWalletStatus(profile.wallet_status || 'active');
    }

    const [orderRes, msgRes, txRes] = await Promise.all([
      supabase.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }),
      supabase.from('messages').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }),
      supabase.from('wallet_transactions').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
    ]);

    if (orderRes.data) setOrders(orderRes.data);
    if (msgRes.data) setNotifications(msgRes.data);
    if (txRes.data) setTransactions(txRes.data);
    
    const index = Math.abs(currentUser.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % STICKERS.length;
    setStickerUrl(STICKERS[index]);
    setLoading(false);
    if (isManualRefresh) setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: ''
  });

  const handleTopupSuccess = async () => {
    setSaving(true);
    const amountNum = parseFloat(actionAmount);
    try {
        await supabase.from('wallet_transactions').insert({
            user_id: user.id,
            amount: amountNum,
            type: 'topup',
            status: 'completed',
            metadata: { gateway: selectedGateway, timestamp: new Date().toISOString() }
        });
        const newBalance = walletBalance + amountNum;
        await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', user.id);
        alert(`SUCCESS: $${amountNum} add ho gaye.`);
        closeWalletModal();
        fetchData(true);
    } catch (e: any) {
        alert(e.message);
    } finally {
        setSaving(false);
    }
  };

  const handleWithdrawRequest = async () => {
    const amountNum = parseFloat(actionAmount);
    if (amountNum > walletBalance) {
        alert("Funds kam hain.");
        return;
    }
    if (!withdrawalDetails) {
        alert("Kripya withdrawal details (UPI/Bank/PayPal) bharein.");
        return;
    }
    setSaving(true);
    try {
        await supabase.from('wallet_transactions').insert({
            user_id: user.id,
            amount: amountNum,
            type: 'withdrawal',
            status: 'pending',
            metadata: { 
                request_time: new Date().toISOString(),
                details: withdrawalDetails
            }
        });

        // Notify Admin via EmailJS
        const env = import.meta.env;
        const { sendEmailViaEmailJS } = await import('../lib/emailService');
        await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_NEW_MESSAGE, {
            to_email: "dilkashr690@gmail.com",
            subject: `URGENT: Withdrawal Request from ${formData.fullName}`,
            message_snippet: `User ${formData.fullName} (${user.email}) ne $${amountNum} ka withdrawal request kiya hai. Details: ${withdrawalDetails}`,
            chat_url: `${window.location.origin}/#/admin`
        });

        alert("Request dispatched to Admin. Email sent.");
        closeWalletModal();
        fetchData(true);
    } catch (e: any) {
        alert(e.message);
    } finally {
        setSaving(false);
    }
  };

  const closeWalletModal = () => {
    setWalletModal({ show: false, type: 'topup', step: 'amount' });
    setActionAmount('');
    setWithdrawalDetails('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await supabase.from('profiles').update({
          full_name: formData.fullName,
          company: formData.company,
          phone: formData.phone
      }).eq('id', user.id);
      alert("Profile updated.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Header Section (Exactly as per Screenshot) */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16 px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] bg-[#D1D5DB] overflow-hidden border-8 border-white shadow-2xl">
                 <img src={stickerUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">
                <CheckCircle size={12} fill="currentColor" />
              </div>
            </div>

            <div className="text-center md:text-left pb-4">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{formData.fullName || 'DILKASH RAJA'}</h1>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                  NODE_VERIFIED <Zap size={10} fill="currentColor" />
                </div>
              </div>
              <p className="text-slate-400 font-bold mb-8 flex items-center justify-center md:justify-start gap-2 text-[10px] uppercase tracking-[0.2em]">
                <span className="text-slate-900">{formData.company || 'INSTITUTIONAL NODE'}</span> <span className="text-slate-200">•</span> HUB_OPERATOR_TIER_1
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-3">
                <button onClick={() => setActiveTab('Wallet')} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl flex items-center gap-3 active:scale-95">
                  <Wallet size={16} /> WALLET_HUB
                </button>
                <button onClick={handleLogout} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all shadow-sm group" title="Logout">
                  <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-12 px-12 py-8 bg-white/80 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <StatBlock label="TOTAL_ASSETS" value={String(orders.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 14)} />
            <StatBlock label="WALLET_USD" value={`$${walletBalance.toLocaleString()}`} color="text-blue-600" />
            <StatBlock label="SYS_RANK" value="#12" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 mb-12 px-6">
          <div className="flex items-center gap-10">
            {[
                { id: 'MY ASSETS', tab: 'Assets', icon: <LayoutGrid size={16} /> },
                { id: 'WALLET HUB', tab: 'Wallet', icon: <Wallet size={16} /> },
                { id: 'NOTIFICATIONS', tab: 'Notifications', icon: <Bell size={16} /> },
                { id: 'SETTINGS', tab: 'Settings', icon: <Settings size={16} /> }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.tab)}
                  className={`pb-5 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 ${
                      activeTab === tab.tab ? 'text-slate-950 border-b-2 border-slate-950' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  {tab.id}
                </button>
            ))}
          </div>

          <button 
            onClick={() => fetchData(true)}
            className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
          >
            <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
            SYNC NODE
          </button>
        </div>

        {/* Content Area (Fixed Overlapping) */}
        <div className="min-h-[600px] px-6">
          {activeTab === 'Wallet' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-2">
               
               {/* Available Liquidity Card (Responsive Typography) */}
               <div className="lg:col-span-4 bg-[#F2F4F7] rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden group min-h-[450px]">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                    <Wallet size={260} className="text-slate-900" strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10 text-center w-full">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-12">Available Liquidity</span>
                    <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter mb-16 italic leading-none break-all">
                      ${walletBalance.toLocaleString()}
                    </div>
                    
                    <div className="flex gap-4 w-full px-2">
                       <button onClick={() => setWalletModal({show: true, type: 'topup', step: 'amount'})} className="flex-1 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                          <Plus size={14} strokeWidth={4} /> Top-Up
                       </button>
                       <button onClick={() => setWalletModal({show: true, type: 'withdraw', step: 'amount'})} className="flex-1 py-4 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                          <ArrowUpRight size={14} strokeWidth={3} /> Withdraw
                       </button>
                    </div>
                  </div>
               </div>

               {/* Institutional Ledger Card (Refined List Spacing) */}
               <div className="lg:col-span-8 bg-[#F2F4F7] rounded-[3rem] p-1 overflow-hidden shadow-sm flex flex-col min-h-[450px]">
                  <div className="bg-[#F2F4F7] px-10 py-8 flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-blue-400">
                        <History size={20} />
                     </div>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Institutional Ledger</h3>
                  </div>
                  
                  <div className="flex-1 bg-white mx-1 mb-1 rounded-[2.5rem] overflow-y-auto p-5 custom-scrollbar">
                     {transactions.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">No Signals Recorded</span>
                       </div>
                     ) : (
                       <div className="space-y-4">
                          {transactions.map(tx => (
                            <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all rounded-[2.25rem] border border-slate-50 group/tx">
                               <div className="flex items-center gap-6">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover/tx:scale-105 ${tx.type === 'topup' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                     {tx.type === 'topup' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                  </div>
                                  <div>
                                     <div className="text-[13px] font-black text-slate-950 uppercase tracking-tight leading-none mb-1.5">{tx.type.toUpperCase()} PROTOCOL</div>
                                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tx.created_at).toLocaleString()}</div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className={`text-2xl font-black tracking-tighter leading-none mb-1.5 ${tx.type === 'topup' ? 'text-emerald-600' : 'text-slate-950'}`}>
                                     {tx.type === 'topup' ? '+' : '-'}${tx.amount.toLocaleString()}
                                  </div>
                                  <div className={`text-[9px] font-black uppercase tracking-widest ${
                                    tx.status === 'completed' ? 'text-emerald-500' : 
                                    tx.status === 'pending' ? 'text-amber-500' : 'text-rose-500'
                                  }`}>{tx.status}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Assets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
              {orders.flatMap(o => (o.items || []).map((item: any, idx: number) => (
                <HistoryCard 
                  key={`${o.id}-${idx}`}
                  domain={item.domain}
                  category={item.category || 'Website'}
                  price={(item.pricing_breakdown?.final_item_price || item.final_price || item.price || 0).toLocaleString()}
                  date={new Date(o.created_at).toLocaleDateString()}
                  metrics={{ da: item.metrics?.da || '---' }}
                />
              )))}
              <div 
                onClick={() => window.location.hash = '#/domains'}
                className="group lg:col-span-3 py-24 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer"
              >
                <Plus size={40} className="text-slate-300 group-hover:text-blue-500 mb-6" />
                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight italic">Initialize Acquisition</h3>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2">Add high-liquidity assets to your node.</p>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {notifications.length === 0 ? (
                  <div className="py-32 text-center flex flex-col items-center justify-center opacity-30">
                      <Bell size={48} className="text-slate-100 mb-6" />
                      <h3 className="text-xl font-black text-slate-400 uppercase italic">No Signals Received</h3>
                  </div>
              ) : (
                notifications.map((n) => (
                    <NotificationItem 
                        key={n.id}
                        title={n.metadata?.type === 'payment_reminder' ? 'Settlement Required' : 'System Intel'} 
                        msg={n.content}
                        time={new Date(n.created_at).toLocaleTimeString()}
                        type={n.metadata?.type === 'payment_reminder' ? 'alert' : 'info'}
                    />
                ))
              )}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-3xl bg-white border border-slate-100 p-12 rounded-[3.5rem] animate-in fade-in slide-in-from-bottom-2 shadow-sm mx-auto">
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight italic mb-10 flex items-center gap-4">
                 <Fingerprint size={28} className="text-blue-600" /> Identity_Protocol
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SettingsInput label="Full Name" icon={<User size={18} />} value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} />
                  <SettingsInput label="Company" icon={<Building2 size={18} />} value={formData.company} onChange={(e: any) => setFormData({...formData, company: e.target.value})} />
                </div>
                <SettingsInput label="Direct Link (Phone)" icon={<Phone size={18} />} value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
                <button disabled={saving} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-3">
                     {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Lock Configuration
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* WALLET MODAL SYSTEM */}
      <AnimatePresence>
        {walletModal.show && (
            <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl bg-white rounded-[3.5rem] shadow-3xl overflow-hidden border border-white/20"
                >
                    <header className="p-10 border-b border-slate-50 bg-white flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-blue-400 font-black text-2xl italic shadow-xl">D</div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{walletModal.type === 'topup' ? 'Top-Up' : 'Withdrawal'}</h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block">Secure Node Authorization</span>
                            </div>
                        </div>
                        <button onClick={closeWalletModal} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-950 transition-all"><X size={24}/></button>
                    </header>

                    <div className="p-10 space-y-10 bg-slate-50/30 min-h-[400px]">
                        {walletModal.step === 'amount' ? (
                            <div className="space-y-12 animate-in fade-in">
                                <div className="text-center">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount (USD)</label>
                                    <div className="relative max-w-xs mx-auto mt-6">
                                        <input 
                                            type="number" 
                                            value={actionAmount} 
                                            onChange={e => setActionAmount(e.target.value)} 
                                            placeholder="0.00" 
                                            className="w-full text-7xl font-black text-slate-900 bg-transparent border-b-4 border-slate-200 focus:border-blue-600 outline-none text-center py-6 tabular-nums" 
                                        />
                                        <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 text-4xl font-black text-slate-200">$</div>
                                    </div>
                                </div>

                                {walletModal.type === 'withdraw' && (
                                    <div className="space-y-4 animate-in fade-in">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block text-center">Withdrawal Details (UPI / Bank / PayPal)</label>
                                        <textarea 
                                            value={withdrawalDetails}
                                            onChange={e => setWithdrawalDetails(e.target.value)}
                                            placeholder="Enter your payment details here..."
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={closeWalletModal} className="py-6 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all hover:bg-slate-200">Abort</button>
                                    <button 
                                        disabled={!actionAmount || parseFloat(actionAmount) <= 0}
                                        onClick={() => walletModal.type === 'topup' ? setWalletModal({...walletModal, step: 'gateway'}) : handleWithdrawRequest()}
                                        className="py-6 bg-slate-950 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {walletModal.type === 'topup' ? 'Proceed to Pay' : 'Request Withdraw'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Select Gateway</h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div 
                                        onClick={() => setSelectedGateway('PayPal')}
                                        className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-4 ${selectedGateway === 'PayPal' ? 'bg-white border-blue-600 shadow-xl' : 'bg-white/5 border-slate-100 opacity-50'}`}
                                    >
                                        <Globe size={32} className={selectedGateway === 'PayPal' ? 'text-blue-600' : 'text-slate-400'} />
                                        <span className="text-[12px] font-black uppercase">PayPal</span>
                                    </div>
                                    <div 
                                        onClick={() => setSelectedGateway('Razorpay')}
                                        className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-4 ${selectedGateway === 'Razorpay' ? 'bg-white border-blue-600 shadow-xl' : 'bg-white/5 border-slate-100 opacity-50'}`}
                                    >
                                        <CardIcon size={32} className={selectedGateway === 'Razorpay' ? 'text-blue-600' : 'text-slate-400'} />
                                        <span className="text-[12px] font-black uppercase">Razorpay</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    {selectedGateway === 'PayPal' ? (
                                        <PayPalGateway amount={parseFloat(actionAmount)} onBack={() => setWalletModal({...walletModal, step: 'amount'})} onSuccess={handleTopupSuccess} />
                                    ) : (
                                        <RazorpayGateway amount={parseFloat(actionAmount)} onBack={() => setWalletModal({...walletModal, step: 'amount'})} onSuccess={handleTopupSuccess} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBlock = ({ label, value, color }: { label: string, value: string, color?: string }) => (
  <div className="flex flex-col text-center px-4">
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</span>
    <span className={`text-3xl font-black ${color || 'text-slate-950'} tracking-tighter leading-none`}>{value}</span>
  </div>
);

const HistoryCard = ({ domain, category, price, date, metrics }: any) => (
  <div className="group bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic">{domain}</h3>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{category}</p>
      </div>
      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black">DA {metrics.da}</div>
    </div>
    <div className="flex items-end justify-between pt-6 border-t border-slate-50">
       <div>
         <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Value</span>
         <span className="text-2xl font-black text-slate-900 tracking-tighter">${price}</span>
       </div>
       <div className="text-right">
         <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Auth_Date</span>
         <span className="text-[11px] font-bold text-slate-600 uppercase">{date}</span>
       </div>
    </div>
  </div>
);

const NotificationItem = ({ title, msg, time, type }: any) => (
    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex items-start gap-6 hover:shadow-md transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${type === 'alert' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
        {type === 'alert' ? <Zap size={20} /> : <CheckCircle size={20} />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{title}</h4>
          <span className="text-[8px] font-bold text-slate-300 uppercase">{time}</span>
        </div>
        <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-tight opacity-70">{msg}</p>
      </div>
    </div>
);

const SettingsInput = ({ label, icon, value, onChange }: any) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative group">
       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">{icon}</div>
       <input type="text" value={value} onChange={onChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold text-slate-950 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
    </div>
  </div>
);

export default Profile;


import React, { useEffect, useState } from 'react';
import {
  Shield, Users, Database, LayoutDashboard, Loader2,
  TrendingUp, Globe, DollarSign, Terminal, Command,
  Activity, MoreVertical, Package, FileText, BarChart2,
  ChevronRight, LogOut, Bell, MessageSquare, Ticket, Gauge,
  Wallet
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardHome from './DashboardHome';
import InventoryControl from './InventoryControl';
import UserManagement from './UserManagement';
import OrdersHub from './OrdersHub';
import ContentEngine from './ContentEngine';
import AnalyticsTerminal from './AnalyticsTerminal';
import SystemProtocols from './SystemProtocols';
import ChatHub from './ChatHub';
import AdminCoupons from './AdminCoupons';
import AdminPricing from './AdminPricing';
import WalletHub from './WalletHub';

export type AdminView = 'Dashboard' | 'Marketplace' | 'Users' | 'Orders' | 'Content' | 'Analytics' | 'Protocols' | 'Chat' | 'Coupons' | 'Pricing' | 'Wallet';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminView>('Dashboard');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ domains: [], users: [], orders: [], txCount: 0 });
  const [notificationCount, setNotificationCount] = useState(0);

  const isSuperAdmin = profile?.role === 'superadmin';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.hash = '#/login';
        return;
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!prof || (prof.role !== 'admin' && prof.role !== 'superadmin')) {
        window.location.hash = '#/';
        return;
      }

      setProfile(prof);
      fetchGlobalData();
    };
    checkAuth();
  }, []);

  const fetchGlobalData = async () => {
    try {
      const [doms, usrs, ords, txs] = await Promise.all([
        supabase.from('domains').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').eq('status', 'pending'),
        supabase.from('wallet_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);
      setData({
        domains: doms.data || [],
        users: usrs.data || [],
        orders: ords.data || [],
        txCount: txs.count || 0
      });
      setNotificationCount((ords.data?.length || 0) + (txs.count || 0));
    } catch (err) {
      console.error("Critical System Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Mounting_Institutional_Terminal...</span>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'Marketplace': return <InventoryControl domains={data.domains} onRefresh={fetchGlobalData} />;
      case 'Users': return isSuperAdmin ? <UserManagement users={data.users} currentUser={profile} onRefresh={fetchGlobalData} /> : <AccessDenied />;
      case 'Orders': return <OrdersHub adminProfile={profile} />;
      case 'Wallet': return <WalletHub adminProfile={profile} onRefresh={fetchGlobalData} />;
      case 'Coupons': return <AdminCoupons />;
      case 'Pricing': return <AdminPricing />;
      case 'Content': return <ContentEngine />;
      case 'Analytics': return isSuperAdmin ? <AnalyticsTerminal /> : <AccessDenied />;
      case 'Protocols': return isSuperAdmin ? <SystemProtocols /> : <AccessDenied />;
      case 'Chat': return <ChatHub adminProfile={profile} />;
      default: return <DashboardHome stats={{ domains: data.domains.length, users: data.users.length }} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex overflow-hidden font-['Inter']">
      <aside className="w-72 bg-[#020617] flex flex-col border-r border-white/5 relative z-50 shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl italic transform rotate-3 shadow-2xl shadow-blue-500/20">D</div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tighter uppercase leading-none">DomIntel</span>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">Command_Node</span>
            </div>
          </div>

          <nav className="space-y-1.5 overflow-y-auto custom-scrollbar flex-1 pb-10">
            <NavBtn active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />

            <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Marketplace Ops</div>
            <NavBtn active={activeTab === 'Marketplace'} onClick={() => setActiveTab('Marketplace')} icon={<Database size={18} />} label="Inventory" />
            <NavBtn
              active={activeTab === 'Orders'}
              onClick={() => setActiveTab('Orders')}
              icon={<Package size={18} />}
              label="Orders Hub"
            />
            <NavBtn
              active={activeTab === 'Wallet'}
              onClick={() => setActiveTab('Wallet')}
              icon={<Wallet size={18} />}
              label="Wallet Hub"
              badge={data.txCount > 0 ? data.txCount : undefined}
            />

            <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Monetization</div>
            <NavBtn active={activeTab === 'Pricing'} onClick={() => setActiveTab('Pricing')} icon={<Gauge size={18} />} label="Pricing Matrix" />
            <NavBtn active={activeTab === 'Coupons'} onClick={() => setActiveTab('Coupons')} icon={<Ticket size={18} />} label="Coupon Forge" />

            <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform Core</div>
            {isSuperAdmin && <NavBtn active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} icon={<Users size={18} />} label="User Registry" />}
            <NavBtn active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} icon={<MessageSquare size={18} />} label="Support Chat" />

            {isSuperAdmin && (
              <>
                <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-widest">System Protocols</div>
                <NavBtn active={activeTab === 'Protocols'} onClick={() => setActiveTab('Protocols')} icon={<Terminal size={18} />} label="Sys Config" />
              </>
            )}
          </nav>
        </div>

        <div className="mt-auto p-8 bg-white/5 border-t border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-xl">
                <Shield size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-black text-[10px] truncate uppercase tracking-tight">{profile?.full_name}</span>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest opacity-60">{profile?.role}</span>
            </div>
            <button onClick={handleLogout} className="ml-auto p-2 bg-white/5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-white/10 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar bg-[#f8fafc]">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 py-6 flex items-center justify-between sticky top-0 z-[100] shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{activeTab}</h1>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Admin_Node_Live</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <Bell size={18} />
              </button>
              {notificationCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white">{notificationCount}</div>}
            </div>
            <button onClick={() => window.location.hash = '#/'} className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
              <Command size={14} /> Hub_Portal
            </button>
          </div>
        </header>

        <div className="h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-2 duration-500 p-8 md:p-10">
          {renderView()}
        </div>
      </main>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
      }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:translate-x-1'}`}>{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-[0.15em] flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-lg shadow-lg">{badge}</span>
    )}
    {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
  </button>
);

const AccessDenied = () => (
  <div className="p-20 text-center flex flex-col items-center">
    <Terminal size={48} className="text-rose-500 mb-6" />
    <h2 className="text-3xl font-black text-rose-500 uppercase tracking-tighter">ACCESS_DENIED_BY_ROOT</h2>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Required Clearance: SUPERADMIN_ROOT</p>
  </div>
);

export default AdminPanel;

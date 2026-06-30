
import React, { useEffect, useState } from 'react';
import {
  Shield, Users, Database, LayoutDashboard, Loader2,
  TrendingUp, Globe, DollarSign, Terminal, Command,
  Activity, MoreVertical, Package, FileText, BarChart2,
  ChevronRight, LogOut, Bell, MessageSquare, Ticket, Gauge,
  Wallet, Menu, X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-['Inter'] transition-colors duration-300">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#020617] text-white shrink-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm italic">D</div>
          <span className="font-black tracking-tighter uppercase leading-none">DomIntel</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-[280px] lg:w-72 bg-[#020617]/95 backdrop-blur-xl flex flex-col border-r border-white/10 dark:border-slate-800 z-[50] shrink-0 shadow-2xl transition-transform duration-300`}>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl italic transform rotate-3 shadow-2xl shadow-blue-500/20">D</div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tighter uppercase leading-none">DomIntel</span>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">Command_Node</span>
            </div>
          </div>

          <nav className="space-y-1.5 overflow-y-auto custom-scrollbar flex-1 pb-10">
            <NavBtn active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard size={18} />} label="Dashboard" />

            <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Marketplace Ops</div>
            <NavBtn active={activeTab === 'Marketplace'} onClick={() => { setActiveTab('Marketplace'); setIsMobileMenuOpen(false); }} icon={<Database size={18} />} label="Inventory" />
            <NavBtn
              active={activeTab === 'Orders'}
              onClick={() => { setActiveTab('Orders'); setIsMobileMenuOpen(false); }}
              icon={<Package size={18} />}
              label="Orders Hub"
            />
            <NavBtn
              active={activeTab === 'Wallet'}
              onClick={() => { setActiveTab('Wallet'); setIsMobileMenuOpen(false); }}
              icon={<Wallet size={18} />}
              label="Wallet Hub"
              badge={data.txCount > 0 ? data.txCount : undefined}
            />

            <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Monetization</div>
            <NavBtn active={activeTab === 'Pricing'} onClick={() => { setActiveTab('Pricing'); setIsMobileMenuOpen(false); }} icon={<Gauge size={18} />} label="Pricing Matrix" />
            <NavBtn active={activeTab === 'Coupons'} onClick={() => { setActiveTab('Coupons'); setIsMobileMenuOpen(false); }} icon={<Ticket size={18} />} label="Coupon Forge" />

            <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform Core</div>
            {isSuperAdmin && <NavBtn active={activeTab === 'Users'} onClick={() => { setActiveTab('Users'); setIsMobileMenuOpen(false); }} icon={<Users size={18} />} label="User Registry" />}
            <NavBtn active={activeTab === 'Chat'} onClick={() => { setActiveTab('Chat'); setIsMobileMenuOpen(false); }} icon={<MessageSquare size={18} />} label="Support Chat" />
            <NavBtn active={activeTab === 'Content'} onClick={() => { setActiveTab('Content'); setIsMobileMenuOpen(false); }} icon={<FileText size={18} />} label="Content Engine" />
            {isSuperAdmin && <NavBtn active={activeTab === 'Analytics'} onClick={() => { setActiveTab('Analytics'); setIsMobileMenuOpen(false); }} icon={<BarChart2 size={18} />} label="System Analytics" />}
            {isSuperAdmin && <NavBtn active={activeTab === 'Protocols'} onClick={() => { setActiveTab('Protocols'); setIsMobileMenuOpen(false); }} icon={<Terminal size={18} />} label="Core Protocols" />}
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

      <main className="flex-1 overflow-x-hidden overflow-y-auto relative min-h-[100dvh] lg:h-screen custom-scrollbar bg-[#f8fafc] dark:bg-slate-950 min-w-0 w-full">
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-10 py-3.5 sm:py-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sticky top-0 z-[100] shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4 sm:gap-6">
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter italic transition-colors duration-300">{activeTab}</h1>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Admin_Node_Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4 ml-auto">
            <div className="relative group">
              <button className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm group-hover:-translate-y-1 group-hover:shadow-md">
                <Bell size={18} />
              </button>
              {notificationCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-bounce">{notificationCount}</div>}

              {/* Dropdown UI */}
              <div className="absolute right-0 top-full mt-4 w-72 sm:w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 p-5 sm:p-6 z-[200]">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">System Alerts</h4>
                {notificationCount === 0 ? (
                  <div className="text-center py-6">
                    <span className="text-xs font-bold text-slate-400">All Clear. No new signals.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 animate-pulse"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">New Order Received</p>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Just now</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">Wallet Topup Pending</p>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2m ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => window.location.hash = '#/'} className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-slate-900/20 dark:shadow-blue-500/20 hover:-translate-y-1">
              <Command size={14} /> <span className="hidden xs:inline">Hub_</span>Portal
            </button>
          </div>
        </header>

        <div className="min-h-[calc(100vh-80px)] h-auto animate-in fade-in slide-in-from-bottom-2 duration-500 p-3.5 sm:p-6 md:p-10">
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

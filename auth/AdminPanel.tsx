
import React, { useEffect, useState, useRef } from 'react';
import { 
  Shield, Users, Database, Plus, Search, Edit3, Trash2, 
  Settings, LayoutDashboard, Loader2, CheckCircle, XCircle,
  TrendingUp, Globe, DollarSign, Terminal, Command, Filter,
  FileUp, Tag, List, Activity, MessageSquare, AlertCircle,
  MoreVertical, ChevronRight, Save, X, Layers, Briefcase,
  FileText, ExternalLink, BarChart2, BellRing, Package, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- Sub-types for better organization ---
type AdminView = 'Dashboard' | 'Marketplace' | 'Users' | 'Orders' | 'Content' | 'Analytics' | 'Protocols';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminView>('Dashboard');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ domains: 0, users: 0, revenue: '$0' });

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
      fetchData();
    };
    checkAuth();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: doms } = await supabase.from('domains').select('*').order('created_at', { ascending: false });
      const { data: usrs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      
      setDomains(doms || []);
      setUsers(usrs || []);
      setStats({
        domains: doms?.length || 0,
        users: usrs?.length || 0,
        revenue: '$2.4M' // Mocked for now
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (profile.role !== 'superadmin') {
      alert("Unauthorized: Only Superadmins can reassign node roles.");
      return;
    }
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) fetchData();
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

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Sidebar Nav - Professional Industrial Style */}
      <aside className="w-72 bg-[#020617] flex flex-col border-r border-white/5 relative z-50">
        <div className="p-8">
           <div className="flex items-center gap-4 mb-12">
              <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-blue-500/20 italic transform rotate-3">D</div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg tracking-tighter uppercase leading-none">DomIntel</span>
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">Command_Node_v4.8</span>
              </div>
           </div>
           
           <nav className="space-y-1.5">
              <NavBtn active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Marketplace Ops</div>
              <NavBtn active={activeTab === 'Marketplace'} onClick={() => setActiveTab('Marketplace')} icon={<Database size={18} />} label="Inventory" />
              <NavBtn active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} icon={<Package size={18} />} label="Orders Hub" />
              
              <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform Core</div>
              <NavBtn active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} icon={<Users size={18} />} label="User Registry" />
              <NavBtn active={activeTab === 'Content'} onClick={() => setActiveTab('Content')} icon={<FileText size={18} />} label="Content Engine" />
              <NavBtn active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} icon={<BarChart2 size={18} />} label="Analytics" />
              
              <div className="py-4 px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">System Protocols</div>
              <NavBtn active={activeTab === 'Protocols'} onClick={() => setActiveTab('Protocols')} icon={<Terminal size={18} />} label="Sys Config" />
           </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-white/5 bg-white/5 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-11 h-11 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-white/10 overflow-hidden shadow-xl">
                  <Shield size={22} className="text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="text-white font-black text-xs truncate tracking-tight uppercase leading-none mb-1">{profile.full_name}</span>
                 <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest opacity-60">{profile.role}</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar">
         <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 py-6 flex items-center justify-between sticky top-0 z-[100] shadow-sm">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{activeTab}</h1>
              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol_v4.8_Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10">
                  <Activity size={14} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sys_Health: 100%</span>
               </div>
               <button 
                  onClick={() => window.location.hash = '#/'} 
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all flex items-center gap-2"
                >
                  <Command size={14} /> Hub_Portal
               </button>
            </div>
         </header>

         <div className="p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'Dashboard' && <AdminDashboard stats={stats} />}
            {activeTab === 'Marketplace' && <InventoryControl domains={domains} onRefresh={fetchData} />}
            {activeTab === 'Orders' && <OrdersHub />}
            {activeTab === 'Users' && <UserManager users={users} currentUser={profile} onUpdateRole={handleUpdateRole} />}
            {activeTab === 'Content' && <ContentEngine />}
            {activeTab === 'Analytics' && <AnalyticsTerminal />}
            {activeTab === 'Protocols' && <ProtocolTerminal />}
         </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

// --- Sub-Components ---

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
      active 
        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' 
        : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:translate-x-1'}`}>
      {icon}
    </div>
    <span className="text-[11px] font-black uppercase tracking-[0.15em]">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
  </button>
);

const AdminDashboard = ({ stats }: any) => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
       <StatCard label="Live Inventory" value={stats.domains} icon={<Globe className="text-blue-500" />} change="+12% weekly" />
       <StatCard label="Operator Nodes" value={stats.users} icon={<Users className="text-emerald-500" />} change="+4 nodes" />
       <StatCard label="Gross Valuation" value={stats.revenue} icon={<DollarSign className="text-amber-500" />} change="Institutional" />
       <StatCard label="Processing Load" value="12%" icon={<TrendingUp className="text-rose-500" />} change="Stable" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">System_Activity</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Node Telemetry</span>
          </div>
          <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
            <MoreVertical size={18} />
          </button>
        </div>
        <div className="h-64 flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="text-center">
            <Activity className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Active Telemetry</p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#020617] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full">
           <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
             <Shield className="text-blue-500" /> Security_Log
           </h3>
           <div className="space-y-6 flex-1">
              <SecurityLogItem msg="New Superadmin authorized" time="2h ago" />
              <SecurityLogItem msg="Global database sync completed" time="4h ago" />
              <SecurityLogItem msg="DDoS filter threshold updated" time="6h ago" />
           </div>
           <button className="w-full py-4 mt-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-600 transition-all">
             View_Full_Registry
           </button>
        </div>
        <Database size={150} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
  </div>
);

// --- POINT 1: MARKETPLACE & DOMAIN CONTROL ---
const InventoryControl = ({ domains, onRefresh }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDomains = domains.filter((d: any) => 
    d.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Control Toolbar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center gap-2.5 bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
           >
             <Plus size={16} strokeWidth={3} /> Add_Asset
           </button>
           <button className="flex items-center gap-2.5 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-slate-900 transition-all">
             <FileUp size={16} /> Bulk_CSV_Import
           </button>
           <div className="h-6 w-px bg-slate-200 mx-2 hidden xl:block"></div>
           <button className="flex items-center gap-2.5 text-slate-400 hover:text-slate-900 transition-colors text-[10px] font-black uppercase tracking-widest">
             <Layers size={16} /> Categories
           </button>
        </div>

        <div className="relative w-full xl:w-96 group">
           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
              <Search size={18} />
           </div>
           <input 
             type="text" 
             placeholder="Search Node Registry..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
           />
        </div>
      </div>

      {/* Domain Registry Table */}
      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
         <div className="p-10 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Market_Asset_Manifest</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredDomains.length} Active Nodes Synced</span>
            </div>
            <div className="flex gap-2">
              <TableActionBtn icon={<Filter size={14} />} label="Filter" />
              <TableActionBtn icon={<MoreVertical size={14} />} label="View_Config" />
            </div>
         </div>
         
         <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain_Node</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metrics (DA/DR)</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price_Architecture</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status/Tags</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredDomains.map((d: any) => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                       <td className="px-10 py-6">
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 tracking-tighter text-base group-hover:text-blue-600 transition-colors cursor-pointer">{d.domain}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{d.category}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex gap-3">
                             <MetricPill label="DA" value={d.da} color="blue" />
                             <MetricPill label="DR" value={d.dr} color="indigo" />
                             <MetricPill label="Trf" value={d.traffic} color="emerald" />
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 min-w-[120px]">
                               <span>GP:</span>
                               <span className="text-slate-900 font-black">${d.price_guest_post}</span>
                             </div>
                             <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                               <span>LI:</span>
                               <span className="text-slate-900 font-black">${d.price_insertion}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-black text-emerald-600 uppercase">Live</span>
                             </div>
                             {d.is_new && <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Featured</span>}
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-500/30 transition-all shadow-sm"><Edit3 size={16} /></button>
                             <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-600 hover:border-rose-500/30 transition-all shadow-sm"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {filteredDomains.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center">
                        <Database className="mx-auto text-slate-100 mb-6" size={64} />
                        <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest italic">Asset_Mismatch_Error</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-2">Zero nodes matching your search sequence</p>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
      
      {/* Modal Placeholder (Point 1 specific) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col h-full max-h-[90vh]">
            <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl italic font-black text-xl transform rotate-6">D</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Register_New_Node</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initialize Market Asset Deployment</span>
                  </div>
               </div>
               <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                 <X size={20} />
               </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <FormGroup label="Asset Domain Name" icon={<Globe size={16} />} placeholder="crypto-exchange.ai" />
                     <FormGroup label="Primary Category" icon={<Tag size={16} />} placeholder="Fintech / Web3" />
                     <div className="grid grid-cols-3 gap-4 pt-4">
                        <MetricInput label="Moz_DA" value="DA" />
                        <MetricInput label="Ahrefs_DR" value="DR" />
                        <MetricInput label="Traffic" value="Visits" />
                     </div>
                  </div>
                  <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Pricing Protocols</span>
                     <FormGroup label="Guest Post Price ($)" icon={<DollarSign size={16} />} placeholder="150" />
                     <FormGroup label="Link Insertion ($)" icon={<DollarSign size={16} />} placeholder="120" />
                     <FormGroup label="Brand Mention ($)" icon={<DollarSign size={16} />} placeholder="80" />
                  </div>
               </div>
            </div>

            <footer className="px-10 py-8 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3 text-slate-400">
                  <Terminal size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Pending_Verification...</span>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setShowAddModal(false)} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all">Abort_Task</button>
                  <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3">Deploy_Node <ArrowRight size={14} strokeWidth={3} /></button>
               </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

// --- PLACEHOLDER HUB SECTIONS (TO BE EXPANDED) ---

const OrdersHub = () => <PlaceholderSection title="Liquidity Hub (Orders)" icon={<Package size={48} />} desc="Active Order Monitoring & Escrow Protocols" />;
const ContentEngine = () => <PlaceholderSection title="Intelligence Feed (Content)" icon={<FileText size={48} />} desc="Manage Blog Intel & Service Tier Pricing" />;
const AnalyticsTerminal = () => <PlaceholderSection title="Visual Terminal (Analytics)" icon={<Activity size={48} />} desc="Revenue Streams & User Growth Analytics" />;
const ProtocolTerminal = () => <PlaceholderSection title="System Protocols (Settings)" icon={<Terminal size={48} />} desc="API Configs & Platform Security Protocols" />;

const UserManager = ({ users, currentUser, onUpdateRole }: any) => (
  <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm animate-in fade-in">
     <div className="p-10 border-b border-slate-100">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Identity_Registry</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Ownership & Access Hierarchy</span>
     </div>
     <div className="overflow-x-auto">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway_Email</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access_Tier</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol_Reassignment</th>
              </tr>
           </thead>
           <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                   <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                            {u.full_name?.[0] || 'N'}
                         </div>
                         <span className="font-black text-slate-900 tracking-tight uppercase text-sm">{u.full_name || 'Unnamed Node'}</span>
                      </div>
                   </td>
                   <td className="px-10 py-6 text-slate-500 font-mono text-[13px]">{u.email}</td>
                   <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        u.role === 'superadmin' ? 'bg-rose-500 text-white' : 
                        u.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                         {u.role}
                      </span>
                   </td>
                   <td className="px-10 py-6">
                      <select 
                        disabled={currentUser.role !== 'superadmin' || u.id === currentUser.id}
                        value={u.role}
                        onChange={(e) => onUpdateRole(u.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] outline-none disabled:opacity-40 shadow-inner appearance-none cursor-pointer hover:border-blue-500 transition-all"
                      >
                         <option value="user">USER_NODE</option>
                         <option value="admin">ADMIN_PROTOCOL</option>
                         <option value="superadmin">SUPERADMIN_ROOT</option>
                      </select>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
     </div>
  </div>
);

// --- Small Utility Components ---

const StatCard = ({ label, value, icon, change }: any) => (
  <div className="bg-white border border-slate-200 p-10 rounded-[3.5rem] shadow-sm flex items-center justify-between group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700">
     <div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 block">{label}</span>
        <span className="text-4xl font-black text-slate-900 tracking-tighter block mb-2">{value}</span>
        <div className="flex items-center gap-1.5">
           <TrendingUp size={10} className="text-emerald-500" />
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{change}</span>
        </div>
     </div>
     <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-xl shadow-slate-200 group-hover:shadow-blue-500/20 transform group-hover:rotate-6">
        {icon}
     </div>
  </div>
);

const MetricPill = ({ label, value, color }: any) => (
  <div className={`flex items-center gap-2 px-3 py-1 bg-${color}-50 border border-${color}-100 rounded-lg`}>
    <span className={`text-[9px] font-black text-${color}-400 uppercase`}>{label}:</span>
    <span className={`text-[11px] font-black text-${color}-600 tracking-tight`}>{value}</span>
  </div>
);

const SecurityLogItem = ({ msg, time }: any) => (
  <div className="flex items-center justify-between group/log border-b border-white/5 pb-4 last:border-0 last:pb-0">
     <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 group-hover/log:scale-150 transition-transform"></div>
        <span className="text-xs font-bold text-slate-400 group-hover/log:text-white transition-colors uppercase tracking-tight">{msg}</span>
     </div>
     <span className="text-[9px] font-black text-slate-700 uppercase">{time}</span>
  </div>
);

const TableActionBtn = ({ icon, label }: any) => (
  <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
    {icon} {label}
  </button>
);

const FormGroup = ({ label, icon, placeholder }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative group">
       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
          {icon}
       </div>
       <input 
         type="text" 
         placeholder={placeholder}
         className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
       />
    </div>
  </div>
);

const MetricInput = ({ label, value }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">{label}</label>
    <input type="text" placeholder={value} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-center text-[11px] font-black text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm" />
  </div>
);

const PlaceholderSection = ({ title, icon, desc }: any) => (
  <div className="py-40 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-[4rem] shadow-sm animate-in fade-in zoom-in-95 duration-700">
    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-xl mb-10 border border-slate-100">
      {icon}
    </div>
    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-4">{title}</h3>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] mb-12 max-w-sm mx-auto opacity-70 leading-relaxed">{desc}</p>
    <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-4 group">
      Initialize Module <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default AdminPanel;

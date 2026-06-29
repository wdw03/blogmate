
import React from 'react';
import { Globe, Users, DollarSign, TrendingUp, Activity, Database, Shield, MoreVertical } from 'lucide-react';

const DashboardHome = ({ stats }: any) => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
       <StatCard label="Live Inventory" value={stats.domains} icon={<Globe className="text-blue-500" />} change="+12% weekly" />
       <StatCard label="Operator Nodes" value={stats.users} icon={<Users className="text-emerald-500" />} change="+4 nodes" />
       <StatCard label="Gross Valuation" value="$2.4M" icon={<DollarSign className="text-amber-500" />} change="Institutional" />
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
        <div className="h-64 flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center">
            <div>
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

const StatCard = ({ label, value, icon, change }: any) => (
  <div className="bg-white border border-slate-200 p-10 rounded-[3.5rem] shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all duration-700">
     <div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 block">{label}</span>
        <span className="text-4xl font-black text-slate-900 tracking-tighter block mb-2">{value}</span>
        <div className="flex items-center gap-1.5">
           <TrendingUp size={10} className="text-emerald-500" />
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{change}</span>
        </div>
     </div>
     <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
        {icon}
     </div>
  </div>
);

const SecurityLogItem = ({ msg, time }: any) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
     <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{msg}</span>
     </div>
     <span className="text-[9px] font-black text-slate-700 uppercase">{time}</span>
  </div>
);

export default DashboardHome;

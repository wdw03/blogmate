
import React from 'react';
import { Globe, Users, DollarSign, TrendingUp, Activity, Database, Shield, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', revenue: 4000, orders: 24 },
  { name: 'Feb', revenue: 3000, orders: 13 },
  { name: 'Mar', revenue: 2000, orders: 98 },
  { name: 'Apr', revenue: 2780, orders: 39 },
  { name: 'May', revenue: 1890, orders: 48 },
  { name: 'Jun', revenue: 2390, orders: 38 },
  { name: 'Jul', revenue: 3490, orders: 43 },
];

const DashboardHome = ({ stats }: any) => (
  <div className="space-y-5 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="mb-1 sm:mb-2"><p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">Live overview</p><h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">Good to see you, operator.</h2><p className="text-sm text-slate-500 mt-1">Your marketplace pulse, all in one place.</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
       <StatCard label="Live Inventory" value={stats.domains} icon={<Globe className="text-blue-500" />} change="+12% weekly" />
       <StatCard label="Operator Nodes" value={stats.users} icon={<Users className="text-emerald-500" />} change="+4 nodes" />
       <StatCard label="Gross Valuation" value="$2.4M" icon={<DollarSign className="text-amber-500" />} change="Institutional" />
       <StatCard label="Processing Load" value="12%" icon={<TrendingUp className="text-rose-500" />} change="Stable" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-sm transition-colors min-w-0">
        <div className="flex justify-between items-center mb-6 sm:mb-10">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight italic">System_Activity</h3>
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Revenue & Order Volume (30D)</span>
          </div>
          <button className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all border border-slate-100 dark:border-slate-700">
            <MoreVertical size={18} />
          </button>
        </div>
        <div className="h-52 sm:h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-[#020617] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full">
           <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mb-6 sm:mb-8 flex items-center gap-2.5">
             <Shield className="text-blue-500" size={18} /> Security_Log
           </h3>
           <div className="space-y-4 sm:space-y-6 flex-1">
              <SecurityLogItem msg="New Superadmin authorized" time="2h ago" />
              <SecurityLogItem msg="Global database sync completed" time="4h ago" />
              <SecurityLogItem msg="DDoS filter threshold updated" time="6h ago" />
           </div>
           <button className="w-full py-3.5 sm:py-4 mt-8 sm:mt-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-600 transition-all">
             View_Full_Registry
           </button>
        </div>
        <Database size={150} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, icon, change }: any) => (
  <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[3.5rem] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all duration-500 min-w-0">
     <div className="min-w-0 pr-2">
        <span className="text-[7px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-2 sm:mb-3 block truncate">{label}</span>
        <span className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter block mb-2">{value}</span>
        <div className="flex items-center gap-1.5">
           <TrendingUp size={10} className="text-emerald-500 flex-shrink-0" />
           <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-widest truncate">{change}</span>
        </div>
     </div>
     <div className="order-first sm:order-last w-10 h-10 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-100 dark:border-slate-700 flex-shrink-0">
       {icon}
     </div>
  </div>
);
const SecurityLogItem = ({ msg, time }: any) => (
  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
     <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{msg}</span>
     </div>
     <span className="text-[9px] font-black text-slate-700 uppercase">{time}</span>
  </div>
);

export default DashboardHome;


import React, { useEffect, useState } from 'react';
import { 
    Package, Loader2, Search, Eye, X, 
    Globe, Clock, DollarSign, CheckCircle, Target, FileText, 
    Code, ImageIcon, ExternalLink, ArrowUpRight, Zap, List, AlertCircle, Activity,
    Download, ShieldCheck, Database, Key, ChevronRight, User, Settings, MessageSquare, Info,
    FileSpreadsheet, ShieldAlert, FileOutput, Send, Briefcase, Tag, Layers, RefreshCcw, Trash2,
    BellRing, Fingerprint, Shield, CreditCard
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { sendEmailViaEmailJS } from '../lib/emailService';

interface OrdersHubProps {
    adminProfile: any;
}

const OrdersHub: React.FC<OrdersHubProps> = ({ adminProfile }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPerformingTask, setIsPerformingTask] = useState<string | null>(null);

  const isSuperAdmin = adminProfile?.role === 'superadmin';

  const maskEmail = (email: string) => {
    if (!email || isSuperAdmin) return email;
    return '[ACCESS_RESTRICTED]';
  };

  const maskName = (name: string, id: string) => {
    if (!name || isSuperAdmin || name === 'GUEST USER') return name;
    return `NODE_${id.slice(-4).toUpperCase()}`;
  };

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (orderError) throw orderError;
      
      if (!orderData || orderData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const userIds = Array.from(new Set(orderData.map(o => o.user_id)));
      const { data: profileData, error: profError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('id', userIds);

      const enriched = orderData.map(o => ({
        ...o,
        profiles: profileData?.find(p => p.id === o.user_id) || { 
          id: o.user_id,
          full_name: 'GUEST USER', 
          email: 'no-email@system', 
          role: 'user' 
        }
      }));

      setOrders(enriched);
      if (selectedOrder) {
          const updated = enriched.find(o => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
      }
    } catch (err: any) {
      console.error("Orders sync error:", err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminProfile]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsPerformingTask(newStatus);
    try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) throw error;
        
        await supabase.from('messages').insert([{
            user_id: selectedOrder.user_id,
            content: `Aapka Order #${orderId.slice(0,8).toUpperCase()} status ab ${newStatus.toUpperCase()} ho gaya hai. Check karein.`,
            is_admin: true,
            metadata: { order_id: orderId, type: 'status_change', status: newStatus }
        }]);

        // Trigger Status Update Email via EmailJS
        const env = (import.meta as any).env;
        await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_STATUS_UPDATE, {
            to_email: selectedOrder.profiles?.email || 'user@system',
            new_status: newStatus.toUpperCase(),
            order_id: orderId.slice(0, 8).toUpperCase(),
            item_name: selectedOrder.items?.[0]?.domain || 'Domain Service',
            admin_note: `Your order status has been updated to ${newStatus}.`,
            order_url: `${window.location.origin}/#/profile`
        });

        setSelectedOrder((prev: any) => prev ? ({ ...prev, status: newStatus }) : null);
        await fetchOrders(true);
    } catch (e: any) {
        alert("Error: " + e.message);
    } finally {
        setIsPerformingTask(null);
    }
  };

  const handleSendReminder = async (order: any) => {
    try {
        const finalPrice = order.total_amount || order.total_price;
        const env = (import.meta as any).env;

        // Trigger Payment Reminder via EmailJS
        await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_NEW_MESSAGE, {
            to_email: order.profiles?.email || 'user@system',
            subject: 'Payment Reminder - Order #' + order.id.slice(0,8).toUpperCase(),
            message_snippet: `Hi, aapke order #${order.id.slice(0,8).toUpperCase()} ki payment pending hai ($${finalPrice.toLocaleString()}). Kripya portal par settlement karein.`,
            chat_url: `${window.location.origin}/#/profile`
        });

        const { error } = await supabase.from('messages').insert([{
            user_id: order.user_id,
            content: `Friendly Reminder: Order #${order.id.slice(0,8).toUpperCase()} ($${finalPrice.toLocaleString()}) ki payment pending hai. Detail email par bhej di gayi hai.`,
            is_admin: true,
            metadata: { type: 'payment_reminder', order_id: order.id }
        }]);
        if (error) throw error;
        alert("Payment Reminder Email Dispatched via EmailJS.");
    } catch (e: any) {
        alert("Error: " + e.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const ident = isSuperAdmin ? (o.profiles?.full_name + o.profiles?.email) : `NODE_${o.user_id.slice(-4)}`;
    return ident.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 font-['Inter'] px-0 sm:px-4 md:px-8 py-2 sm:py-6 min-w-0">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-lg w-full group">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Search Manifest (Node ID, Order ID)..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
           />
        </div>
        <div className="flex gap-2">
            <button onClick={() => fetchOrders()} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all flex-shrink-0">
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                <FileSpreadsheet size={14} /> Export Manifest
            </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-w-0">
         <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between gap-2">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-tight italic truncate">Order Management Hub</h3>
            <div className="px-2.5 sm:px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest flex-shrink-0">{isSuperAdmin ? 'ROOT_ACCESS' : 'OPERATOR_MODE'}</div>
         </div>
         
         <div className="overflow-x-auto custom-scrollbar min-w-0">
            <table className="w-full text-left min-w-[500px]">
               <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                     <th className="px-3 sm:px-6 py-3 sm:py-3.5 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer Entity</th>
                     <th className="px-3 sm:px-6 py-3 sm:py-3.5 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                     <th className="px-3 sm:px-6 py-3 sm:py-3.5 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Settlement</th>
                     <th className="px-3 sm:px-6 py-3 sm:py-3.5 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Directives</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredOrders.map((o) => {
                    const total = o.total_amount || o.total_price;
                    return (
                      <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-3.5">
                            <div className="flex flex-col">
                                <span className="font-black text-slate-950 text-[11px] uppercase truncate max-w-[150px] sm:max-w-[200px]">{maskName(o.profiles?.full_name, o.user_id)}</span>
                                <span className="text-[9px] font-mono text-blue-600 lowercase truncate max-w-[150px] sm:max-w-[200px] opacity-70">{maskEmail(o.profiles?.email)}</span>
                            </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-3.5 text-center">
                            <div className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                o.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                o.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                o.status === 'live' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {o.status || 'UNKNOWN'}
                            </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-3.5 text-center">
                            <span className="text-[11px] sm:text-[12px] font-black text-slate-900 tabular-nums">${total?.toLocaleString()}</span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-3.5 text-right">
                            <button onClick={() => setSelectedOrder(o)} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm">
                                <Eye size={14} />
                            </button>
                        </td>
                      </tr>
                    )
                  })}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
            <div className="fixed inset-0 z-[6000] flex items-center justify-center p-2 md:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.98, y: 10 }}
                 className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[94vh] border border-slate-200"
               >
                  <header className="px-6 py-4 border-b border-slate-100 bg-[#020617] text-white flex items-center justify-between shrink-0">
                     <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center italic font-black text-base shadow-lg">D</div>
                        <div>
                           <h3 className="text-sm font-black uppercase tracking-tight italic leading-none">Manifest Authorization</h3>
                           <span className="text-[8px] font-mono text-blue-400 uppercase tracking-widest mt-1 block opacity-80">ID: {selectedOrder.id.toUpperCase()}</span>
                        </div>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                        <X size={18} />
                     </button>
                  </header>

                  <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-[#F8FAFC]">
                     <aside className="w-full lg:w-[300px] bg-white border-r border-slate-200/60 p-5 space-y-6 overflow-y-auto shrink-0 custom-scrollbar">
                        <section>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3 pl-1">Customer Entity</span>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center relative overflow-hidden shadow-inner">
                                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4 text-2xl font-black italic border-[3px] border-white shadow-md">
                                    {isSuperAdmin ? (selectedOrder.profiles?.full_name?.[0] || 'U') : 'N'}
                                </div>
                                <h4 className="text-sm font-black text-slate-950 uppercase tracking-tighter truncate">{maskName(selectedOrder.profiles?.full_name, selectedOrder.user_id)}</h4>
                                <p className="text-[10px] font-mono font-bold text-blue-600 truncate mb-4 lowercase opacity-80">{maskEmail(selectedOrder.profiles?.email)}</p>
                                
                                <div className="h-px bg-slate-200 w-full mb-4"></div>
                                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-tight">
                                   <span>Gateway:</span>
                                   <span className="text-slate-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{selectedOrder.payment_method || 'GATEWAY'}</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1 pl-1">Directives</span>
                            <div className="grid grid-cols-2 gap-2">
                                <StatusBtn 
                                    active={selectedOrder.status === 'processing'} 
                                    label="Process" 
                                    color="blue" 
                                    isLoading={isPerformingTask === 'processing'}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')} 
                                />
                                <StatusBtn 
                                    active={selectedOrder.status === 'live'} 
                                    label="Go_Live" 
                                    color="emerald" 
                                    isLoading={isPerformingTask === 'live'}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'live')} 
                                />
                                <StatusBtn 
                                    active={selectedOrder.status === 'pending'} 
                                    label="Standby" 
                                    color="amber" 
                                    isLoading={isPerformingTask === 'pending'}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')} 
                                />
                                <StatusBtn 
                                    active={selectedOrder.status === 'canceled'} 
                                    label="Abort" 
                                    color="rose" 
                                    isLoading={isPerformingTask === 'canceled'}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'canceled')} 
                                />
                            </div>
                            <button 
                                onClick={() => handleSendReminder(selectedOrder)}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                            >
                                <BellRing size={14} /> Send Payment Email
                            </button>
                        </section>

                        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest block mb-1">Gross Settlement</span>
                                <div className="text-2xl font-black text-white tracking-tighter leading-none italic tabular-nums">${(selectedOrder.total_amount || selectedOrder.total_price)?.toLocaleString()}</div>
                            </div>
                            <DollarSign className="absolute -bottom-4 -right-4 text-white/5 w-20 h-20" />
                        </div>
                     </aside>

                     <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div className="flex items-center gap-2">
                                <Layers size={14} className="text-slate-400" />
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Registry Breakdown</h4>
                            </div>
                            <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Sync_TS: {new Date(selectedOrder.created_at).toLocaleString()}</span>
                        </div>

                        <div className="space-y-4">
                            {selectedOrder.items?.map((item: any, idx: number) => {
                                const reqs = item.configuration?.contentRequirements || {};
                                return (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group hover:border-blue-600/30 transition-all relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-50 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-blue-500 font-black text-lg italic shadow-md">{idx + 1}</div>
                                                <div>
                                                    <h5 className="text-lg font-black text-slate-950 uppercase italic tracking-tighter leading-none">{item.domain}</h5>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[7px] font-black uppercase tracking-widest">{item.niche?.toUpperCase() || 'GENERAL'}</span>
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[7px] font-black uppercase tracking-widest border border-slate-200">{item.service_type || 'GUEST POST'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Asset Value</span>
                                                <div className="text-xl font-black text-slate-900 tracking-tighter leading-none italic tabular-nums">${(item.pricing_breakdown?.final_item_price || item.price || 0).toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <DetailGroup label="Routing Manifest">
                                                <DetailRow label="Anchor Text" val={reqs.links?.[0]?.anchorText || reqs.anchorText || 'PENDING_INPUT'} />
                                                <DetailRow label="Target Dest" val={reqs.links?.[0]?.landingPageUrl || reqs.landingPageUrl || 'PENDING_SYNC'} isLink />
                                            </DetailGroup>
                                            <DetailGroup label="Valuation Hub">
                                                <DetailRow label="Base Value" val={`$${item.pricing_breakdown?.base_usd || item.base_price || '---'}`} />
                                                <DetailRow label="Author Fee" val={`$${item.pricing_breakdown?.writer_fee || '0'}`} color="text-orange-500" />
                                            </DetailGroup>
                                            <DetailGroup label="Metric Forensic">
                                                <DetailRow label="Authority (DA)" val={item.metrics?.da || '---'} />
                                                <DetailRow label="Rating (DR)" val={item.metrics?.dr || '---'} />
                                            </DetailGroup>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={12} className="text-blue-600" />
                                                    <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">Payload Package</span>
                                                </div>
                                                {reqs.fileUrl ? (
                                                    <a href={`https://icvwmecfewsogrbkijjh.supabase.co/storage/v1/object/public/articles/${reqs.fileUrl}`} target="_blank" className="flex items-center justify-between p-4 bg-slate-950 rounded-xl group/file hover:bg-blue-600 transition-all shadow-md">
                                                        <div className="flex items-center gap-3">
                                                            <FileOutput size={16} className="text-blue-400 group-hover/file:text-white" />
                                                            <span className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">Node_Draft.docx</span>
                                                        </div>
                                                        <Download size={14} className="text-slate-500 group-hover/file:text-white" />
                                                    </a>
                                                ) : (
                                                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">NO_NODE_PAYLOAD</div>
                                                )}

                                                {reqs.imagePath && (
                                                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm group/img relative overflow-hidden">
                                                        <div className="flex items-center gap-2">
                                                            <ImageIcon size={14} className="text-orange-500" />
                                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Multimedia Manifest</span>
                                                        </div>
                                                        <a href={`https://icvwmecfewsogrbkijjh.supabase.co/storage/v1/object/public/articles/${reqs.imagePath}`} target="_blank" className="block relative h-32 overflow-hidden rounded-lg border border-slate-100">
                                                            <img 
                                                                src={`https://icvwmecfewsogrbkijjh.supabase.co/storage/v1/object/public/articles/${reqs.imagePath}`} 
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=IMG_NOT_FOUND';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <ExternalLink size={16} className="text-white" />
                                                            </div>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Code size={12} className="text-emerald-600" />
                                                    <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">Script Insertion</span>
                                                </div>
                                                <div className="bg-[#020617] rounded-xl p-4 border border-white/5 h-[160px] overflow-y-auto custom-scrollbar shadow-inner">
                                                    <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                                                        {reqs.htmlCode || "// SYSTEM_NULL: NO_EXECUTABLE_INJECTION"}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                     </main>
                  </div>
               </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBtn = ({ active, label, color, onClick, isLoading }: any) => {
    const colorMap: Record<string, string> = {
        blue: active ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500',
        emerald: active ? 'bg-emerald-600 border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-500',
        amber: active ? 'bg-amber-600 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-500',
        rose: active ? 'bg-rose-600 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'border-slate-100 text-slate-400 hover:border-rose-200 hover:text-rose-500'
    };

    return (
        <button 
            onClick={(e) => { e.preventDefault(); onClick(); }} 
            disabled={isLoading}
            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${colorMap[color]} ${active ? 'text-white' : 'bg-transparent'} ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
        >
            {isLoading && <Loader2 size={10} className="animate-spin" />}
            {label}
        </button>
    );
};

const DetailGroup = ({ label, children }: any) => (
   <div className="space-y-3">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-1.5">{label}</span>
      <div className="space-y-2">{children}</div>
   </div>
);

const DetailRow = ({ label, val, isLink, color }: any) => (
   <div className="flex flex-col">
      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{label}:</span>
      <span className={`text-slate-950 font-black truncate text-[10px] uppercase leading-tight ${color || ''} ${isLink ? 'text-blue-600 underline lowercase italic' : ''}`}>
        {val}
      </span>
   </div>
);

export default OrdersHub;

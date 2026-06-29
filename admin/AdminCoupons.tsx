
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Plus, Trash2, Loader2, CheckCircle2,
    X, Zap, Percent, Calendar, ShieldCheck,
    Database, RefreshCw, AlertCircle, Terminal, Info, MoreVertical,
    Users, BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Coupon } from '../types';

const AdminCoupons: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [dbError, setDbError] = useState<string | null>(null);
    const [newCoupon, setNewCoupon] = useState({ code: '', percent: '', expiry: '', limit: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        setDbError(null);
        try {
            const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setCoupons(data || []);
        } catch (err: any) {
            setDbError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = newCoupon.code.toUpperCase().trim();
        const percent = parseInt(newCoupon.percent);
        const limit = newCoupon.limit ? parseInt(newCoupon.limit) : null;

        if (!code || isNaN(percent)) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from('coupons').insert({
                code,
                discount_percent: percent,
                expires_at: newCoupon.expiry || null,
                usage_limit: limit,
                times_used: 0,
                is_active: true
            });
            if (error) throw error;
            setIsAdding(false);
            setNewCoupon({ code: '', percent: '', expiry: '', limit: '' });
            fetchCoupons();
        } catch (err: any) {
            alert(`Creation Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Confirm Nuclear Purge of Voucher?")) return;
        try {
            const { error } = await supabase.from('coupons').delete().eq('id', id);
            if (error) throw error;
            setCoupons(prev => prev.filter(c => c.id !== id));
        } catch (err: any) {
            alert("Delete failed: " + err.message);
        }
    };

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            const { error } = await supabase.from('coupons').update({ is_active: !current }).eq('id', id);
            if (error) throw error;
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Control Strip */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"><Ticket size={20} /></div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Coupon_Forge</h3>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">{coupons.length} Active Vouchers Synchronized</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchCoupons} className="p-4 bg-slate-50 text-slate-300 hover:text-blue-600 rounded-2xl shadow-inner transition-all border border-slate-100"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
                    <button onClick={() => setIsAdding(true)} className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95">
                        <Plus size={18} strokeWidth={3} /> Generate_New_Voucher
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && coupons.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 block">Accessing Registry...</span>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                        <Database size={48} className="mx-auto mb-6 text-slate-200" />
                        <h4 className="text-xl font-black text-slate-400 uppercase italic">Zero Signal Records</h4>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-2">Initialize forge to create first voucher node</p>
                    </div>
                ) : coupons.map(c => {
                    const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
                    const isFullyUsed = c.usage_limit && c.times_used && c.times_used >= c.usage_limit;
                    const statusColor = (isExpired || isFullyUsed) ? 'text-rose-500' : c.is_active ? 'text-emerald-500' : 'text-slate-400';
                    const usagePercent = c.usage_limit ? Math.min(100, ((c.times_used || 0) / c.usage_limit) * 100) : 0;

                    return (
                        <motion.div key={c.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white p-8 rounded-[3rem] border transition-all relative overflow-hidden group ${!c.is_active || isExpired || isFullyUsed ? 'border-slate-100 opacity-60' : 'border-slate-200 shadow-sm hover:border-blue-600/20'}`}>
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 pointer-events-none text-slate-950"><Percent size={120} /></div>

                            <div className="flex justify-between items-start relative z-10 mb-8">
                                <div>
                                    <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2 ${statusColor}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full bg-current ${c.is_active && !isExpired && !isFullyUsed ? 'animate-pulse' : ''}`}></div>
                                        {isExpired ? 'EXPIRED' : isFullyUsed ? 'LIMIT_REACHED' : c.is_active ? 'ONLINE' : 'IDLE'}
                                    </div>
                                    <div className="text-2xl font-black text-slate-950 tracking-tighter uppercase font-mono italic">{c.code}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleStatus(c.id, c.is_active)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm"><Zap size={16} /></button>
                                    <button onClick={() => handleDelete(c.id)} className="p-3 bg-white border border-slate-100 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {c.usage_limit ? (
                                    <div>
                                        <div className="flex justify-between items-end mb-2.5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage Quota</span>
                                            <span className="text-[11px] font-mono font-black text-slate-900">{c.times_used || 0} / {c.usage_limit}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                            <div className={`h-full transition-all duration-1000 ${isFullyUsed ? 'bg-rose-500' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'}`} style={{ width: `${usagePercent}%` }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 py-2">
                                        <Users size={14} className="text-slate-300" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unlimited Usage Authorized</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                    <div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Node Discount</div>
                                        <div className="text-4xl font-black text-slate-950 tracking-tighter font-mono leading-none">-{c.discount_percent}%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Expiry_SIG</div>
                                        <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'LIFETIME'}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Modal for Adding */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-3xl overflow-hidden border border-white/20" >
                            <div className="p-10 border-b border-slate-100 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                                        <Ticket size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Voucher_Forge</h3>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 block">Registry Initialization Protocol</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsAdding(false)} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-950 transition-all"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleCreate} className="p-10 space-y-8 bg-[#F8FAFC]/50">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Voucher Identification Code</label>
                                    <div className="relative group">
                                        <input required type="text" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="E.G. DOMINTEL_LAUNCH" className="w-full p-6 bg-white border-2 border-slate-100 rounded-[1.75rem] text-sm font-black uppercase outline-none focus:border-blue-600 shadow-inner" />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500">
                                            <Terminal size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Discount Unit (%)</label>
                                        <div className="relative">
                                            <input required type="number" value={newCoupon.percent} onChange={e => setNewCoupon({ ...newCoupon, percent: e.target.value })} placeholder="20" className="w-full p-6 bg-white border-2 border-slate-100 rounded-[1.75rem] text-sm font-black outline-none focus:border-blue-600 shadow-inner" />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Usage Quota (Optional)</label>
                                        <div className="relative">
                                            <input type="number" value={newCoupon.limit} onChange={e => setNewCoupon({ ...newCoupon, limit: e.target.value })} placeholder="Unlimited" className="w-full p-6 bg-white border-2 border-slate-100 rounded-[1.75rem] text-sm font-black outline-none focus:border-blue-600 shadow-inner" />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                                                <Users size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Signal (Optional)</label>
                                    <div className="relative group">
                                        <input type="date" value={newCoupon.expiry} onChange={e => setNewCoupon({ ...newCoupon, expiry: e.target.value })} className="w-full p-6 bg-white border-2 border-slate-100 rounded-[1.75rem] text-[12px] font-black uppercase outline-none focus:border-blue-600 cursor-pointer" />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                            <Calendar size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start gap-4">
                                    <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                    <p className="text-[10px] font-bold text-blue-700 uppercase leading-relaxed tracking-tight">System Notice: Coupons with a usage limit will automatically move to 'LIMIT_REACHED' status once the threshold is synced in the fulfillment pipeline.</p>
                                </div>

                                <button disabled={submitting} type="submit" className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-50 transition-all hover:bg-blue-600 hover:shadow-blue-500/20">
                                    {submitting ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" className="text-blue-400" />}
                                    Authorized Deployment
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}} />
        </div>
    );
};

export default AdminCoupons;

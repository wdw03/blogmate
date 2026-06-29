
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, Zap, Loader2, Plus, Trash2,
    Percent, CheckCircle2, RefreshCw, Database, 
    Save, Gauge, ShieldCheck, ArrowRight, Layers,
    AlertTriangle, XCircle, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PricingRule {
    id?: string;
    min_price: number;
    max_price: number;
    discount_percent: number;
    label: string;
}

const AdminPricing: React.FC = () => {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        fetchRules();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('pricing_rules').select('*').order('min_price', { ascending: true });
            if (error) throw error;
            setRules(data || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleAddRule = () => {
        setRules([...rules, { min_price: 0, max_price: 0, discount_percent: 0, label: 'New Tier' }]);
    };

    const handleRemoveRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    const updateRule = (index: number, field: keyof PricingRule, value: any) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        setRules(newRules);
    };

    const saveRules = async () => {
        setIsSaving(true);
        try {
            // Delete all and re-insert for simple synchronization
            const { error: delErr } = await supabase.from('pricing_rules').delete().neq('min_price', -1);
            if (delErr) throw delErr;

            if (rules.length > 0) {
                const { error: insErr } = await supabase.from('pricing_rules').insert(rules.map(r => ({
                    min_price: Number(r.min_price),
                    max_price: Number(r.max_price),
                    discount_percent: Number(r.discount_percent),
                    label: r.label
                })));
                if (insErr) throw insErr;
            }
            alert("Pricing Matrix Synchronized Successfully.");
            fetchRules();
        } catch (err: any) { alert("Deployment Error: " + err.message); } finally { setIsSaving(false); }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-24 md:pb-20">
            {/* Header Terminal */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 text-white rounded-2xl md:rounded-[1.75rem] shadow-xl flex items-center justify-center shadow-blue-500/20 transform -rotate-2"><Gauge size={28}/></div>
                        <div>
                            <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Pricing_Terminal</h3>
                            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Global Authorization Node: USD ($)</p>
                        </div>
                    </div>
                    {!isMobile && (
                        <button onClick={fetchRules} className="p-4 bg-slate-50 text-slate-300 hover:text-blue-600 rounded-2xl border border-slate-100 transition-all shadow-inner">
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleAddRule} className="flex-1 flex items-center justify-center gap-3 py-4.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm"><Plus size={18}/> Add_New_Range</button>
                    <button onClick={saveRules} disabled={isSaving} className="flex-1 flex items-center justify-center gap-4 py-4.5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 shadow-2xl transition-all active:scale-95 disabled:opacity-50">
                        {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Deploy_Matrix_Sync
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    {loading ? (
                        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100">
                            <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-6 block">Accessing Core Pricing...</span>
                        </div>
                    ) : rules.length === 0 ? (
                        <div className="py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
                            <AlertTriangle size={64} className="mx-auto mb-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
                            <h4 className="text-2xl font-black text-slate-400 uppercase italic">No Logic Brackets Defined</h4>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-2">Initialize range to deploy first pricing node</p>
                        </div>
                    ) : (
                        rules.map((rule, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                key={idx} 
                                className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden hover:border-blue-500/20 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><DollarSign size={140} /></div>
                                
                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block ml-1">Tier Specification Label</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                            <input 
                                                type="text" 
                                                value={rule.label} 
                                                onChange={e => updateRule(idx, 'label', e.target.value)} 
                                                className="bg-transparent text-2xl font-black text-slate-950 uppercase tracking-tighter focus:outline-none w-full italic" 
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveRule(idx)} className="p-3 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm"><Trash2 size={18}/></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner group-focus-within:bg-white transition-all">
                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Threshold_Min</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-300 font-black text-xl">$</span>
                                            <input 
                                                type="number" 
                                                value={rule.min_price} 
                                                onChange={e => updateRule(idx, 'min_price', e.target.value)} 
                                                className="bg-transparent font-black text-slate-950 text-2xl w-full focus:outline-none tabular-nums" 
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner group-focus-within:bg-white transition-all">
                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Threshold_Max</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-300 font-black text-xl">$</span>
                                            <input 
                                                type="number" 
                                                value={rule.max_price} 
                                                onChange={e => updateRule(idx, 'max_price', e.target.value)} 
                                                className="bg-transparent font-black text-slate-950 text-2xl w-full focus:outline-none tabular-nums" 
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 shadow-sm transition-all group-hover:bg-blue-600 group-hover:border-blue-600 group">
                                        <label className="text-[9px] font-black text-blue-500 group-hover:text-blue-200 uppercase mb-3 block tracking-widest transition-colors">Adjustment_Node</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                value={rule.discount_percent} 
                                                onChange={e => updateRule(idx, 'discount_percent', e.target.value)} 
                                                className="bg-transparent font-black text-blue-600 group-hover:text-white text-3xl w-full focus:outline-none transition-colors" 
                                            />
                                            <span className="text-blue-400 group-hover:text-blue-200 font-black text-xl transition-colors">% OFF</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 bg-slate-950 p-10 rounded-[3.5rem] text-white overflow-hidden shadow-3xl border border-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px:24px] opacity-10"></div>
                        <h4 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-4 relative z-10">
                            <ShieldCheck className="text-blue-500" size={24} /> 
                            Operational_SIG
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10 uppercase tracking-tight opacity-80 mb-8">
                            Define automated value adjustments based on domain acquisition worth. Nodes within specified ranges will undergo instant real-time pricing synchronization across all marketplace clusters.
                        </p>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Matrix Active</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Zap className="text-amber-500" size={14} />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">0.4ms Sync Latency</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}} />
        </div>
    );
};

export default AdminPricing;

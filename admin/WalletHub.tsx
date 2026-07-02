
import React, { useState, useEffect } from 'react';
import { 
    Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, 
    Loader2, Search, RefreshCw, User, ShieldAlert, Zap, 
    ShieldCheck, Activity, Terminal, ExternalLink, Filter, 
    MoreVertical, Info, CreditCard, Clock, Database, Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WalletHubProps {
    adminProfile: any;
    onRefresh: () => void;
}

const WalletHub: React.FC<WalletHubProps> = ({ adminProfile, onRefresh }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const isSuperAdmin = adminProfile?.role === 'superadmin';

    const fetchLedger = async () => {
        setLoading(true);
        try {
            // Fetch transactions first
            const { data: txData, error: txError } = await supabase
                .from('wallet_transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (txError) throw txError;

            if (!txData || txData.length === 0) {
                setTransactions([]);
                setLoading(false);
                return;
            }

            // Fetch profiles for these transactions
            const userIds = Array.from(new Set(txData.map(t => t.user_id)));
            const { data: profileData, error: profError } = await supabase
                .from('profiles')
                .select('id, full_name, email, wallet_balance, wallet_status')
                .in('id', userIds);

            if (profError) throw profError;

            // Enrich transactions with profile data
            const enriched = txData.map(t => ({
                ...t,
                profiles: profileData?.find(p => p.id === t.user_id) || {
                    id: t.user_id,
                    full_name: 'UNKNOWN_NODE',
                    email: 'no-email@system',
                    wallet_balance: 0,
                    wallet_status: 'active'
                }
            }));

            let filteredData = enriched;
            if (filter === 'pending') {
                filteredData = enriched.filter(t => t.status === 'pending');
            }

            setTransactions(filteredData);
        } catch (e: any) {
            console.error("Ledger Sync Error:", e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, [filter]);

    const handleAuthorize = async (tx: any, approve: boolean) => {
        setProcessingId(tx.id);
        try {
            const newStatus = approve ? 'completed' : 'rejected';
            
            // 1. Update Transaction Status
            const { error: txErr } = await supabase.from('wallet_transactions').update({ status: newStatus }).eq('id', tx.id);
            if (txErr) throw txErr;

            // 2. If approved, update User Balance (Hard Logic)
            if (approve) {
                const currentBalance = parseFloat(tx.profiles.wallet_balance || '0');
                const txAmount = parseFloat(tx.amount);
                const newBalance = tx.type === 'topup' || tx.type === 'refund' 
                    ? currentBalance + txAmount 
                    : currentBalance - txAmount;

                const { error: balErr } = await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', tx.user_id);
                if (balErr) throw balErr;

                // Send System Message
                await supabase.from('messages').insert({
                    user_id: tx.user_id,
                    is_admin: true,
                    content: `WALLET_AUTH: Your ${tx.type.toUpperCase()} request for $${txAmount.toLocaleString()} has been authorized. New Balance: $${newBalance.toLocaleString()}`,
                    metadata: { type: 'wallet_sync', tx_id: tx.id }
                });
            } else {
                 await supabase.from('messages').insert({
                    user_id: tx.user_id,
                    is_admin: true,
                    content: `WALLET_REJECTION: Your ${tx.type.toUpperCase()} request has been declined. Please contact support.`,
                    metadata: { type: 'wallet_error', tx_id: tx.id }
                });
            }

            fetchLedger();
            onRefresh();
        } catch (e: any) {
            alert("Authorization Error: " + e.message);
        } finally {
            setProcessingId(null);
        }
    };

    const toggleFreeze = async (userId: string, currentStatus: string) => {
        if (!isSuperAdmin) return alert("UNAUTHORIZED: Root access required for node lockdown.");
        const nextStatus = currentStatus === 'frozen' ? 'active' : 'frozen';
        try {
            const { error } = await supabase.from('profiles').update({ wallet_status: nextStatus }).eq('id', userId);
            if (error) throw error;
            fetchLedger();
            alert(`Node ${nextStatus.toUpperCase()} successfully.`);
        } catch (e: any) {
            alert(e.message);
        }
    };

    const filtered = transactions.filter(t => 
        (t.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (t.profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl">
                    <button onClick={() => setFilter('pending')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'pending' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Pending_Approvals</button>
                    <button onClick={() => setFilter('all')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Full_Ledger</button>
                </div>
                <div className="relative w-full xl:w-96 group">
                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                      <Search size={18} />
                   </div>
                   <input 
                     type="text" 
                     placeholder="Search Operator/Node..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                   />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 lg:p-10 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Liquidity_Registry</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Balance Synchronization Active</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[700px] text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Node</th>
                                <th className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol_Type</th>
                                <th className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Directive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center opacity-20"><Database className="mx-auto mb-4" size={48} /><span className="text-xs font-black uppercase tracking-widest">Zero Signals Found</span></td>
                                </tr>
                            ) : filtered.map(tx => (
                                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                    <td className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${tx.profiles?.wallet_status === 'frozen' ? 'bg-rose-500' : 'bg-slate-900'}`}>{tx.profiles?.full_name?.[0] || 'U'}</div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{tx.profiles?.full_name}</div>
                                                <div className="text-[10px] font-bold text-blue-600/70 lowercase opacity-80">{tx.profiles?.email}</div>
                                                {tx.metadata?.details && (
                                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                                        <div className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Withdrawal_Details:</div>
                                                        <div className="text-[10px] font-bold text-slate-600 leading-tight">{tx.metadata.details}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-center">
                                        <div className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                                            tx.type === 'topup' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            tx.type === 'withdrawal' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500'
                                        }`}>{tx.type}</div>
                                    </td>
                                    <td className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-center">
                                        <span className="text-base font-black text-slate-950 tabular-nums">${tx.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-center">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                                            tx.status === 'completed' ? 'text-emerald-500' : 
                                            tx.status === 'pending' ? 'text-amber-500 animate-pulse' : 'text-rose-500'
                                        }`}>{tx.status}</span>
                                    </td>
                                    <td className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {tx.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAuthorize(tx, true)} className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"><CheckCircle size={18}/></button>
                                                    <button onClick={() => handleAuthorize(tx, false)} className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"><XCircle size={18}/></button>
                                                </>
                                            )}
                                            {isSuperAdmin && (
                                                <button 
                                                    onClick={() => toggleFreeze(tx.user_id, tx.profiles.wallet_status)}
                                                    className={`p-2.5 rounded-xl border transition-all ${tx.profiles.wallet_status === 'frozen' ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'}`}
                                                    title={tx.profiles.wallet_status === 'frozen' ? 'Unfreeze' : 'Freeze Node'}
                                                >
                                                    <Lock size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WalletHub;

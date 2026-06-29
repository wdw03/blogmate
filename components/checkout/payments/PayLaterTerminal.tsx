
import React from 'react';
import { Clock, ShieldCheck, Zap, Loader2 } from 'lucide-react';

interface PayLaterTerminalProps {
    amount: number;
    processing: boolean;
    onAuthorize: () => void;
}

const PayLaterTerminal: React.FC<PayLaterTerminalProps> = ({ amount, processing, onAuthorize }) => {
    return (
        <div className="w-full flex flex-col items-center space-y-8 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-700">
                <Clock size={40} className="text-blue-400" />
            </div>

            <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">B2B Net-30 Protocol</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={12} fill="currentColor" /> Approved Credit Line
                </div>
            </div>

            <div className="w-full p-8 bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] shadow-sm space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Deployment Value</span>
                        <span className="text-slate-900 font-mono text-base">${amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Settlement Window</span>
                        <span className="text-slate-900 font-mono text-base">30 DAYS</span>
                    </div>
                </div>

                <div className="h-px bg-slate-200"></div>
                <button 
                    onClick={onAuthorize}
                    disabled={processing}
                    className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50"
                >
                    {processing ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} fill="currentColor" className="text-blue-400" />}
                    {processing ? 'AUTHORIZING...' : 'EXECUTE PROTOCOL'}
                </button>
            </div>
        </div>
    );
};

export default PayLaterTerminal;


import React from 'react';
import { Bitcoin, Send, ShieldAlert, MessageSquare, ExternalLink } from 'lucide-react';

interface CryptoTerminalProps {
    amount: number;
}

const CryptoTerminal: React.FC<CryptoTerminalProps> = ({ amount }) => {
    const openChat = () => {
        window.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <div className="w-full flex flex-col items-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center shadow-xl border border-orange-100 ring-8 ring-orange-500/5">
                <Bitcoin size={48} className="text-orange-500 animate-pulse" />
            </div>

            <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">USDT Asset Lock</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">TRC-20 Network Preferred</p>
            </div>

            <div className="w-full bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Send size={80} className="text-white" /></div>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Transfer</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono">${amount} USDT</span>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldAlert size={16} className="text-orange-400" />
                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Security Protocol</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                            To ensure 0% slippage and instant node synchronization, crypto payments are processed via manual verification.
                        </p>
                    </div>

                    <button 
                        onClick={openChat}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl"
                    >
                        <MessageSquare size={18} fill="currentColor" /> GET TARGET ADDRESS
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <ExternalLink size={12} /> Transaction will be verified within 15 minutes
            </div>
        </div>
    );
};

export default CryptoTerminal;


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Terminal, Save, AlertCircle, Sparkles, Cpu, Lock, UploadCloud, Zap } from 'lucide-react';
import { Listing, CartItemConfiguration } from '../../types';
import CartItemContent from './CartItemContent';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    listing: any;
    config: CartItemConfiguration;
    onUpdateConfig: (newConfig: CartItemConfiguration) => void;
}

const ConfigurationModal: React.FC<Props> = ({ isOpen, onClose, listing, config, onUpdateConfig }) => {
    if (!listing) return null;

    const handleUpdateRequirements = (reqs: any) => {
        onUpdateConfig({ ...config, contentRequirements: reqs });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.98, y: 20 }}
                        className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-3xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20"
                    >
                        {/* Compact Header */}
                        <header className="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-blue-400 shadow-xl">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic text-slate-950 leading-none mb-1">Manifest Protocol</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Node:</span>
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">{listing.domain}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-all">
                                <X size={20} />
                            </button>
                        </header>

                        {/* Content Area - Optimized Padding */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]/50 custom-scrollbar">
                            
                            {/* Fulfillment Status - Compact */}
                            <div className="relative group overflow-hidden bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <Zap size={24} fill="currentColor" className="text-blue-200" />
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1 block">Engine Status</span>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Self-Drafted</h3>
                                    </div>
                                </div>
                                
                                <div className="flex-1 max-w-xs mx-10">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                        <span>Initialization</span>
                                        <span className="text-blue-600">33% Synced</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 w-1/3 animate-grow-slow"></div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <Terminal size={14} className="text-slate-400" />
                                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">SYS_STABLE</span>
                                </div>
                            </div>

                            {/* Forms - Compacted in CartItemContent via padding reductions */}
                            <section className="animate-in fade-in duration-700">
                                <CartItemContent 
                                    config={config}
                                    onChange={handleUpdateRequirements}
                                />
                            </section>
                        </div>

                        {/* Professional Footer */}
                        <footer className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100/50">
                                <ShieldCheck size={14} fill="currentColor" className="text-emerald-200" />
                                Secure Transmission: AES-256
                            </div>
                            
                            <button 
                                onClick={onClose}
                                className="bg-slate-950 text-white px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-3"
                            >
                                Lock Parameters <Save size={14} />
                            </button>
                        </footer>
                    </motion.div>
                </div>
            )}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes grow-slow { from { width: 0; } to { width: 33%; } }
                .animate-grow-slow { animation: grow-slow 1.5s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}} />
        </AnimatePresence>
    );
};

export default ConfigurationModal;

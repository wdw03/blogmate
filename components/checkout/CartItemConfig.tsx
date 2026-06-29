
import React from 'react';
import { Layout, PenTool, UploadCloud, Link as LinkIcon, Check, Edit2, Zap, ArrowRight } from 'lucide-react';
import { CartItemConfiguration, Listing } from '../../types';

interface CartItemConfigProps {
    listing: Listing;
    config: CartItemConfiguration;
    onSelectContentType: (type: 'provide' | 'hire' | 'insertion') => void;
    writerFee: number;
}

const CartItemConfig: React.FC<CartItemConfigProps> = ({ listing, config, onSelectContentType, writerFee }) => {
    
    const contentMethods = [
        { 
            id: 'provide', 
            label: 'Self-Drafted Payload', 
            desc: 'Upload your own technical article node.', 
            icon: UploadCloud, 
            fee: 0,
            tag: 'FREE',
            tagColor: 'bg-blue-50 text-blue-600 border-blue-100',
            accent: 'blue'
        },
        { 
            id: 'hire', 
            label: 'Elite Content Hub', 
            desc: 'Expert authorship optimized for metrics.', 
            icon: PenTool, 
            fee: writerFee,
            tag: 'BEST VALUE',
            tagColor: 'bg-orange-50 text-orange-600 border-orange-100',
            accent: 'orange'
        },
        { 
            id: 'insertion', 
            label: 'Link Injection', 
            desc: 'Map link to existing verified post node.', 
            icon: LinkIcon, 
            fee: 0,
            tag: 'INSTANT',
            tagColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            accent: 'indigo'
        }
    ];

    return (
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden p-10 lg:p-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 shadow-2xl flex items-center justify-center text-blue-400 transform rotate-3">
                    <Layout size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase italic">Fulfillment Engine</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Select initialization protocol for <span className="text-blue-600 font-black">{listing.domain}</span></p>
                </div>
            </div>

            <div className="grid gap-4">
                {contentMethods.map((method) => {
                    const isSelected = config.contentType === method.id;
                    const hasDetails = !!(config.contentRequirements?.fileUrl || config.contentRequirements?.topic || config.contentRequirements?.existingPostUrl);

                    return (
                        <button
                            key={method.id}
                            onClick={() => onSelectContentType(method.id as any)}
                            className={`group w-full flex items-center gap-6 p-8 rounded-[2rem] text-left transition-all border-2 relative overflow-hidden ${
                                isSelected 
                                ? `bg-white border-${method.accent}-600 shadow-2xl scale-[1.02] z-10` 
                                : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
                            }`}
                        >
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shrink-0 ${
                                isSelected 
                                  ? `bg-${method.accent}-600 text-white shadow-xl rotate-6` 
                                  : 'bg-white text-slate-400 group-hover:bg-slate-100'
                            }`}>
                                <method.icon size={28} strokeWidth={2.5} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className={`font-black text-xl tracking-tight transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{method.label}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${method.tagColor}`}>{method.tag}</span>
                                </div>
                                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-tight leading-none max-w-sm">{method.desc}</p>
                            </div>

                            <div className="text-right flex flex-col items-end gap-2.5 shrink-0">
                                <div className={`text-2xl font-black tabular-nums transition-colors ${isSelected ? `text-${method.accent}-600` : 'text-slate-900'}`}>
                                    {method.fee > 0 ? `+$${method.fee}` : 'FREE'}
                                </div>
                                {isSelected && hasDetails ? (
                                    <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 animate-in zoom-in">
                                        <Check size={12} strokeWidth={4} /> Manifest Locked
                                    </span>
                                ) : isSelected ? (
                                    <span className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                        Initialize <ArrowRight size={12} strokeWidth={3} className="animate-pulse" />
                                    </span>
                                ) : null}
                            </div>
                            
                            {isSelected && (
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${method.accent}-500 opacity-[0.03] rounded-bl-[100%] transition-all duration-1000 group-hover:scale-150`}></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CartItemConfig;

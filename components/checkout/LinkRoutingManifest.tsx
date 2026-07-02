
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Target, Zap, Plus, Trash2 } from 'lucide-react';
import { ContentLink } from '../../types';

interface LinkRoutingManifestProps {
    links: ContentLink[];
    onUpdate: (index: number, link: ContentLink) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

const Label = ({ children, required }: { children?: React.ReactNode, required?: boolean }) => (
    <div className="flex justify-between items-center mb-2 ml-1">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {children} {required && <span className="text-rose-500">*</span>}
        </label>
        {required && <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Required</span>}
    </div>
);

export const LinkRoutingManifest: React.FC<LinkRoutingManifestProps> = ({ links = [], onUpdate, onAdd, onRemove }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2 ml-1">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Link2 size={20} />
                </div>
                <div>
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter">Link Routing Manifest</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Deployment Configuration</p>
                </div>
            </div>

            <div className="space-y-4">
                {links.map((link, idx) => (
                    <div 
                        key={idx}
                        className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-blue-200 transition-all relative group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-950 text-blue-400 flex items-center justify-center font-mono font-black text-[10px]">
                                    0{idx + 1}
                                </div>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Node Protocol</span>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                                    <Zap size={10} fill="currentColor" /> SSL Sync
                                </div>
                            </div>
                            {idx > 0 && (
                                <button 
                                    type="button"
                                    onClick={() => onRemove(idx)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
                                    title="Remove Link"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label required={idx === 0}>Anchor Text {idx + 1}</Label>
                                <div className="relative group/input">
                                    <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder={idx === 0 ? "Primary Keyword / Phrase..." : "Secondary Keyword (Optional)..."}
                                        value={link.anchorText}
                                        onChange={(e) => onUpdate(idx, { ...link, anchorText: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label required={idx === 0}>Landing Page URL {idx + 1}</Label>
                                <div className="relative group/input">
                                    <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder={idx === 0 ? "https://yourpage.com/target" : "https://yourpage.com/secondary (Optional)"}
                                        value={link.landingPageUrl}
                                        onChange={(e) => onUpdate(idx, { ...link, landingPageUrl: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {links.length < 2 && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="w-full py-4 px-6 bg-slate-50 hover:bg-blue-50/60 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-[2rem] flex items-center justify-center gap-2.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-all group shadow-sm"
                    >
                        <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 group-hover:border-blue-300 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Plus size={14} strokeWidth={3} />
                        </div>
                        <span>+ Add 2nd Anchor Text & Landing Page URL (Optional)</span>
                    </button>
                )}
            </div>
        </div>
    );
};

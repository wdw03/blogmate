
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Target, Zap } from 'lucide-react';
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

export const LinkRoutingManifest: React.FC<LinkRoutingManifestProps> = ({ links = [], onUpdate }) => {
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
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-slate-950 text-blue-400 flex items-center justify-center font-mono font-black text-[10px]">
                                0{idx + 1}
                            </div>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Node Protocol</span>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                                <Zap size={10} fill="currentColor" /> SSL Sync
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label required>Anchor Text</Label>
                                <div className="relative group/input">
                                    <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder="Primary Keyword / Phrase..."
                                        value={link.anchorText}
                                        onChange={(e) => onUpdate(idx, { ...link, anchorText: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label required>Landing Page URL</Label>
                                <div className="relative group/input">
                                    <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder="https://yourpage.com/target"
                                        value={link.landingPageUrl}
                                        onChange={(e) => onUpdate(idx, { ...link, landingPageUrl: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

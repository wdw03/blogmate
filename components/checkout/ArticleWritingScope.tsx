
import React from 'react';
import { FileText, Hash } from 'lucide-react';
import { ContentRequirements } from '../../types';

interface ArticleWritingScopeProps {
    reqs: ContentRequirements;
    onUpdate: (field: keyof ContentRequirements, value: any) => void;
}

const CATEGORIES = ["General", "Technology", "Business", "Finance", "Health", "Travel", "Lifestyle", "Crypto", "iGaming"];
const WORD_COUNTS = [750, 1000, 1500, 2000, 2500, 3000];

const Label = ({ children, required, optional }: { children?: React.ReactNode, required?: boolean, optional?: boolean }) => (
    <div className="flex justify-between items-center mb-2 ml-1">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {children} {required && <span className="text-rose-500">*</span>}
        </label>
        {optional && <span className="text-[9px] font-bold text-slate-400 uppercase italic">Optional</span>}
        {required && <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Required</span>}
    </div>
);

export const ArticleWritingScope: React.FC<ArticleWritingScopeProps> = ({ reqs, onUpdate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2 ml-1">
                    <FileText size={18} className="text-blue-600" />
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Project Scope</h4>
                </div>
                <div>
                    <Label optional>Article Topic / Title</Label>
                    <input 
                        placeholder="What should the post be about?" 
                        value={reqs.topic || ''} 
                        onChange={e => onUpdate('topic', e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label optional>Niche</Label>
                        <select 
                            value={reqs.category || 'General'} 
                            onChange={e => onUpdate('category', e.target.value)}
                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-600"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label required>Draft Length</Label>
                        <select 
                            value={reqs.wordCount || 1000} 
                            onChange={e => onUpdate('wordCount', Number(e.target.value))}
                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-600"
                        >
                            {WORD_COUNTS.map(c => <option key={c} value={c}>{c} Words</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2 ml-1">
                    <Hash size={18} className="text-blue-600" />
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Latent Semantics</h4>
                </div>
                <div>
                    <Label optional>Target Keywords (One per line)</Label>
                    <textarea 
                        rows={6} 
                        value={reqs.keywords || ''} 
                        onChange={e => onUpdate('keywords', e.target.value)}
                        placeholder="primary_keyword&#10;secondary_keyword..."
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-200 shadow-sm resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

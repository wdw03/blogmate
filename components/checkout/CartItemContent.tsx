
import React, { useState } from 'react';
import { 
    UploadCloud, FileJson, Link as LinkIcon, Info, Globe, 
    Sparkles, AlertCircle, Search, Code, Image as ImageIcon,
    Loader2, X, Check, FileCode, Zap
} from 'lucide-react';
import { CartItemConfiguration, ContentRequirements } from '../../types';
import { LinkRoutingManifest } from './LinkRoutingManifest';
import { ArticleWritingScope } from './ArticleWritingScope';
import { FileUploadZone } from './FileUploadZone';
import { supabase } from '../../lib/supabase';

interface CartItemContentProps {
    config: CartItemConfiguration;
    onChange: (reqs: ContentRequirements) => void;
    onUploadProgress?: (isUploading: boolean) => void;
}

const Label = ({ children, optional, required }: { children?: React.ReactNode, optional?: boolean, required?: boolean }) => (
    <div className="flex justify-between items-center mb-2.5 ml-1">
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {children} {required && <span className="text-rose-500">*</span>}
        </label>
        {optional && <span className="text-[8px] font-bold text-slate-400 uppercase italic">Optional</span>}
    </div>
);

const CartItemContent: React.FC<CartItemContentProps> = ({ config, onChange, onUploadProgress }) => {
    const reqs = config.contentRequirements || { links: [{ anchorText: '', landingPageUrl: '' }] };
    const [uploadingImg, setUploadingImg] = useState(false);

    const updateField = (field: keyof ContentRequirements, value: any) => {
        onChange({ ...reqs, [field]: value });
    };

    const handleUpdateLink = (index: number, updatedLink: any) => {
        const currentLinks = [...(reqs.links || [{ anchorText: '', landingPageUrl: '' }])];
        currentLinks[index] = updatedLink;
        onChange({ ...reqs, links: currentLinks });
    };

    const handleAddLink = () => {
        const currentLinks = [...(reqs.links || [{ anchorText: '', landingPageUrl: '' }])];
        if (currentLinks.length < 2) {
            currentLinks.push({ anchorText: '', landingPageUrl: '' });
            onChange({ ...reqs, links: currentLinks });
        }
    };

    const handleRemoveLink = (index: number) => {
        const currentLinks = [...(reqs.links || [])];
        currentLinks.splice(index, 1);
        onChange({ ...reqs, links: currentLinks });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        onUploadProgress?.(true);
        try {
            const fileName = `img_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const { data, error } = await supabase.storage.from('articles').upload(fileName, file);
            if (error) throw error;
            if (data?.path) updateField('imagePath', data.path);
        } catch (err: any) {
            alert("Image upload failed: " + err.message);
        } finally {
            setUploadingImg(false);
            onUploadProgress?.(false);
        }
    };

    return (
        <div className="space-y-10 bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-200 shadow-inner">
            
            <LinkRoutingManifest 
                links={reqs.links || [{ anchorText: '', landingPageUrl: '' }]}
                onUpdate={handleUpdateLink}
                onAdd={handleAddLink}
                onRemove={handleRemoveLink}
            />

            <div className="space-y-10">
                {config.contentType === 'insertion' && (
                    <div className="space-y-3">
                        <Label required>Target Landing URL</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-blue-400">
                                <LinkIcon size={14} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="https://existing-post-on-site.com/..."
                                value={reqs.existingPostUrl || ''}
                                onChange={e => updateField('existingPostUrl', e.target.value)}
                                className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                )}

                {config.contentType === 'provide' && (
                    <FileUploadZone 
                        fileUrl={reqs.fileUrl} 
                        onUpload={(name) => updateField('fileUrl', name)} 
                        onProgress={onUploadProgress}
                    />
                )}

                {config.contentType === 'hire' && (
                    <ArticleWritingScope reqs={reqs} onUpdate={updateField} />
                )}
            </div>

            {/* Multimedia Assets - Tightened Grid */}
            <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2.5 mb-6 ml-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">Custom Embed Code</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                        <Label optional>Custom HTML Code</Label>
                        <div className="relative group">
                            <Code size={14} className="absolute left-4 top-4 text-slate-500" />
                            <textarea 
                                rows={4} 
                                value={reqs.htmlCode || ''} 
                                onChange={e => updateField('htmlCode', e.target.value)}
                                placeholder="<iframe>...</iframe>"
                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-mono text-emerald-400 focus:outline-none focus:border-blue-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
                <Label optional>Operational Directives</Label>
                <textarea 
                    rows={2} 
                    value={reqs.specialInstructions || ''} 
                    onChange={e => updateField('specialInstructions', e.target.value)}
                    placeholder="Specific placement requests or tone directives..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
            </div>
        </div>
    );
};

export default CartItemContent;

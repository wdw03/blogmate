
import React, { useState, useRef } from 'react';
import { FileCode, Check, Loader2, AlertCircle, FileType, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface FileUploadZoneProps {
    fileUrl?: string;
    onUpload: (path: string) => void;
    onProgress?: (isUploading: boolean) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ fileUrl, onUpload, onProgress }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation for .docx
        if (!file.name.toLowerCase().endsWith('.docx')) {
            alert("Institutional Protocol Restriction: Only .DOCX payloads authorized.");
            return;
        }

        setUploading(true);
        onProgress?.(true);
        setError(null);

        try {
            const timestamp = Date.now();
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const fileName = `${timestamp}_${cleanName}`;
            
            const { data, error: upError } = await supabase.storage
                .from('articles')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (upError) throw upError;
            
            // Double check if file exists
            if (data?.path) {
                onUpload(data.path);
            }
        } catch (err: any) {
            console.error("Payload Sync Error:", err);
            setError(err.message || 'Transmission failed.');
            alert(`CRITICAL_UPLOAD_ERROR: ${err.message}`);
        } finally {
            setUploading(false);
            onProgress?.(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-blue-400">
                        <FileType size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Article Payload Source</span>
                </div>
                <span className="bg-rose-50 text-rose-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-rose-100">DOCX REQUIRED</span>
            </div>
            
            <div className={`relative group border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 ${
                fileUrl ? 'bg-emerald-50/20 border-emerald-300' : (error ? 'bg-rose-50 border-rose-200' : 'bg-slate-50/50 border-slate-200 hover:border-blue-600')
            }`}>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept=".docx" 
                    disabled={uploading} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed" 
                    onChange={handleFileChange} 
                />

                <div className="relative z-10 flex flex-col items-center">
                    {uploading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-50">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" strokeWidth={2} />
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic animate-pulse">Syncing Node Payload...</h4>
                        </div>
                    ) : fileUrl ? (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white">
                                <Check size={32} strokeWidth={4} />
                            </div>
                            <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter mt-5">Payload Synced Successfully</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 truncate max-w-xs px-4 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                                {fileUrl.split('_').slice(1).join('_')}
                            </p>
                            <button onClick={(e) => { e.stopPropagation(); onUpload(''); }} className="mt-4 text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Re-initialize Upload</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm mb-6 text-slate-200 group-hover:text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all border border-slate-100">
                                <Upload size={40} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-2 italic leading-none">Deploy Article Node</h4>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">DRAG & DROP OR BROWSE (MAX 20MB)</p>
                            {error && (
                                <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 text-[10px] font-bold uppercase">
                                    <AlertCircle size={12} /> {error}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

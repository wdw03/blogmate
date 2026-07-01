
import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowRight, ShieldCheck, Globe, Zap, Printer, Shield, FileText, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
    orderId: string | null;
    totalPrice: number;
}

const ConfirmationSuccess: React.FC<Props> = ({ orderId, totalPrice }) => {
    const [userName, setUserName] = useState('Hub_Operator');
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else if (user?.email) {
                setUserName(user.email.split('@')[0].toUpperCase());
            }
        });

        if (orderId) {
            supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => {
                setOrderData(data);
            });
        }
    }, [orderId]);
    
    const handleGenerateInvoice = () => {
        const timestamp = orderData?.metadata?.timestamp 
            ? new Date(orderData.metadata.timestamp).toLocaleString() 
            : new Date().toLocaleString();
        
        const registryId = orderId?.slice(0, 8).toUpperCase() || 'PND-00X';
        const items = orderData?.items || [];
        const surcharge = orderData?.surcharge || 0;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const itemsHtml = items.map((item: any) => `
            <tr>
                <td class="px-6 py-6 border-b border-slate-50">
                    <div class="font-black text-slate-900 uppercase tracking-tight">${item.domain}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest">${item.niche} NICHE</span>
                        <span class="text-[8px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">${item.service_type}</span>
                    </div>
                </td>
                <td class="px-6 py-6 border-b border-slate-50 text-right">
                    <div class="text-[10px] text-slate-400 font-bold uppercase mb-1">Base: $${item.pricing_breakdown?.niche_adjusted_price?.toLocaleString()}</div>
                    ${item.pricing_breakdown?.writer_fee > 0 ? `<div class="text-[10px] text-orange-500 font-bold uppercase">Writing Fee: +$${item.pricing_breakdown.writer_fee}</div>` : ''}
                    <div class="font-black text-slate-950 mt-1">$${item.pricing_breakdown?.final_item_price?.toLocaleString()}</div>
                </td>
            </tr>
        `).join('');

        const html = `
            <html>
            <head>
                <title>BLOGMET_INVOICE_${registryId}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; margin: 0; padding: 0; background: #fff; }
                    @media print { .no-print { display: none !important; } @page { margin: 0; } }
                    .invoice-container { max-width: 900px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 60px; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <header class="flex justify-between items-start mb-16">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-2xl">B</div>
                            <div>
                                <h1 class="text-3xl font-black uppercase tracking-tighter italic leading-none">BlogMet</h1>
                                <p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">Intelligence Network</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <h2 class="text-5xl font-black text-slate-900 uppercase italic leading-none">INVOICE</h2>
                            <p class="text-[11px] font-black text-slate-400 mt-3 uppercase tracking-[0.2em]">Node Settlement Authorization</p>
                        </div>
                    </header>

                    <div class="grid grid-cols-2 gap-12 mb-16">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3">Authorized Operator:</p>
                            <div class="text-xl font-black text-slate-900 uppercase italic tracking-tight">${userName}</div>
                            <div class="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Institutional Hub Member</div>
                            <div class="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Terminal: GLOBAL_NODE_01</div>
                        </div>
                        <div class="text-right">
                            <div class="space-y-3">
                                <div class="flex justify-end gap-10">
                                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">REGISTRY_ID:</span>
                                    <span class="text-[11px] font-mono font-black text-slate-900 uppercase">#${registryId}</span>
                                </div>
                                <div class="flex justify-end gap-10">
                                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">DEPLOY_DATE:</span>
                                    <span class="text-[11px] font-black text-slate-900 uppercase">${timestamp}</span>
                                </div>
                                <div class="flex justify-end gap-10">
                                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">AUTH_STATUS:</span>
                                    <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 uppercase tracking-widest">AUTHORIZED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-16 border-2 rounded-[2.5rem] overflow-hidden border-slate-100 shadow-sm">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <tr>
                                    <th class="px-8 py-5">MANIFEST_DESCRIPTION</th>
                                    <th class="px-8 py-5 text-right">SETTLEMENT</th>
                                </tr>
                            </thead>
                            <tbody class="text-slate-900 font-medium divide-y divide-slate-50">
                                ${itemsHtml}
                            </tbody>
                            <tfoot class="bg-slate-50/50">
                                ${surcharge > 0 ? `
                                <tr>
                                    <td class="px-8 py-4 text-right text-[10px] font-black text-rose-500 uppercase tracking-widest">Deferred Protocol Fee (10%)</td>
                                    <td class="px-8 py-4 text-right font-black text-rose-600">+$${surcharge.toLocaleString()}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td class="px-8 py-8 text-right text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">Gross Settlement Due</td>
                                    <td class="px-8 py-8 text-right">
                                        <div class="text-5xl font-black text-slate-950 tracking-tighter leading-none italic">$${totalPrice.toLocaleString()}</div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div class="grid grid-cols-2 gap-10 mb-16">
                        <div class="p-8 bg-[#f8fafc] rounded-[2rem] border border-slate-100 relative overflow-hidden">
                            <div class="absolute top-0 right-0 p-4 opacity-10"><Shield size={60} class="text-blue-600" /></div>
                            <div class="flex items-center gap-3 mb-4 relative z-10">
                                <Shield size={18} class="text-blue-600" />
                                <span class="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em]">Security Clearance</span>
                            </div>
                            <p class="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight relative z-10">
                                This document serves as a verified confirmation of asset synchronization. All node acquisitions are recorded on the secure institutional ledger using AES-256 encryption.
                            </p>
                        </div>
                        <div class="flex flex-col justify-center items-end opacity-20 grayscale">
                            <div class="w-32 h-32">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            </div>
                        </div>
                    </div>

                    <footer class="pt-12 border-t-2 border-dashed border-slate-100 text-center">
                        <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-6 italic">Zero-Trust Infrastructure Protocol Architecture v4.8.6</p>
                        <div class="flex justify-center gap-10">
                            <span class="text-[10px] font-black text-slate-900 border-b-2 border-slate-900 px-2 italic">VERIFIED</span>
                            <span class="text-[10px] font-black text-slate-900 border-b-2 border-slate-900 px-2 italic">ENCRYPTED</span>
                            <span class="text-[10px] font-black text-slate-900 border-b-2 border-slate-900 px-2 italic">AUTHORIZED</span>
                        </div>
                    </footer>
                </div>

                <div class="mt-16 flex justify-center no-print pb-20">
                    <button onclick="window.print()" class="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 group">
                        <Printer size={20} class="group-hover:rotate-12 transition-transform" /> Print Institutional Document
                    </button>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center bg-[#F8FAFC] font-['Inter'] px-4 selection:bg-blue-100 overflow-hidden relative">
            {/* Background Texture Nodes */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:32px_32px] opacity-40"></div>
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/50 to-transparent"></div>

            <div className="w-full max-w-lg bg-white rounded-[3.5rem] p-8 md:p-14 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600"></div>
                
                <div className="relative mb-12">
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 border-[6px] border-white ring-1 ring-emerald-50 relative z-10">
                        <CheckCircle size={48} className="text-white" strokeWidth={3} />
                    </div>
                    {/* Animated Pulse Orbs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/5 rounded-full animate-ping"></div>
                </div>
                
                <h2 className="text-5xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic leading-none">Protocol Success.</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[11px] mb-14 opacity-70">Manifest authorization complete at node source.</p>
                
                <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 mb-12 text-left relative overflow-hidden group shadow-inner">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:scale-125 transition-transform duration-1000 pointer-events-none text-slate-950"><Globe size={180} /></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Registry Node ID</span>
                            <div className="text-lg font-mono font-black text-slate-900 tracking-widest bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">#{orderId?.slice(0,8).toUpperCase()}</div>
                        </div>
                        <div className="text-left md:text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Gross Settlement</span>
                            <div className="text-4xl font-black text-blue-600 tracking-tighter italic tabular-nums">$${totalPrice.toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleGenerateInvoice}
                        className="w-full py-6 bg-white border-2 border-slate-100 text-slate-950 rounded-2xl font-black text-[13px] uppercase tracking-[0.3em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all flex items-center justify-center gap-4 shadow-sm group relative z-10 active:scale-95"
                    >
                        <FileText size={20} className="group-hover:translate-y-0.5 transition-transform" /> 
                        Generate Forensic PDF
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 group cursor-default hover:border-blue-500/40 transition-all shadow-sm">
                        <ShieldCheck size={24} className="text-blue-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auth_Node</span>
                    </div>
                    <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 group cursor-default hover:border-orange-500/40 transition-all shadow-sm">
                        <Clock size={24} className="text-orange-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} PM</span>
                    </div>
                </div>

                <button 
                    onClick={() => window.location.hash = '#/profile'} 
                    className="w-full py-7 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[13px] tracking-[0.4em] shadow-3xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-5 active:scale-95 group"
                >
                    ENTER OPERATOR HUB <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ConfirmationSuccess;

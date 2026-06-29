
import React, { useState } from 'react';
import { Smartphone, Zap, Loader2, ShieldCheck } from 'lucide-react';

interface RazorpayTerminalProps {
    amount: number;
    currency: string;
    onSuccess: (ref: string) => void;
    onCancel: () => void;
    email?: string;
    phone?: string;
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_RweAWH6eAOvhti";

const RazorpayTerminal: React.FC<RazorpayTerminalProps> = ({ amount, currency, onSuccess, onCancel, email, phone }) => {
    const [loading, setLoading] = useState(false);

    const initializeRazorpay = () => {
        setLoading(true);
        const options = {
            key: RAZORPAY_KEY,
            amount: Math.round(amount * 100),
            currency: currency === 'INR' ? 'INR' : 'USD',
            name: "DomIntel Deployment",
            description: "Secure Asset Settlement",
            handler: (response: any) => {
                setLoading(false);
                onSuccess(response.razorpay_payment_id);
            },
            prefill: { email, contact: phone },
            theme: { color: "#2563eb" },
            modal: { ondismiss: () => { setLoading(false); onCancel(); } }
        };

        try {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            setLoading(false);
            alert("Could not launch Razorpay terminal.");
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center shadow-inner border border-blue-100">
                <Smartphone size={48} className="text-blue-600" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Unified Card/UPI</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-xs mx-auto">Fast settlement via Credit/Debit Cards, UPI, or Netbanking.</p>
            </div>
            <button 
                onClick={initializeRazorpay} 
                disabled={loading} 
                className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50"
            >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} fill="currentColor" className="text-blue-400" />}
                {loading ? 'CONNECTING...' : 'LAUNCH TERMINAL'}
            </button>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">
                <ShieldCheck size={14} /> 256-bit SSL Encrypted
            </div>
        </div>
    );
};

export default RazorpayTerminal;

import React from 'react';
import { 
    Globe, Smartphone, Bitcoin, Clock, 
    ShieldCheck, Zap, MessageSquare, ExternalLink, 
    CheckCircle, CreditCard, Loader2, ArrowRight
} from 'lucide-react';

interface TerminalProps {
    amount: number;
    onSuccess: (ref: string) => void;
    onCancel: () => void;
    processing?: boolean;
}

// 1. PayPal Terminal
export const PayPalTerminal: React.FC<TerminalProps> = ({ amount, onSuccess }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

    React.useEffect(() => {
        const sdk = (window as any).paypal;
        if (!sdk || !containerRef.current) return;

        try {
            containerRef.current.innerHTML = '';
            sdk.Buttons({
                style: { layout: 'vertical', color: 'blue', shape: 'rect', height: 55 },
                createOrder: (data: any, actions: any) => actions.order.create({
                    purchase_units: [{
                        amount: { currency_code: 'USD', value: amount.toFixed(2) },
                        description: "DomIntel Asset Settlement"
                    }]
                }),
                onApprove: async (data: any, actions: any) => {
                    const order = await actions.order.capture();
                    onSuccess(order.id);
                },
                onError: () => setStatus('error'),
            }).render(containerRef.current);
            setStatus('ready');
        } catch (err) {
            setStatus('error');
        }
    }, [amount]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-100">
                    <Globe size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Global PayPal Checkout</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Authorized Node Encryption: Active</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Amount</span>
                    <span className="text-2xl font-black text-slate-900">${amount.toLocaleString()} USD</span>
                </div>
                
                <div ref={containerRef} className="w-full min-h-[150px]">
                    {status === 'loading' && (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. Razorpay Terminal
export const RazorpayTerminal: React.FC<TerminalProps> = ({ amount, onSuccess, onCancel }) => {
    const [loading, setLoading] = React.useState(false);

    const initializeRazorpay = () => {
        setLoading(true);
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_RweAWH6eAOvhti",
            amount: Math.round(amount * 100),
            currency: "USD",
            name: "DomIntel Deployment",
            description: "Secure Asset Settlement",
            handler: (response: any) => {
                setLoading(false);
                onSuccess(response.razorpay_payment_id);
            },
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-blue-400 mb-6 shadow-xl">
                    <CreditCard size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Razorpay Gateway</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Unified Payment Infrastructure</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Amount</span>
                    <span className="text-2xl font-black text-slate-900">${amount.toLocaleString()} USD</span>
                </div>

                <button 
                    onClick={initializeRazorpay}
                    disabled={loading}
                    className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" className="text-blue-400" />}
                    {loading ? 'INITIALIZING...' : 'LAUNCH TERMINAL'}
                </button>
            </div>
        </div>
    );
};

// 3. Binance / Crypto Terminal
export const CryptoTerminal: React.FC<TerminalProps> = ({ amount }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-orange-500 mb-6 shadow-xl border border-orange-100">
                    <Bitcoin size={40} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Crypto Asset Lock</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">TRC-20 / ERC-20 Verified Network</p>
            </div>

            <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 shadow-3xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-6">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transfer Payload</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono">${amount} USDT</span>
                    </div>

                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                        <Zap size={18} className="text-orange-400 mt-1" />
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            To maintain institutional security and zero-slippage, crypto transfers are verified via our live support node.
                        </p>
                    </div>

                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl"
                    >
                        <MessageSquare size={18} /> Request Wallet Address
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-5">
                    <Bitcoin size={200} />
                </div>
            </div>
        </div>
    );
};

// 4. Pay Later Terminal (Net-30)
export const PayLaterTerminal: React.FC<TerminalProps> = ({ amount, processing, onSuccess }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-6 shadow-sm border border-emerald-100">
                    <Clock size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Net-30 Credit Line</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Authorized Institutional Deferred Protocol</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Billing Term</span>
                        <div className="text-sm font-black text-slate-900">30 Solar Days</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Credit Limit</span>
                        <div className="text-sm font-black text-emerald-600">Tier 1 Elite</div>
                    </div>
                </div>

                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Operator Authorized</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                        Node deployment will trigger immediately. Settlement required via bank wire within the specified cycle.
                    </p>
                </div>

                <button 
                    onClick={() => onSuccess('NET30_AUTH_MOCK')}
                    disabled={processing}
                    className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                    {processing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" className="text-blue-400" />}
                    Deploy Asset Manifest
                </button>
            </div>
        </div>
    );
};
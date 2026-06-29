
import React, { useEffect, useRef, useState } from 'react';
import { Globe, Loader2, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface PayPalTerminalProps {
    amount: number;
    currency: string;
    onSuccess: (ref: string) => void;
    description: string;
}

const USD_INR_RATE = 83.50;

const PayPalTerminal: React.FC<PayPalTerminalProps> = ({ amount, currency, onSuccess, description }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const finalAmountUSD = currency === 'INR' ? (amount / USD_INR_RATE) : amount;
    const displayAmount = Number(finalAmountUSD.toFixed(2));

    useEffect(() => {
        const sdk = (window as any).paypal;
        if (!sdk) {
            setStatus('error');
            setErrorMessage("PayPal Security Script not detected.");
            return;
        }

        if (!containerRef.current) return;

        try {
            containerRef.current.innerHTML = '';
            sdk.Buttons({
                style: { layout: 'vertical', color: 'blue', shape: 'rect', height: 55 },
                createOrder: (data: any, actions: any) => actions.order.create({
                    purchase_units: [{
                        amount: { currency_code: 'USD', value: displayAmount.toString() },
                        description: description
                    }]
                }),
                onApprove: async (data: any, actions: any) => {
                    const order = await actions.order.capture();
                    onSuccess(order.id);
                },
                onError: (err: any) => setStatus('error'),
            }).render(containerRef.current);
            setStatus('ready');
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    }, [displayAmount, description]);

    return (
        <div className="w-full flex flex-col items-center space-y-6">
            <div className="w-full max-w-sm bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <Globe className="text-blue-600" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Secure Node</span>
                </div>
                <div className="font-mono font-black text-slate-900 text-sm">${displayAmount} USD</div>
            </div>
            <div ref={containerRef} className="w-full min-h-[150px]"></div>
        </div>
    );
};

export default PayPalTerminal;

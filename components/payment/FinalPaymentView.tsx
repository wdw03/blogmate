
import React, { useState, useEffect } from 'react';
import {
    Ticket, CreditCard, Globe, Bitcoin, Clock,
    ArrowLeft, ShieldCheck, ShoppingBag, Loader2, Zap,
    ChevronRight, Lock, Activity, AlertCircle, Wallet,
    TrendingUp
} from 'lucide-react';
import PayPalGateway from './PayPalGateway';
import RazorpayGateway from './RazorpayGateway';
import CryptoGateway from './CryptoGateway';
import Net30Gateway from './Net30Gateway';
import WalletGateway from './WalletGateway';
import { supabase } from '../../lib/supabase';

interface Props {
    itemsCount: number;
    grossAmount: number;
    discountAmount: number;
    surcharge: number;
    totalPrice: number;
    onBack: () => void;
    onFinalize: (transactionId?: string) => void;
    processing: boolean;
    coupon: string;
    setCoupon: (c: string) => void;
    onValidateCoupon: () => void;
    isValidatingCoupon?: boolean;
    couponError?: string | null;
    selectedGateway: string;
    setSelectedGateway: (g: string) => void;
}

const FinalPaymentView: React.FC<Props> = ({
    itemsCount, grossAmount, discountAmount, surcharge, totalPrice,
    onBack, onFinalize, processing, coupon, setCoupon,
    onValidateCoupon, isValidatingCoupon, couponError,
    selectedGateway, setSelectedGateway
}) => {
    const [isGatewayActive, setIsGatewayActive] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [gatewayAvailability, setGatewayAvailability] = useState<Record<string, boolean>>({ PayPal: true, Razorpay: true, Binance: true, Net30: true, Wallet: true });

    useEffect(() => {
        const getBalance = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase.from('profiles').select('wallet_balance').eq('id', session.user.id).single();
                if (data) setWalletBalance(data.wallet_balance || 0);
            }
        };
        getBalance();
    }, []);

    useEffect(() => {
        const loadGatewaySettings = async () => {
            const { data, error } = await supabase.from('payment_gateway_settings').select('gateway_key,is_enabled').order('sort_order');
            if (!error && data?.length) {
                const availability = Object.fromEntries(data.map((row: any) => [row.gateway_key, row.is_enabled]));
                setGatewayAvailability(prev => ({ ...prev, ...availability }));
                if (availability[selectedGateway] === false) {
                    const firstEnabled = data.find((row: any) => row.is_enabled)?.gateway_key;
                    if (firstEnabled) setSelectedGateway(firstEnabled);
                }
            }
        };
        loadGatewaySettings();
    }, []);

    const renderActiveGateway = () => {
        switch (selectedGateway) {
            case 'PayPal': return <PayPalGateway amount={totalPrice} onBack={() => setIsGatewayActive(false)} onSuccess={onFinalize} />;
            case 'Razorpay': return <RazorpayGateway amount={totalPrice} onBack={() => setIsGatewayActive(false)} onSuccess={onFinalize} />;
            case 'Binance': return <CryptoGateway amount={totalPrice} onBack={() => setIsGatewayActive(false)} onSuccess={onFinalize} />;
            case 'Net30': return <Net30Gateway amount={totalPrice} onBack={() => setIsGatewayActive(false)} onSuccess={onFinalize} processing={processing} />;
            case 'Wallet': return <WalletGateway amount={totalPrice} balance={walletBalance} onBack={() => setIsGatewayActive(false)} onSuccess={onFinalize} processing={processing} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-white font-['Inter'] selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="flex items-center gap-8 mb-16 animate-in slide-in-from-top-4 duration-700">
                    <button
                        onClick={isGatewayActive ? () => setIsGatewayActive(false) : onBack}
                        className="w-14 h-14 bg-[#F2F4F7] rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all shadow-sm group"
                    >
                        <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-6xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Payment.</h1>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">Ready: {selectedGateway.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    <div className="lg:col-span-7 space-y-12">
                        {!isGatewayActive ? (
                            <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="bg-[#F2F4F7] rounded-[3rem] p-10 relative overflow-hidden group">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                        <Ticket size={240} className="text-slate-950" />
                                    </div>

                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm relative z-10">
                                        <div className="flex items-center gap-5 mb-10">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                                <Ticket size={22} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">Coupon Code</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Add discount to your order</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={coupon}
                                                    onChange={(e) => setCoupon(e.target.value)}
                                                    placeholder="ENTER CODE"
                                                    className="w-full bg-[#F2F4F7] border-none rounded-2xl py-6 pl-16 pr-6 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase tracking-[0.2em]"
                                                />
                                            </div>
                                            <button
                                                onClick={onValidateCoupon}
                                                disabled={isValidatingCoupon || !coupon}
                                                className="bg-[#6B7280] text-white px-14 py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                            >
                                                {isValidatingCoupon ? <Loader2 className="animate-spin" size={20} /> : 'Validate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 px-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Payment Gateways</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <GatewayOption label="PayPal" icon={<Globe />} active={gatewayAvailability.PayPal} selected={selectedGateway === 'PayPal'} onClick={() => gatewayAvailability.PayPal && setSelectedGateway('PayPal')} status={gatewayAvailability.PayPal ? undefined : 'OFFLINE'} />
                                        <GatewayOption label="Razorpay" icon={<CreditCard />} active={gatewayAvailability.Razorpay} selected={selectedGateway === 'Razorpay'} onClick={() => gatewayAvailability.Razorpay && setSelectedGateway('Razorpay')} status={gatewayAvailability.Razorpay ? undefined : 'OFFLINE'} />
                                        <GatewayOption label="Binance" icon={<Bitcoin />} active={gatewayAvailability.Binance} selected={selectedGateway === 'Binance'} onClick={() => gatewayAvailability.Binance && setSelectedGateway('Binance')} status={gatewayAvailability.Binance ? undefined : 'OFFLINE'} />
                                        <GatewayOption label="Pay Later" icon={<Clock />} active={gatewayAvailability.Net30} selected={selectedGateway === 'Net30'} onClick={() => gatewayAvailability.Net30 && setSelectedGateway('Net30')} status={gatewayAvailability.Net30 ? undefined : 'OFFLINE'} />
                                        <GatewayOption label="Wallet Hub" icon={<Wallet />} active={gatewayAvailability.Wallet} selected={selectedGateway === 'Wallet'} onClick={() => gatewayAvailability.Wallet && setSelectedGateway('Wallet')} status={gatewayAvailability.Wallet ? undefined : 'OFFLINE'} isNew />
                                    </div>

                                    <button
                                        disabled={!gatewayAvailability[selectedGateway]}
                                        onClick={() => gatewayAvailability[selectedGateway] && setIsGatewayActive(true)}
                                        className="w-full py-7 bg-slate-950 text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-950"
                                    >
                                        Open {selectedGateway === 'Wallet' ? 'Wallet Hub' : selectedGateway} Gateway <ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-500">
                                {renderActiveGateway()}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-[#020617] rounded-[3.5rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden flex flex-col min-h-[720px]">
                            <div className="absolute top-20 right-20 opacity-[0.02] scale-[4] pointer-events-none">
                                <ShoppingBag size={200} className="text-white" />
                            </div>

                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-16">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Your Order</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">{itemsCount} Website{itemsCount !== 1 ? 's' : ''} Selected</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <TrendingUp size={22} className="text-emerald-500 animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="flex justify-between items-center group mt-10">
                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Subtotal</span>
                                        <span className="text-2xl font-black text-white tracking-tighter">${grossAmount.toLocaleString()}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center group border-t border-white/5 pt-8">
                                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Discount</span>
                                            <span className="text-2xl font-black text-emerald-500 tracking-tighter">-${discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {surcharge > 0 && (
                                        <div className="flex justify-between items-center group border-t border-white/5 pt-8">
                                            <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.3em]">Admin Fee</span>
                                            <span className="text-2xl font-black text-rose-500 tracking-tighter">+${surcharge.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="pt-24 mt-auto">
                                        <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-12">
                                            <ShieldCheck size={16} className="text-emerald-500" />
                                            Secure Checkout
                                        </div>

                                        <div className="flex items-baseline justify-end relative">
                                            <span className="text-2xl font-black text-slate-700 absolute left-0 bottom-4">$</span>
                                            <div className="text-[8.5rem] font-black text-white leading-none tracking-tighter italic drop-shadow-2xl">
                                                {totalPrice.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GatewayOption = ({ label, icon, active, selected, onClick, status, isNew }: any) => (
    <button
        disabled={!active}
        onClick={onClick}
        className={`relative aspect-square w-full rounded-[2.5rem] flex flex-col items-center justify-center gap-6 transition-all border-2 group ${selected
            ? 'bg-white border-blue-600 shadow-2xl scale-[1.05] z-10'
            : 'bg-[#F2F4F7] border-transparent hover:border-slate-300'
            } ${!active ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
    >
        {status && (
            <div className="absolute top-3 bg-white px-3 py-1 rounded-full border border-slate-100 z-20 shadow-sm">
                <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap">{status}</span>
            </div>
        )}

        {isNew && !status && (
            <div className="absolute top-3 bg-blue-600 px-3 py-1 rounded-full z-20 shadow-lg">
                <span className="text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">BALANCE</span>
            </div>
        )}

        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${active ? (selected ? 'bg-slate-950 text-blue-400 shadow-xl' : 'bg-white text-slate-400') : 'bg-slate-200'
            }`}>
            {React.cloneElement(icon as any, { size: 36, strokeWidth: 1.5 })}
        </div>

        <div className="flex flex-col items-center">
            <span className={`text-[12px] font-black uppercase tracking-widest ${active ? (selected ? 'text-blue-600' : 'text-slate-950') : 'text-slate-400'}`}>
                {label}
            </span>
            {selected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,1)]"></div>}
        </div>
    </button>
);

export default FinalPaymentView;

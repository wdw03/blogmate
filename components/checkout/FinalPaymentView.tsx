
import React, { useState } from 'react';
import { 
    Ticket, CreditCard, Globe, Bitcoin, Clock, 
    ArrowLeft, ShieldCheck, ShoppingBag, Loader2, ArrowRight, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    itemsCount: number;
    grossAmount: number;
    discountAmount: number;
    totalPrice: number;
    onBack: () => void;
    onFinalize: () => void;
    processing: boolean;
    coupon: string;
    setCoupon: (c: string) => void;
}

const FinalPaymentView: React.FC<Props> = ({ 
    itemsCount, grossAmount, discountAmount, totalPrice, 
    onBack, onFinalize, processing, coupon, setCoupon 
}) => {
    const [selectedGateway, setSelectedGateway] = useState('Net30');

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#f8fafc] font-['Inter'] selection:bg-blue-600 selection:text-white overflow-x-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Responsive Header */}
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 md:w-14 md:h-14 bg-white border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-950 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                    
                    {/* Left Column: Voucher & Payment */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-10">
                        
                        {/* Network Voucher Section */}
                        <div className="bg-[#f1f5f9]/50 rounded-[2rem] md:rounded-[3rem] border border-slate-100 p-6 md:p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                                <Ticket size={120} className="md:w-[160px] md:h-[160px]" />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6 md:mb-8 relative z-10">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Ticket size={24} className="md:w-[28px] md:h-[28px]" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">Voucher Code</h3>
                                    <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Apply discount to your order</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 relative z-10">
                                <div className="flex-1 relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Ticket size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="ENTER CODE..."
                                        className="w-full bg-white border border-slate-100 rounded-xl md:rounded-2xl py-4 md:py-6 pl-12 md:pl-16 pr-6 text-[12px] md:sm font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm uppercase tracking-widest"
                                    />
                                </div>
                                <button className="bg-[#64748b] text-white px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg sm:min-w-[160px]">
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Payment Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <PaymentGateway 
                                id="PayPal" 
                                label="PayPal" 
                                icon={<Globe />} 
                                selected={selectedGateway === 'PayPal'}
                                onClick={() => setSelectedGateway('PayPal')}
                            />
                            <PaymentGateway 
                                id="Razorpay" 
                                label="Razorpay" 
                                icon={<CreditCard />} 
                                status="NOT IN SERVICE" 
                                selected={selectedGateway === 'Razorpay'}
                                onClick={() => {}}
                            />
                            <PaymentGateway 
                                id="Binance" 
                                label="Binance" 
                                icon={<Bitcoin />} 
                                status="NOT IN SERVICE" 
                                selected={selectedGateway === 'Binance'}
                                onClick={() => {}}
                            />
                            <PaymentGateway 
                                id="Net30" 
                                label="Pay Later" 
                                icon={<Clock />} 
                                selected={selectedGateway === 'Net30'}
                                onClick={() => setSelectedGateway('Net30')}
                            />
                        </div>
                    </div>

                    {/* Right Column: Compact Summary Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#020617] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden flex flex-col min-h-[500px]">
                            {/* Ambient Bag Background */}
                            <div className="absolute top-10 right-10 opacity-[0.02] scale-[2] pointer-events-none">
                                <ShoppingBag size={180} className="text-white" />
                            </div>

                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-4 mb-10 md:mb-16 border-b border-white/5 pb-8">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Summary</h3>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{itemsCount} Domain Assets</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest">Base Amount</span>
                                        <span className="text-lg md:text-xl font-black text-white tracking-tighter">${grossAmount.toLocaleString()}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                                <PercentIcon />
                                            </div>
                                            <div className="flex justify-between items-center relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-emerald-400 mb-0.5">
                                                        <Zap size={12} fill="currentColor" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Discount Applied</span>
                                                    </div>
                                                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Optimized Pricing (-{((discountAmount/grossAmount)*100).toFixed(0)}%)</p>
                                                </div>
                                                <span className="text-lg font-black text-emerald-500 tracking-tighter">- ${discountAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-8">
                                        <div className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 pl-1">Total Payable</div>
                                        <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-6">
                                            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-1.5">
                                                <ShieldCheck size={12} className="text-emerald-500" />
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Secure</span>
                                            </div>
                                            <div className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
                                                ${totalPrice.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10 mt-auto">
                                <button 
                                    onClick={onFinalize}
                                    disabled={processing}
                                    className="w-full bg-white text-slate-950 py-5 md:py-6 rounded-2xl font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>Complete Payment <ArrowRight size={18} strokeWidth={3} /></>
                                    )}
                                </button>
                                <div className="text-center">
                                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest animate-pulse italic">Connecting to secure gateway...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentGateway = ({ id, label, icon, status, selected, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`relative aspect-square w-full rounded-[1.5rem] md:rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-4 md:gap-6 transition-all group ${
            selected 
            ? 'bg-white border-blue-600 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.2)] scale-[1.03] z-10' 
            : 'bg-white/5 border-slate-100 hover:border-slate-200'
        } ${status ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
    >
        {status && (
            <div className="absolute top-2 md:top-4 bg-rose-50 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-rose-100 z-20 shadow-sm">
                <span className="text-[7px] md:text-[8px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap">{status}</span>
            </div>
        )}
        
        <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[2.5rem] flex items-center justify-center transition-all ${
            selected ? 'bg-blue-600 text-white shadow-xl rotate-2' : 'bg-slate-50 text-slate-300 group-hover:bg-white'
        }`}>
            {/* Fix: cast icon to any to allow size and className props which are not part of basic ReactElement attributes */}
            {React.cloneElement(icon as any, { size: 30, className: "md:w-[36px] md:h-[36px]", strokeWidth: 1.5 })}
        </div>
        
        <div className="flex flex-col items-center">
            <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest ${selected ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
            </span>
            {selected && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
            )}
        </div>
    </button>
);

const PercentIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
        <line x1="19" y1="5" x2="5" y2="19"></line>
        <circle cx="6.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
);

export default FinalPaymentView;

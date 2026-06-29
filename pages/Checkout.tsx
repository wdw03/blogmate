
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Layout, ShieldCheck, Zap, Database, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CartItemConfig from '../components/checkout/CartItemConfig';
import ConfigurationModal from '../components/checkout/ConfigurationModal';
import FinalPaymentView from '../components/payment/FinalPaymentView';
import ConfirmationSuccess from '../components/checkout/ConfirmationSuccess';
import { dispatchOrderEmails } from '../lib/emailService';

const Checkout: React.FC<{ items: any[]; niche: string; orderId?: string | null; onOrderSuccess?: () => void }> = ({ items = [], niche = 'General', orderId, onOrderSuccess }) => {
  const [step, setStep] = useState<'config' | 'payment'>(orderId ? 'payment' : 'config');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, any>>({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [confirmedPrice, setConfirmedPrice] = useState<number>(0);
  const [coupon, setCoupon] = useState('');
  const [appliedCouponData, setAppliedCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('PayPal');
  const [loadingOrder, setLoadingOrder] = useState(!!orderId);
  const [existingOrderData, setExistingOrderData] = useState<any>(null);

  const WRITER_FEE = 15;

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        setLoadingOrder(true);
        const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
        if (!error && data) {
          setExistingOrderData(data);
          setSelectedGateway(data.payment_method || 'PayPal');
          setConfirmedPrice(data.total_amount || data.total_price);
          setStep('payment');
        }
        setLoadingOrder(false);
      };
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if (items.length > 0 && !activeItem && !orderId) {
      setActiveItem(items[0].domain);
    }
  }, [items, orderId]);

  useEffect(() => {
    if (!orderId) {
        const initial: Record<string, any> = {};
        items.forEach(it => {
            initial[it.domain] = it.configuration || {
                contentType: 'provide',
                contentRequirements: { 
                    links: [{ anchorText: '', landingPageUrl: '' }],
                    topic: '',
                    htmlCode: '',
                    imagePath: '',
                    fileUrl: '',
                    specialInstructions: ''
                }
            };
        });
        setConfigs(initial);
    }
  }, [items, orderId]);

  const multiplier = niche === 'Casino' ? 3 : (niche === 'CBD' ? 1.5 : 1);

  const pricingData = useMemo(() => {
    if (existingOrderData) {
        return {
            baseAmount: existingOrderData.total_amount,
            totalFees: 0,
            subtotal: existingOrderData.total_amount,
            discount: 0,
            surcharge: existingOrderData.surcharge || 0,
            totalPrice: existingOrderData.total_amount
        };
    }

    const baseAmount = items.reduce((sum, it) => sum + ((it.price || 0) * multiplier), 0);
    const totalFees = items.reduce((sum, it) => {
        const config = configs[it.domain];
        return sum + (config?.contentType === 'hire' ? WRITER_FEE : 0);
    }, 0);
    
    const subtotal = baseAmount + totalFees;
    const discount = appliedCouponData ? (subtotal * (appliedCouponData.discount_percent / 100)) : 0;
    const surcharge = selectedGateway === 'Net30' ? (subtotal - discount) * 0.1 : 0;
    
    return {
        baseAmount,
        totalFees,
        subtotal,
        discount,
        surcharge,
        totalPrice: subtotal - discount + surcharge
    };
  }, [items, multiplier, configs, appliedCouponData, selectedGateway, existingOrderData]);

  const handleValidateCoupon = async () => {
    if (!coupon.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', coupon.toUpperCase().trim())
            .single();

        if (error || !data) throw new Error("Invalid voucher code.");
        if (!data.is_active) throw new Error("This voucher is inactive.");
        if (data.expires_at && new Date(data.expires_at) < new Date()) throw new Error("Voucher has expired.");
        if (data.usage_limit && data.times_used >= data.usage_limit) throw new Error("Usage limit reached.");

        setAppliedCouponData(data);
    } catch (err: any) {
        setCouponError(err.message);
        setAppliedCouponData(null);
    } finally {
        setIsValidatingCoupon(false);
    }
  };

  const handleUpdateConfig = async (domain: string, newConfig: any) => {
    setConfigs(prev => ({ ...prev, [domain]: newConfig }));
    const targetItem = items.find(i => i.domain === domain);
    if (targetItem?.db_id) {
        await supabase.from('cart').update({ configuration: newConfig }).eq('id', targetItem.db_id);
    }
  };

  const handleFinalSubmission = async () => {
    if (isFinalizing) return;
    
    setIsFinalizing(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { window.location.hash = '#/login'; return; }

        // Wallet Logic
        if (selectedGateway === 'Wallet') {
            const { data: prof } = await supabase.from('profiles').select('wallet_balance').eq('id', session.user.id).single();
            if (prof && prof.wallet_balance < pricingData.totalPrice) {
                throw new Error("Insufficient Wallet Balance. Please top up your node.");
            }
            // Deduct immediately for wallet
            const newBal = prof!.wallet_balance - pricingData.totalPrice;
            await supabase.from('profiles').update({ wallet_balance: newBal }).eq('id', session.user.id);
            
            // Log wallet transaction
            await supabase.from('wallet_transactions').insert({
                user_id: session.user.id,
                amount: pricingData.totalPrice,
                type: 'purchase',
                status: 'completed',
                metadata: { source: 'checkout_purchase' }
            });
        }

        let finalOrderId = orderId;
        let orderObj: any = existingOrderData;

        if (orderId) {
            await supabase.from('orders').update({ status: 'pending' }).eq('id', orderId);
        } else {
            const dueDate = new Date();
            if (selectedGateway === 'Net30') {
                dueDate.setDate(dueDate.getDate() + 30);
            }

            const manifestPayload = items.map(it => {
                const config = configs[it.domain] || {};
                const itemBasePrice = it.price * multiplier;
                const itemWriterFee = config.contentType === 'hire' ? WRITER_FEE : 0;
                
                return {
                    domain: it.domain,
                    niche: niche,
                    service_type: config.contentType === 'provide' ? 'Guest Post' : (config.contentType === 'hire' ? 'Guest Post + Writing' : 'Link Insertion'),
                    metrics: { da: it.da, dr: it.dr },
                    pricing_breakdown: {
                        base_usd: it.price,
                        niche_multiplier: multiplier,
                        niche_adjusted_price: itemBasePrice,
                        writer_fee: itemWriterFee,
                        final_item_price: itemBasePrice + itemWriterFee
                    },
                    configuration: config
                };
            });

            const finalSettlement = pricingData.totalPrice;

            const orderDataToInsert = {
                user_id: session.user.id,
                total_amount: finalSettlement, 
                total_price: finalSettlement,
                items: manifestPayload,
                status: 'pending',
                niche: niche,
                payment_method: selectedGateway,
                surcharge: pricingData.surcharge,
                due_date: selectedGateway === 'Net30' ? dueDate.toISOString() : null,
                metadata: {
                    timestamp: new Date().toISOString(),
                    coupon_code: appliedCouponData?.code || null,
                    discount_amount: pricingData.discount,
                    total_assets: items.length,
                    user_email: session.user.email 
                }
            };

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([orderDataToInsert])
                .select()
                .single();

            if (orderError) throw orderError;
            finalOrderId = orderData.id;
            orderObj = orderData;

            if (appliedCouponData) {
                await supabase.from('coupons').update({ times_used: (appliedCouponData.times_used || 0) + 1 }).eq('id', appliedCouponData.id);
            }

            await supabase.from('cart').delete().eq('user_id', session.user.id);
        }

        try {
            await dispatchOrderEmails(orderObj, session.user.user_metadata || { full_name: 'Operator', email: session.user.email });
        } catch (e) {
            console.warn("Email dispatch node latency/error:", e);
        }

        await supabase.from('messages').insert([{
            user_id: session.user.id,
            content: `Aapka Order #${finalOrderId?.slice(0,8).toUpperCase()} successfully submit ho gaya hai. Digital receipt aapki email par bhej di gayi hai.`,
            is_admin: true,
            metadata: { order_id: finalOrderId, type: 'order_confirmation' }
        }]);

        setConfirmedPrice(orderObj.total_amount || orderObj.total_price);
        setSuccessOrderId(finalOrderId);
        onOrderSuccess?.();

    } catch (err: any) {
        alert(`CRITICAL_ORDER_ERROR: ${err.message}`);
    } finally {
        setIsFinalizing(false);
    }
  };

  if (loadingOrder) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching Order Data...</span>
        </div>
    );
  }

  if (successOrderId) {
      return <ConfirmationSuccess orderId={successOrderId} totalPrice={confirmedPrice} />;
  }

  if (step === 'payment') {
    return (
      <FinalPaymentView 
        itemsCount={existingOrderData ? existingOrderData.items?.length : items.length}
        grossAmount={pricingData.subtotal}
        discountAmount={pricingData.discount}
        surcharge={pricingData.surcharge}
        totalPrice={pricingData.totalPrice}
        onBack={() => orderId ? (window.location.hash = '#/profile') : setStep('config')}
        onFinalize={handleFinalSubmission}
        processing={isFinalizing}
        coupon={coupon}
        setCoupon={setCoupon}
        onValidateCoupon={handleValidateCoupon}
        isValidatingCoupon={isValidatingCoupon}
        couponError={couponError}
        selectedGateway={selectedGateway}
        setSelectedGateway={setSelectedGateway}
      />
    );
  }

  if (items.length === 0 && !orderId) {
      return (
          <div className="min-h-screen pt-44 flex flex-col items-center justify-center bg-white">
              <Layout size={64} className="text-slate-200 mb-6" />
              <h2 className="text-xl font-black text-slate-400 uppercase italic">Your Cart is Empty</h2>
              <button onClick={() => window.location.hash = '#/domains'} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Browse Domains</button>
          </div>
      );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F8FAFC] font-['Inter'] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <header className="flex flex-col md:flex-row items-end justify-between gap-10 mb-16">
            <div className="animate-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-slate-950 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Checkout Step 1</span>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Session</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter italic leading-none drop-shadow-sm">Review Order.</h1>
            </div>
            
            <div className="bg-[#020617] p-2 rounded-[2.5rem] shadow-2xl flex items-center gap-12 group animate-in slide-in-from-right-4 duration-700">
                <div className="pl-10 pr-2 border-r border-white/5 py-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-1">Total Amount</span>
                    <div className="text-4xl font-black text-blue-400 tracking-tighter tabular-nums">${pricingData.totalPrice.toLocaleString()}</div>
                </div>
                <button 
                  onClick={() => setStep('payment')}
                  className="bg-blue-600 text-white px-14 py-8 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-white hover:text-slate-900 transition-all shadow-blue-500/20 active:scale-95 group/btn"
                >
                    Pay Now <ArrowRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <aside className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm transition-all hover:shadow-xl group">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Database size={18} className="text-blue-600" /> Selected Items ({items.length})
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {items.map((it) => {
                            const isActive = activeItem === it.domain;
                            const config = configs[it.domain] || {};
                            const isSynced = !!(config.contentRequirements?.fileUrl || config.contentRequirements?.topic || config.contentRequirements?.existingPostUrl);
                            
                            return (
                                <div 
                                    key={it.domain}
                                    onClick={() => setActiveItem(it.domain)}
                                    className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group/item relative overflow-hidden ${
                                        isActive 
                                        ? 'bg-[#020617] border-[#020617] shadow-2xl scale-[1.05] z-10' 
                                        : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 mb-5 relative z-10">
                                        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] animate-pulse' : 'bg-slate-300'}`}></div>
                                        <h4 className={`text-[15px] font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{it.domain}</h4>
                                    </div>
                                    <div className="flex items-end justify-between relative z-10">
                                        <div className={`text-xl font-black tabular-nums ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                            ${((it.price * multiplier) + (config.contentType === 'hire' ? WRITER_FEE : 0)).toLocaleString()}
                                        </div>
                                        <div className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-colors ${
                                            isActive 
                                              ? (isSynced ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-orange-500/20 border-orange-500/30 text-orange-400') 
                                              : (isSynced ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-100')
                                        }`}>
                                            {isSynced ? 'Synced' : 'Need Setup'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-[#020617] rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck size={20} className="text-blue-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Secure Protocol</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight mb-8">
                            Aapka data 256-bit encryption ke saath secure hai. Sabhi payments instant verify ki jati hain.
                        </p>
                    </div>
                </div>
            </aside>

            <main className="lg:col-span-8 animate-in fade-in zoom-in-95 duration-700">
                {activeItem ? (
                    <CartItemConfig 
                        listing={items.find(i => i.domain === activeItem) || {} as any} 
                        config={configs[activeItem]}
                        onSelectContentType={(type) => {
                            handleUpdateConfig(activeItem, { ...configs[activeItem], contentType: type });
                            setShowConfigModal(true);
                        }}
                        writerFee={WRITER_FEE}
                    />
                ) : (
                    <div className="h-96 bg-white border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm"><Database size={40} /></div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">Item Select Karein</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Left list se kisi website ko select karke uski detail bharain.</p>
                    </div>
                )}
            </main>
        </div>
      </div>

      {activeItem && (
        <ConfigurationModal 
            isOpen={showConfigModal}
            onClose={() => setShowConfigModal(false)}
            listing={items.find(i => i.domain === activeItem)}
            config={configs[activeItem || '']}
            onUpdateConfig={(newConf) => handleUpdateConfig(activeItem!, newConf)}
        />
      )}
    </div>
  );
};

export default Checkout;

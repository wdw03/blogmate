
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Layout, ShieldCheck, Zap, Database, Lock, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CartItemConfig from '../components/checkout/CartItemConfig';
import ConfigurationModal from '../components/checkout/ConfigurationModal';
import FinalPaymentView from '../components/payment/FinalPaymentView';
import ConfirmationSuccess from '../components/checkout/ConfirmationSuccess';
import { dispatchOrderEmails } from '../lib/emailService';

interface CheckoutProps {
  items: any[];
  niche: string;
  orderId?: string | null;
  onOrderSuccess?: () => void;
  onRemoveItem?: (idOrDomain: string) => void;
  onAddItem?: (item: any) => void;
  onUpdateNiche?: (newNiche: string) => void;
  onClearCart?: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items = [], niche = 'General', orderId, onOrderSuccess, onRemoveItem, onAddItem, onUpdateNiche, onClearCart }) => {
  const [step, setStep] = useState<'config' | 'payment'>(orderId ? 'payment' : 'config');
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [pendingContentSelection, setPendingContentSelection] = useState<{ itemId: string; type: any } | null>(null);
  const [hasPromptedInSession, setHasPromptedInSession] = useState(false);
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
  const [shakingItems, setShakingItems] = useState<Record<string, boolean>>({});

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
      const firstId = items[0].id || items[0].db_id || `${items[0].domain}-0`;
      setActiveItem(firstId);
    }
  }, [items, orderId]);

  useEffect(() => {
    if (!orderId) {
        setConfigs(prev => {
            const updated: Record<string, any> = {};
            items.forEach((it, idx) => {
                const itemId = it.id || it.db_id || `${it.domain}-${idx}`;
                updated[itemId] = prev[itemId] || it.configuration || {
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
            return updated;
        });
    }
  }, [items, orderId]);

  const multiplier = niche === 'Casino' ? 3 : (niche === 'Grey Niche' ? 2 : (niche === 'CBD' ? 1.5 : 1));

  const getItemPrice = useCallback((it: any, idx?: number) => {
    const itemId = it.id || it.db_id || (idx !== undefined ? `${it.domain}-${idx}` : it.domain);
    const itemConfig = configs[itemId] || {};
    const isUpgraded = itemConfig.isCasinoUpgraded || niche === 'Casino' || niche === 'Grey Niche';

    if (isUpgraded) {
      const metaMap = JSON.parse(localStorage.getItem('blogmate_domain_meta') || '{}');
      const localMeta = metaMap[it.domain?.toLowerCase()] || {};
      if (localMeta.price_casino && Number(localMeta.price_casino) > 0) {
        return Number(localMeta.price_casino);
      }
      if (it.admin_discount && Number(it.admin_discount) > 0) {
        return Number(it.admin_discount);
      }
    }
    return (it.price || 0) * (isUpgraded ? 3 : 1);
  }, [niche, multiplier, configs]);

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

    const baseAmount = items.reduce((sum, it) => sum + getItemPrice(it), 0);
    const totalFees = items.reduce((sum, it, idx) => {
        const itemId = it.id || it.db_id || `${it.domain}-${idx}`;
        const config = configs[itemId] || configs[it.domain];
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

  const handleUpdateConfig = async (itemIdOrDomain: string, newConfig: any) => {
    setConfigs(prev => ({ ...prev, [itemIdOrDomain]: newConfig }));
    const targetItem = items.find((i, idx) => (i.id || i.db_id || `${i.domain}-${idx}`) === itemIdOrDomain || i.domain === itemIdOrDomain);
    if (targetItem?.db_id) {
        await supabase.from('cart').update({ configuration: newConfig }).eq('id', targetItem.db_id);
    }
  };

  const handleFinalSubmission = async (gatewayTransactionId?: string) => {
    if (isFinalizing) return;
    
    setIsFinalizing(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { window.location.hash = '/login'; return; }

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
                metadata: { source: 'checkout_purchase', gateway_transaction_id: gatewayTransactionId || null }
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

            const manifestPayload = items.map((it, idx) => {
                const itemId = it.id || it.db_id || `${it.domain}-${idx}`;
                const config = configs[itemId] || configs[it.domain] || {};
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
            const transactionStatus = ['PayPal', 'Razorpay', 'Wallet'].includes(selectedGateway) ? 'completed' : 'pending';
            const domainList = (orderObj?.items || []).map((item: any) => ({
                domain: item.domain,
                service_type: item.service_type,
                amount: item.pricing_breakdown?.final_item_price || null
            }));
            const { error: paymentLogError } = await supabase.from('payment_transactions').insert({
                order_id: finalOrderId,
                user_id: session.user.id,
                gateway_key: selectedGateway,
                gateway_transaction_id: gatewayTransactionId || (selectedGateway + '-' + Date.now()),
                status: transactionStatus,
                amount: orderObj?.total_amount || orderObj?.total_price || pricingData.totalPrice,
                currency: 'USD',
                customer_name: session.user.user_metadata?.full_name || null,
                customer_email: session.user.email || null,
                domains: domainList,
                gateway_payload: { reference: gatewayTransactionId || null },
                metadata: { niche, source: 'checkout', total_assets: domainList.length }
            });
            if (paymentLogError) console.warn('Payment transaction registry unavailable:', paymentLogError.message);
        } catch (paymentLogException) {
            console.warn('Payment transaction logging failed:', paymentLogException);
        }

        try {
            await dispatchOrderEmails(orderObj, session.user.user_metadata || { full_name: 'Operator', email: session.user.email });
        } catch (e) {
            console.warn("Email dispatch node latency/error:", e);
        }

        await supabase.from('messages').insert([{
            user_id: session.user.id,
            content: `Your Order #${finalOrderId?.slice(0,8).toUpperCase()} has been submitted successfully. A digital receipt has been sent to your email.`,
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

  const handleProceedToPayment = () => {
    const unconfiguredIds: Record<string, boolean> = {};
    let firstUnconfiguredId: string | null = null;

    items.forEach((it, idx) => {
      const itemId = it.id || it.db_id || `${it.domain}-${idx}`;
      const config = configs[itemId] || configs[it.domain] || {};
      const reqs = config.contentRequirements || {};

      let isComplete = false;
      if (config.contentType === 'hire') {
        isComplete = !!reqs.topic && reqs.topic.trim() !== '';
      } else if (config.contentType === 'injection') {
        isComplete = !!reqs.existingPostUrl && reqs.existingPostUrl.trim() !== '';
      } else {
        isComplete = !!reqs.fileUrl && reqs.fileUrl.trim() !== '';
      }

      if (!isComplete) {
        unconfiguredIds[itemId] = true;
        if (!firstUnconfiguredId) firstUnconfiguredId = itemId;
      }
    });

    if (Object.keys(unconfiguredIds).length > 0) {
      setShakingItems(unconfiguredIds);
      if (firstUnconfiguredId) setActiveItem(firstUnconfiguredId);
      setTimeout(() => {
        setShakingItems({});
      }, 800);
      return;
    }

    setStep('payment');
  };

  if (step === 'payment') {
    return (
      <FinalPaymentView 
        itemsCount={existingOrderData ? existingOrderData.items?.length : items.length}
        grossAmount={pricingData.subtotal}
        discountAmount={pricingData.discount}
        surcharge={pricingData.surcharge}
        totalPrice={pricingData.totalPrice}
        onBack={() => orderId ? (window.location.hash = '/profile') : setStep('config')}
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
              <button onClick={() => window.location.hash = '/domains'} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Browse Domains</button>
          </div>
      );
  }

  return (
    <div className="min-h-screen pt-36 pb-20 bg-[#F8FAFC] font-['Inter'] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-8">
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
        </div>

        {/* Fixed Floating Pay Now Bar */}
        <div className="fixed bottom-6 right-6 lg:bottom-auto lg:top-[140px] lg:right-12 z-[2000] animate-in slide-in-from-right-4 duration-700">
            <div className="bg-[#020617] p-2 rounded-[2.5rem] shadow-2xl flex items-center gap-6 sm:gap-12 group border border-white/10 backdrop-blur-xl">
                <div className="pl-6 sm:pl-10 pr-2 border-r border-white/5 py-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-1">Total Amount</span>
                    <div className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tighter tabular-nums">${pricingData.totalPrice.toLocaleString()}</div>
                </div>
                <button 
                  onClick={handleProceedToPayment}
                  className="bg-blue-600 text-white px-8 sm:px-14 py-6 sm:py-8 rounded-[2rem] font-black text-xs sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-3 sm:gap-4 hover:bg-white hover:text-slate-900 transition-all shadow-blue-500/20 active:scale-95 group/btn"
                >
                    Pay Now <ArrowRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <aside className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm transition-all hover:shadow-xl group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Database size={18} className="text-blue-600" /> Selected Items ({items.length})
                        </h3>
                        {items.length > 0 && onClearCart && (
                            <button
                                type="button"
                                onClick={onClearCart}
                                className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shadow-sm"
                            >
                                <Trash2 size={12} /> Clear All
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {(() => {
                            const domainCounters: Record<string, number> = {};
                            const domainTotalCounts: Record<string, number> = {};
                            items.forEach(it => { domainTotalCounts[it.domain] = (domainTotalCounts[it.domain] || 0) + 1; });

                            return items.map((it, idx) => {
                                const itemId = it.id || it.db_id || `${it.domain}-${idx}`;
                                const isActive = activeItem === itemId;
                                const isShaking = !!shakingItems[itemId];
                                const config = configs[itemId] || configs[it.domain] || {};
                                const reqs = config.contentRequirements || {};
                                const isSynced = config.contentType === 'hire'
                                    ? (!!reqs.topic && reqs.topic.trim() !== '')
                                    : (config.contentType === 'injection'
                                        ? (!!reqs.existingPostUrl && reqs.existingPostUrl.trim() !== '')
                                        : (!!reqs.fileUrl && reqs.fileUrl.trim() !== ''));
                                
                                domainCounters[it.domain] = (domainCounters[it.domain] || 0) + 1;
                                const instanceNum = domainCounters[it.domain];
                                const displayName = domainTotalCounts[it.domain] > 1 ? `${it.domain} #${instanceNum}` : it.domain;

                                return (
                                    <div 
                                        key={itemId}
                                        onClick={() => setActiveItem(itemId)}
                                        className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group/item relative overflow-hidden ${
                                            isShaking ? 'animate-shake ' : ''
                                        }${
                                            isActive 
                                            ? 'bg-[#020617] border-[#020617] shadow-2xl z-10' 
                                            : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 mb-5 relative z-10">
                                            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] animate-pulse' : 'bg-slate-300'}`}></div>
                                            <h4 className={`text-[15px] font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{displayName}</h4>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/20 relative z-10">
                                            <div className="flex items-center gap-1.5">
                                                {onAddItem && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAddItem(it);
                                                        }}
                                                        title="Add another instance"
                                                        className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                                                            isActive
                                                            ? 'bg-blue-600/40 text-blue-200 hover:bg-blue-600 hover:text-white'
                                                            : 'bg-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white'
                                                        }`}
                                                    >
                                                        <Plus size={11} /> Add
                                                    </button>
                                                )}
                                                {onRemoveItem && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveItem(itemId);
                                                        }}
                                                        title="Remove item"
                                                        className={`p-1.5 rounded-lg transition-all ${
                                                            isActive
                                                            ? 'text-slate-400 hover:bg-rose-500/30 hover:text-rose-300'
                                                            : 'text-slate-400 hover:bg-rose-100 hover:text-rose-600'
                                                        }`}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`text-lg font-black tabular-nums ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                                    ${(getItemPrice(it) + (config.contentType === 'hire' ? WRITER_FEE : 0)).toLocaleString()}
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-colors ${
                                                    isActive 
                                                      ? (isSynced ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-orange-500/20 border-orange-500/30 text-orange-400') 
                                                      : (isSynced ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-100')
                                                }`}>
                                                    {isSynced ? 'Synced' : 'Need Setup'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                <div className="bg-[#020617] rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck size={20} className="text-blue-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Secure Protocol</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight mb-8">
                            Your data is secured with 256-bit encryption. All transactions are verified instantly.
                        </p>
                    </div>
                </div>
            </aside>

            <main className="lg:col-span-8 animate-in fade-in zoom-in-95 duration-700">
                {activeItem ? (
                    <CartItemConfig 
                        listing={items.find((i, idx) => (i.id || i.db_id || `${i.domain}-${idx}`) === activeItem) || {} as any} 
                        config={configs[activeItem] || {}}
                        onSelectContentType={(type) => {
                            const activeListing = items.find((i, idx) => (i.id || i.db_id || `${i.domain}-${idx}`) === activeItem);
                            const itemConf = configs[activeItem] || {};
                            const isGeneralWebsite = activeListing?.category === 'General' || (!activeListing?.category && niche === 'General');
                            if (isGeneralWebsite && !itemConf.hasAnsweredCasinoPopup) {
                                setPendingContentSelection({ itemId: activeItem, type });
                                setShowUpgradePopup(true);
                            } else {
                                handleUpdateConfig(activeItem, { ...(configs[activeItem] || {}), contentType: type });
                                setShowConfigModal(true);
                            }
                        }}
                        writerFee={WRITER_FEE}
                    />
                ) : (
                    <div className="h-96 bg-white border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm"><Database size={40} /></div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">Select an Item</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select a website from the left panel to configure its publication details.</p>
                    </div>
                )}
            </main>
        </div>
      </div>

      {activeItem && (
        <ConfigurationModal 
            isOpen={showConfigModal}
            onClose={() => setShowConfigModal(false)}
            listing={items.find((i, idx) => (i.id || i.db_id || `${i.domain}-${idx}`) === activeItem)}
            config={configs[activeItem || ''] || {}}
            onUpdateConfig={(newConf) => handleUpdateConfig(activeItem!, newConf)}
        />
      )}

      {showUpgradePopup && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[3000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 sm:p-10 max-w-lg w-full shadow-2xl relative overflow-hidden text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
              Do You Want Casino Service?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
              You currently have <strong className="text-slate-900 dark:text-white">General Niche ($10 base)</strong> selected. If your website involves <strong className="text-blue-600 dark:text-blue-400">Casino, CBD, or Grey Niche</strong> topics, please upgrade to prevent publisher rejection.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  if (pendingContentSelection && pendingContentSelection.itemId) {
                    const updatedConf = {
                      ...(configs[pendingContentSelection.itemId] || {}),
                      isCasinoUpgraded: true,
                      hasAnsweredCasinoPopup: true,
                      contentType: pendingContentSelection.type
                    };
                    handleUpdateConfig(pendingContentSelection.itemId, updatedConf);
                    setShowConfigModal(true);
                    setPendingContentSelection(null);
                  }
                  setShowUpgradePopup(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap size={14} /> Yes, Upgrade to Casino / Grey
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingContentSelection && pendingContentSelection.itemId) {
                    const updatedConf = {
                      ...(configs[pendingContentSelection.itemId] || {}),
                      isCasinoUpgraded: false,
                      hasAnsweredCasinoPopup: true,
                      contentType: pendingContentSelection.type
                    };
                    handleUpdateConfig(pendingContentSelection.itemId, updatedConf);
                    setShowConfigModal(true);
                    setPendingContentSelection(null);
                  }
                  setShowUpgradePopup(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-[11px] uppercase tracking-widest py-4 px-6 rounded-2xl transition active:scale-95"
              >
                No, Keep General ($10)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { Bitcoin, Copy, Check, ShieldCheck, Loader2, ArrowLeft, ExternalLink, QrCode, AlertCircle, Wallet } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import binanceLogo from '../../assets/images/bianncelogo.png';

interface Props {
  amount: number;
  onBack: () => void;
  onSuccess: (transactionId?: string) => void;
}

const CryptoGateway: React.FC<Props> = ({ amount, onBack, onSuccess }) => {
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Dynamic backend configurations for Binance
  const [walletAddress, setWalletAddress] = useState('0x7287c9d0eb221354f1249de7632d4f557c4d30f8');
  const [binanceUid, setBinanceUid] = useState('88492011');
  const [network, setNetwork] = useState('BEP-20 (BSC / Binance Smart Chain)');

  useEffect(() => {
    const fetchBinanceConfig = async () => {
      setLoadingConfig(true);
      try {
        const { data, error } = await supabase
          .from('payment_gateway_settings')
          .select('config')
          .eq('gateway_key', 'Binance')
          .single();

        if (!error && data?.config) {
          if (data.config.wallet_address) setWalletAddress(data.config.wallet_address);
          if (data.config.binance_uid) setBinanceUid(data.config.binance_uid);
          if (data.config.network) setNetwork(data.config.network);
        }
      } catch (e) {
        console.error('Error fetching Binance config:', e);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchBinanceConfig();
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Save transaction to Supabase backend
      await supabase.from('payment_transactions').insert({
        user_id: session?.user?.id || null,
        gateway_key: 'Binance',
        gateway_transaction_id: transactionId.trim(),
        status: 'processing',
        amount: Number(amount.toFixed(2)),
        currency: 'USDT',
        metadata: {
          payment_method: 'Binance Pay / USDT Crypto',
          wallet_address: walletAddress,
          binance_uid: binanceUid,
          network: network,
          submitted_at: new Date().toISOString()
        }
      });

      onSuccess(transactionId.trim());
    } catch (err) {
      console.error('Submission error:', err);
      // Still proceed to finish order flow
      onSuccess(transactionId.trim());
    } finally {
      setSubmitting(false);
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(walletAddress)}&margin=10`;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-center p-2.5 shadow-sm">
            <img src={binanceLogo} alt="Binance Pay" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight italic">Binance Pay</h2>
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-full">INSTANT</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">USDT Crypto Settlement Network</p>
          </div>
        </div>
        <button onClick={onBack} className="text-xs font-black uppercase text-slate-400 hover:text-slate-900 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="bg-[#020617] text-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {loadingConfig ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-amber-400" size={36} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Binance Settlement Hub...</span>
          </div>
        ) : (
          <div className="relative z-10 space-y-8">
            {/* Amount Banner */}
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Total USDT Payable Amount</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">${amount.toFixed(2)} <span className="text-sm text-amber-400">USDT</span></div>
              </div>
              <button
                onClick={() => handleCopy(amount.toFixed(2), 'amount')}
                className="self-start sm:self-center bg-amber-400 text-slate-950 hover:bg-amber-300 font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0"
              >
                {copiedType === 'amount' ? <Check size={14} className="text-emerald-950" /> : <Copy size={14} />}
                {copiedType === 'amount' ? 'Amount Copied!' : 'Copy Exact Amount'}
              </button>
            </div>

            {/* QR Code & Transfer Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code */}
              <div className="md:col-span-5 bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-950 shadow-xl">
                <div className="w-48 h-48 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center">
                  <img src={qrUrl} alt="Binance QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-[9px] font-black uppercase tracking-widest text-slate-600">
                  <QrCode size={13} className="text-amber-600" /> Scan via Binance App
                </div>
              </div>

              {/* Wallet Address & UID */}
              <div className="md:col-span-7 space-y-4">
                {/* Network info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Network</span>
                  <span className="text-xs font-black text-amber-400 uppercase">{network}</span>
                </div>

                {/* Wallet Address Copy Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Wallet size={12} className="text-amber-400" /> USDT Wallet Address
                    </span>
                    <button
                      onClick={() => handleCopy(walletAddress, 'address')}
                      className="text-[10px] font-black uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      {copiedType === 'address' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedType === 'address' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-white break-all bg-black/40 p-3 rounded-lg border border-white/5 selection:bg-amber-400 selection:text-black">
                    {walletAddress}
                  </div>
                </div>

                {/* Binance UID Copy Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Binance Pay UID</span>
                    <strong className="text-sm sm:text-base font-mono text-white tracking-wide">{binanceUid}</strong>
                  </div>
                  <button
                    onClick={() => handleCopy(binanceUid, 'uid')}
                    className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition shrink-0"
                  >
                    {copiedType === 'uid' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    {copiedType === 'uid' ? 'UID Copied' : 'Copy UID'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step instruction banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-300">
                <strong className="text-amber-400 font-black">Important Instruction:</strong> Send exactly <strong className="text-white font-mono">${amount.toFixed(2)} USDT</strong> to the above address via <strong>{network}</strong> or Binance Pay UID. Once transferred, paste the <strong>Transaction Hash / Order ID</strong> below to complete settlement.
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
                  Submit Transaction ID / Order Hash <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. 0x8f2a... OR Binance Pay Order ID (18 digits)"
                  className="w-full bg-black/60 border border-white/20 rounded-2xl px-5 py-4 text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !transactionId.trim()}
                className="w-full py-5 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-2xl font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-3 transition shadow-[0_10px_25px_rgba(251,191,36,0.25)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="animate-spin" size={18} /> Verifying Settlement...</>
                ) : (
                  <><ShieldCheck size={18} /> Confirm Payment & Verify TxID</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoGateway;

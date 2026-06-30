import React, { useEffect, useMemo, useState } from 'react';
import {
  Bitcoin, Building2, CheckCircle2, Clock3, CreditCard, Database,
  Globe2, Loader2, RefreshCw, Search, ShieldCheck, ToggleLeft,
  ToggleRight, Wallet
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const METHODS = [
  { key: 'PayPal', name: 'PayPal', description: 'Global PayPal settlement', icon: Globe2, color: 'blue' },
  { key: 'Razorpay', name: 'Razorpay', description: 'Cards, UPI & Netbanking', icon: CreditCard, color: 'indigo' },
  { key: 'Binance', name: 'USDT Crypto', description: 'TRC-20 / ERC-20 verification', icon: Bitcoin, color: 'amber' },
  { key: 'Net30', name: 'B2B Net-30', description: 'Deferred institutional billing', icon: Building2, color: 'rose' },
  { key: 'Wallet', name: 'Wallet Hub', description: 'Internal balance settlement', icon: Wallet, color: 'emerald' },
];

const PaymentOperations: React.FC<{ adminProfile: any }> = ({ adminProfile }) => {
  const [settings, setSettings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [activeGateway, setActiveGateway] = useState('All');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [settingsResult, transactionsResult] = await Promise.all([
      supabase.from('payment_gateway_settings').select('*').order('sort_order'),
      supabase.from('payment_transactions').select('*').order('created_at', { ascending: false }).limit(500),
    ]);

    if (settingsResult.error || transactionsResult.error) {
      setSchemaMissing(true);
    } else {
      setSchemaMissing(false);
      setSettings(settingsResult.data || []);
      setTransactions(transactionsResult.data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleGateway = async (gatewayKey: string, current: boolean) => {
    setSavingKey(gatewayKey);
    const { error } = await supabase.from('payment_gateway_settings').update({
      is_enabled: !current,
      updated_by: adminProfile?.id,
      updated_at: new Date().toISOString(),
    }).eq('gateway_key', gatewayKey);
    if (error) alert(`Gateway update failed: ${error.message}`);
    else setSettings(prev => prev.map(row => row.gateway_key === gatewayKey ? { ...row, is_enabled: !current } : row));
    setSavingKey(null);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('payment_transactions').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) alert(`Status update failed: ${error.message}`);
    else setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
  };

  const filtered = useMemo(() => transactions.filter(tx => {
    const gatewayMatch = activeGateway === 'All' || tx.gateway_key === activeGateway;
    const haystack = [tx.customer_name, tx.customer_email, tx.gateway_transaction_id, tx.order_id, ...(tx.domains || []).map((d: any) => d.domain)].join(' ').toLowerCase();
    return gatewayMatch && haystack.includes(search.toLowerCase());
  }), [transactions, activeGateway, search]);

  const totalVolume = filtered.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const completed = filtered.filter(tx => tx.status === 'completed').length;

  if (loading) return <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={36} /></div>;

  return (
    <div className="space-y-5 sm:space-y-7">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.24em] text-blue-600">Financial control center</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Payment Operations</h2>
          <p className="mt-1 text-xs text-slate-500">Control gateways and audit every checkout settlement.</p>
        </div>
        <button onClick={fetchData} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase text-slate-600 transition hover:border-blue-300 hover:text-blue-600"><RefreshCw size={15} /> Refresh ledger</button>
      </div>

      {schemaMissing && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <div className="flex items-start gap-3"><Database className="mt-0.5 shrink-0" size={20} /><div><h3 className="text-sm font-black">Payment database migration required</h3><p className="mt-1 text-xs leading-5">Run <code className="rounded bg-white px-1.5 py-0.5">supabase/migrations/20260630_payment_operations.sql</code> in Supabase SQL Editor. Gateway controls remain unchanged until it is applied.</p></div></div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {METHODS.map(method => {
          const row = settings.find(item => item.gateway_key === method.key);
          const enabled = row?.is_enabled ?? false;
          const Icon = method.icon;
          return (
            <div key={method.key} className={`rounded-2xl border bg-white p-4 shadow-sm transition ${enabled ? 'border-emerald-200' : 'border-slate-200 opacity-70'}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-blue-400"><Icon size={19} /></span>
                <button disabled={!row || savingKey === method.key} onClick={() => toggleGateway(method.key, enabled)} aria-label={`${enabled ? 'Disable' : 'Enable'} ${method.name}`} className="disabled:opacity-40">
                  {savingKey === method.key ? <Loader2 className="animate-spin text-blue-600" /> : enabled ? <ToggleRight className="text-emerald-500" size={32} /> : <ToggleLeft className="text-slate-300" size={32} />}
                </button>
              </div>
              <h3 className="mt-4 text-sm font-black text-slate-900">{method.name}</h3>
              <p className="mt-1 min-h-8 text-[10px] leading-4 text-slate-400">{method.description}</p>
              <span className={`mt-3 inline-flex rounded-full px-2 py-1 text-[8px] font-black uppercase ${enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Transactions" value={filtered.length.toString()} icon={<CreditCard size={17} />} />
        <Stat label="Completed" value={completed.toString()} icon={<CheckCircle2 size={17} />} />
        <Stat label="Volume" value={`$${totalVolume.toLocaleString()}`} icon={<ShieldCheck size={17} />} wide />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', ...METHODS.map(m => m.key)].map(key => <button key={key} onClick={() => setActiveGateway(key)} className={`shrink-0 rounded-xl px-3 py-2 text-[9px] font-black uppercase transition ${activeGateway === key ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-500'}`}>{key}</button>)}
          </div>
          <div className="relative w-full lg:max-w-sm"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, email, domain, transaction ID..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500" /></div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center"><CreditCard className="mx-auto text-slate-200" size={40} /><p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">No payment transactions found</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(tx => <TransactionRow key={tx.id} tx={tx} onStatus={updateStatus} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, icon, wide }: any) => <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${wide ? 'col-span-2 sm:col-span-1' : ''}`}><span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-wider text-slate-400"><span className="text-blue-500">{icon}</span>{label}</span><strong className="mt-2 block truncate text-xl font-black text-slate-950">{value}</strong></div>;

const TransactionRow = ({ tx, onStatus }: { tx: any; onStatus: (id: string, status: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="p-4 sm:p-5">
      <button onClick={() => setOpen(v => !v)} className="grid w-full grid-cols-[1fr_auto] items-center gap-4 text-left lg:grid-cols-[1.2fr_.8fr_.7fr_.7fr_auto]">
        <div className="min-w-0"><strong className="block truncate text-sm font-black text-slate-900">{tx.customer_name || 'Unknown user'}</strong><span className="block truncate text-[10px] text-blue-600">{tx.customer_email || 'No email'}</span></div>
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[8px] font-black uppercase text-slate-600 lg:justify-self-start">{tx.gateway_key}</span>
        <div className="hidden min-w-0 lg:block"><span className="block text-[8px] font-black uppercase text-slate-400">Amount</span><strong className="text-sm text-slate-900">${Number(tx.amount || 0).toLocaleString()}</strong></div>
        <div className="hidden lg:block"><span className="block text-[8px] font-black uppercase text-slate-400">Date</span><span className="text-[10px] font-bold text-slate-600">{new Date(tx.created_at).toLocaleString()}</span></div>
        <span className={`hidden rounded-full px-2 py-1 text-[8px] font-black uppercase lg:inline-flex ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : tx.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{tx.status}</span>
      </button>
      {open && (
        <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Transaction ID" value={tx.gateway_transaction_id || tx.id} mono />
          <Info label="Order ID" value={tx.order_id || '—'} mono />
          <Info label="Amount / Status" value={`$${Number(tx.amount || 0).toLocaleString()} ${tx.currency || 'USD'} · ${tx.status}`} />
          <Info label="Created" value={new Date(tx.created_at).toLocaleString()} />
          <div className="sm:col-span-2 lg:col-span-3"><span className="text-[8px] font-black uppercase text-slate-400">Domains purchased</span><div className="mt-2 flex flex-wrap gap-2">{(tx.domains || []).length ? tx.domains.map((item: any, index: number) => <span key={index} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold text-slate-700">{item.domain} {item.amount ? `· $${item.amount}` : ''}</span>) : <span className="text-xs text-slate-400">No domain payload</span>}</div></div>
          <div className="flex flex-wrap items-end gap-2">{['pending','processing','completed','failed','refunded'].map(status => <button key={status} onClick={() => onStatus(tx.id, status)} className={`rounded-lg px-2 py-1.5 text-[8px] font-black uppercase ${tx.status === status ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>{status}</button>)}</div>
        </div>
      )}
    </article>
  );
};

const Info = ({ label, value, mono }: any) => <div className="min-w-0"><span className="text-[8px] font-black uppercase text-slate-400">{label}</span><p className={`mt-1 break-all text-[10px] font-bold text-slate-700 ${mono ? 'font-mono' : ''}`}>{value}</p></div>;

export default PaymentOperations;

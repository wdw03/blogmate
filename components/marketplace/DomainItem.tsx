import React, { useState, useEffect } from 'react';
import {
  Activity, CheckCircle2, ChevronDown, Globe2, Heart, Plus,
  ShieldCheck, Sparkles, Tag, Timer, Users, Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DomainItemProps {
  domain: string;
  category: string;
  da: number;
  traffic: string;
  visits: string;
  tat: string;
  backlinks: string;
  prices: any;
  isNew?: boolean;
  isPinned?: boolean;
  metrics: any;
  niche?: string;
  onAddToCart?: (item: any) => void;
  isLoggedIn?: boolean;
}

const DomainItem: React.FC<DomainItemProps> = ({
  domain, category, da, traffic, tat, backlinks, prices, isNew, isPinned,
  metrics, niche = 'General', onAddToCart, isLoggedIn: propIsLoggedIn
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localLoggedIn, setLocalLoggedIn] = useState(false);

  useEffect(() => {
    if (propIsLoggedIn !== undefined) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLocalLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLocalLoggedIn(!!session);
    });
    return () => subscription?.unsubscribe();
  }, [propIsLoggedIn]);

  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : localLoggedIn;
  const multiplier = niche === 'Casino' ? 3 : (niche === 'Grey Niche' ? 2 : (niche === 'CBD' ? 1.5 : 1));

  const getPrice = (priceObj: any) => {
    if (!priceObj || priceObj.discounted === undefined) return { original: 0, discounted: 0, percent: 0, hasDiscount: false };
    const original = Math.round(priceObj.original * multiplier);
    const discounted = Math.round(priceObj.discounted * multiplier);
    return { original, discounted, percent: priceObj.percent, hasDiscount: original > discounted };
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.hash = '#/login'; return; }
    const price = getPrice(prices.guestPost).discounted;
    onAddToCart?.({ domain, category, da, dr: metrics.dr, price, serviceType: 'Guest Post' });
  };

  const details = [
    { label: 'Domain Rating', value: metrics.dr ?? '—', hint: 'Ahrefs', icon: <Activity size={14} /> },
    { label: 'Ref Sites', value: metrics.refDomains ?? '—', hint: 'Links', icon: <Globe2 size={14} /> },
    { label: 'Safety Score', value: metrics.authScore ?? '—', hint: 'Risk: Low', icon: <ShieldCheck size={14} /> },
    { label: 'Trust Flow', value: metrics.trustFlow ?? '—', hint: 'Majestic', icon: <CheckCircle2 size={14} /> },
    { label: 'Total Keywords', value: metrics.totalKeywords ?? '—', hint: 'Organic', icon: <Sparkles size={14} /> },
    { label: 'Spam Score', value: metrics.spamScore ?? '—', hint: 'Risk: Low', icon: <ShieldCheck size={14} /> },
    { label: 'Language', value: metrics.language || 'English', hint: 'Native', icon: <Globe2 size={14} /> },
    { label: 'Validity', value: 'Permanent', hint: 'Locked', icon: <Zap size={14} /> },
    { label: 'Citation', value: metrics.citationFlow ?? '—', hint: 'Majestic', icon: <Activity size={14} /> },
    { label: 'Category', value: category, hint: 'Sector', icon: <Tag size={14} /> },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <button onClick={() => window.location.hash = `#/domains/${domain}`} className="min-w-0 text-left">
              <span className="flex items-center gap-2 flex-wrap">
                <strong className="truncate text-base font-black text-slate-950 transition hover:text-blue-600 dark:text-white sm:text-lg">{domain}</strong>
                <CheckCircle2 size={15} className="shrink-0 text-blue-500" />
                {isNew && <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[7px] font-black uppercase text-white">New</span>}
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400"><Tag size={11} /> {category}</span>
            </button>
            <button aria-label="Save website" onClick={(e) => e.stopPropagation()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700"><Heart size={16} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Summary icon={<Activity size={14} />} label="Moz DA" value={da} />
            <Summary icon={<Users size={14} />} label="Visitors" value={traffic} />
            <Summary icon={<Timer size={14} />} label="Delivery" value={tat} />
            <Summary icon={<Zap size={14} />} label="Type" value={backlinks} />
          </div>

          {isLoggedIn && (
            <div className="grid grid-cols-3 gap-2">
              <Price label="Post Cost" price={getPrice(prices.guestPost)} />
              <Price label="Link Cost" price={getPrice(prices.insertion)} />
              <Price label="Mention" price={getPrice(prices.mention)} />
            </div>
          )}

          <div className="flex flex-col gap-2 min-[420px]:flex-row">
            <button onClick={handleAddToCart} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-blue-600 dark:bg-blue-600"><Plus size={16} strokeWidth={3} /> Add to cart</button>
            <button onClick={() => setIsExpanded(v => !v)} aria-expanded={isExpanded} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300">
              {isExpanded ? 'Hide details' : 'Complete details'}
              <ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="text-[9px] font-black uppercase tracking-[.2em] text-blue-600">Website intelligence</p><h3 className="mt-1 text-sm font-black text-slate-900 dark:text-white">Complete domain details</h3></div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[8px] font-black uppercase text-emerald-700">Risk: Low</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {details.map(detail => <Detail key={detail.label} {...detail} />)}
          </div>
        </div>
      )}
    </article>
  );
};

const Summary: React.FC<{ icon: React.ReactNode; label: string; value: any }> = ({ icon, label, value }) => (
  <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
    <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400"><span className="text-blue-500">{icon}</span>{label}</span>
    <strong className="mt-1.5 block truncate text-sm font-black text-slate-900 dark:text-white">{value}</strong>
  </div>
);

const Price: React.FC<{ label: string; price: { original: number; discounted: number; percent: number; hasDiscount: boolean } }> = ({ label, price }) => (
  <div className="min-w-0 rounded-xl bg-blue-50/70 p-2.5 text-center dark:bg-blue-500/5 sm:p-3">
    <span className="block truncate text-[7px] font-black uppercase tracking-wider text-slate-400 sm:text-[8px]">{label}</span>
    {price.hasDiscount && <span className="mt-1 block text-[8px] font-bold text-slate-400 line-through">${price.original}</span>}
    <strong className="mt-0.5 block text-sm font-black text-blue-600 sm:text-base">${price.discounted || '—'}</strong>
    {price.hasDiscount && <span className="text-[7px] font-black text-emerald-600">-{price.percent}%</span>}
  </div>
);

const Detail: React.FC<{ icon: React.ReactNode; label: string; value: any; hint?: string }> = ({ icon, label, value, hint }) => (
  <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
    <span className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-wider text-slate-400"><span className="text-blue-500">{icon}</span>{label}</span>
    <strong className="mt-2 block truncate text-sm font-black text-slate-900 dark:text-white">{value}</strong>
    <span className="mt-1 block text-[7px] font-black uppercase tracking-wider text-slate-400">{hint}</span>
  </div>
);

export default DomainItem;

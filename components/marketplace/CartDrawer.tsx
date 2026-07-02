
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShoppingBag, ShoppingCart, ShieldCheck, Plus, Minus } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  niche: string;
  onRemove: (id: string) => void;
  onRemoveAll?: (domain: string) => void;
  onAdd?: (item: any) => void;
  onClearCart?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, niche, onRemove, onRemoveAll, onAdd, onClearCart }) => {
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, { count: number; items: any[] }> = {};
    items.forEach(it => {
      if (!groups[it.domain]) {
        groups[it.domain] = { count: 0, items: [] };
      }
      groups[it.domain].count += 1;
      groups[it.domain].items.push(it);
    });
    return Object.values(groups);
  }, [items]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[2000]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-y-0 right-0 w-full max-w-md bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[2001] flex flex-col border-l border-slate-100 dark:border-slate-800" >
            
            <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">Your Cart ({items.length})</h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">{niche} Order</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && onClearCart && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    title="Remove all items from cart"
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Trash2 size={13} /> Clear Cart
                  </button>
                )}
                <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-2xl transition-all"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-8">
                    <ShoppingCart size={56} className="text-slate-200 dark:text-slate-800" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase">Cart is Empty</h3>
                    <button onClick={onClose} className="bg-slate-950 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl dark:shadow-blue-500/20 hover:-translate-y-1 transition-all">Explore Sites</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {groupedItems.map((group) => {
                    const firstItem = group.items[0];
                    return (
                      <div key={firstItem.domain} className="bg-white/50 dark:bg-slate-900/50 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-950 flex items-center justify-center font-black text-blue-400 text-lg shadow-lg">{firstItem.domain[0].toUpperCase()}</div>
                                <div className="min-w-0">
                                    <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight uppercase truncate">{firstItem.domain}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{firstItem.serviceType}</p>
                                </div>
                            </div>
                            <button onClick={() => onRemoveAll ? onRemoveAll(firstItem.domain) : onRemove(firstItem.domain)} title="Remove all instances" className="text-slate-300 dark:text-slate-600 hover:text-rose-500 p-2 shrink-0"><Trash2 size={18} /></button>
                         </div>
                         <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                              <button 
                                onClick={() => {
                                  const itemToRemove = group.items[group.items.length - 1];
                                  onRemove(itemToRemove.id || itemToRemove.domain);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-rose-500 hover:text-white transition-all font-black"
                                title="Remove one"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="px-2.5 text-xs font-black text-slate-900 dark:text-white tabular-nums">{group.count}</span>
                              <button 
                                onClick={() => onAdd && onAdd(firstItem)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-blue-600 hover:text-white transition-all font-black"
                                title="Add another"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-slate-900 dark:text-white text-xl">${((firstItem.price || 0) * group.count).toFixed(0)}</div>
                              {group.count > 1 && <span className="text-[8px] font-bold text-slate-400 block">${firstItem.price} each</span>}
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-2xl">
                <div className="flex justify-between mb-8">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Bill</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${totalPrice.toFixed(0)}</span>
                </div>
                <button onClick={() => { onClose(); window.location.hash = '#/checkout'; }} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl">Complete Order <ArrowRight size={18} /></button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

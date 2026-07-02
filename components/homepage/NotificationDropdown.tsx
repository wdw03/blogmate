
import React, { useEffect, useState } from 'react';
import { Bell, CreditCard, CheckCircle, Info, X, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  userId?: string;
  onClose: () => void;
}

const NotificationDropdown: React.FC<Props> = ({ userId, onClose }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchMessages();
  }, [userId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    setMessages(data || []);
    setLoading(false);
  };

  const handlePayNow = (orderId: string) => {
    onClose();
    // Use order_id parameter to load existing order in checkout
    window.location.hash = `/checkout?order_id=${orderId}`;
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-[380px] bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden animate-in slide-in-from-top-4 duration-300 z-[3000]">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Bell size={16} />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
        </div>
        <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={16}/></button>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="py-10 text-center"><Loader2 size={24} className="animate-spin text-blue-500 mx-auto" /></div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center">
            <Info size={32} className="text-slate-100 mx-auto mb-3" />
            <p className="text-[10px] font-black text-slate-400 uppercase">No new messages</p>
          </div>
        ) : (
          messages.map((m) => {
            const isPayment = m.metadata?.type === 'payment_reminder' || m.content?.toLowerCase().includes('payment');
            return (
              <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-500/20 hover:shadow-md transition-all group">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPayment ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                    {isPayment ? <Zap size={18} /> : <CheckCircle size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        {isPayment ? 'Payment Due' : 'Status Update'}
                      </h4>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tight opacity-80">{m.content}</p>
                    
                    {isPayment && m.metadata?.order_id && (
                      <button 
                        onClick={() => handlePayNow(m.metadata.order_id)}
                        className="mt-3 w-full py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard size={12} /> Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <button onClick={() => window.location.hash = '/profile'} className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">View All Alerts</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;

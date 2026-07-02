
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Loader2, Bot, CheckCheck, User, Zap, Sparkles, Plus, Image as ImageIcon, Smile, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load & Auth Listeners
  useEffect(() => {
    const init = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      if (initialSession?.user) fetchHistory(initialSession.user.id);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchHistory(newSession.user.id);
      } else {
        setMessages([]);
      }
    });

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpen);

    return () => {
      window.removeEventListener('open-chat', handleOpen);
      subscription.unsubscribe();
    };
  }, []);

  // 2. Optimized Real-time Subscription with Duplicate Prevention
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase.channel(`ios-chat-v3-${session.user.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `user_id=eq.${session.user.id}`
      }, (payload) => {
        const newMessage: ChatMessage = {
          id: payload.new.id,
          content: payload.new.content,
          isAdmin: payload.new.is_admin,
          timestamp: new Date(payload.new.created_at)
        };
        
        setMessages(prev => {
          // Prevent showing the same message twice if ID matches
          if (prev.some(m => m.id === newMessage.id)) return prev;
          
          // Duplicate Prevention Logic: 
          // If we receive a REAL message that matches our OPTIMISTIC (temp) message content,
          // remove the temp one and replace it with the real one.
          const filtered = prev.filter(m => {
            const isOptimistic = m.id.toString().startsWith('temp-');
            const sameContent = m.content === newMessage.content;
            return !(isOptimistic && sameContent);
          });
          
          return [...filtered, newMessage];
        });
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          console.error("Supabase Realtime Error:", err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      window.dispatchEvent(new CustomEvent('chat-state-change', { detail: { isOpen: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('chat-state-change', { detail: { isOpen: false } }));
    }
  }, [isOpen, messages]);

  const fetchHistory = async (userId: string, retries = 2) => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (fetchErr) throw fetchErr;
      
      if (data) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          content: String(m.content),
          isAdmin: m.is_admin,
          timestamp: new Date(m.created_at)
        })));
      }
      setError(null);
    } catch (err: any) {
      console.error("Chat History Error:", err.message);
      
      if (retries > 0) {
        console.log(`Retrying fetch... (${retries} left)`);
        setTimeout(() => fetchHistory(userId, retries - 1), 1500);
        return;
      }

      if (err.message.includes('Failed to fetch')) {
        setError("Network Error: Connection to database failed. Please check your internet or Supabase status.");
      } else {
        setError(`History Error: ${err.message}`);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isSending) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Session Lost. Please login.");
      return;
    }

    setIsSending(true);
    setError(null);
    setInputValue('');

    // --- Optimistic Update (shows message immediately) ---
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
        id: tempId,
        content: text,
        isAdmin: false,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { error: sendError } = await supabase
        .from('messages')
        .insert({ 
          user_id: user.id, 
          content: text, 
          is_admin: false 
        });

      if (sendError) throw sendError;
    } catch (err: any) {
      console.error("CHAT_SEND_ERROR:", err);
      // Remove failed message from UI
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setError(`Database Error: ${err.message}`);
      setInputValue(text); 
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="blogmet-chat-widget" data-open={isOpen} className="relative z-[3000]">
      <motion.button 
        onClick={() => setIsOpen(true)} 
        initial={{ scale: 0 }} 
        animate={{ scale: isOpen ? 0 : 1 }} 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white/40 text-blue-600 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageSquare size={28} fill="currentColor" className="relative z-10" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-xl z-[2999] cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(20px)' }} 
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} 
              exit={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(20px)' }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-8 right-8 w-[480px] h-[780px] bg-white/60 backdrop-blur-[50px] rounded-[3.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-white/50 ring-1 ring-black/5 z-[3000]"
            >
               {/* Header */}
               <div className="pt-10 px-10 pb-6 bg-gradient-to-b from-white/60 to-transparent relative shrink-0">
                  <div className="flex justify-between items-center relative z-10">
                     <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-2xl relative">
                          <ShieldCheck size={32} />
                          <motion.div 
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                           <h3 className="font-black text-xl tracking-tight text-slate-900 leading-tight">Hub Support</h3>
                           <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Terminal Syncing</span>
                           </div>
                        </div>
                     </div>
                     <button 
                      onClick={() => setIsOpen(false)} 
                      className="w-12 h-12 bg-white/40 hover:bg-white/80 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-white/40"
                     >
                        <X size={22} className="text-slate-600" />
                     </button>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar bg-white/5">
                  {!session ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                      <Bot size={56} className="text-blue-500 mb-6 opacity-20" />
                      <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Auth Gateway Only</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4 leading-relaxed">Sign in to initialize secure support protocols.</p>
                      <button onClick={() => window.location.hash = '/login'} className="mt-10 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all">Connect Hub</button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                       <Zap size={40} className="text-slate-300 mb-4 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Connection Ready</span>
                    </div>
                  ) : (
                    messages.map((m) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 15, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          key={m.id} 
                          className={`flex flex-col ${m.isAdmin ? 'items-start' : 'items-end'}`}
                        >
                            <span className={`text-[9px] font-black uppercase tracking-wider mb-1 px-2 ${m.isAdmin ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {m.isAdmin ? 'SUPPORT TEAM' : 'YOU'}
                            </span>
                            <div className={`max-w-[85%] relative group ${m.isAdmin ? 'pl-1' : 'pr-1'}`}>
                                <div className={`p-5 text-[15px] leading-relaxed shadow-lg transition-all text-left ${
                                    m.isAdmin 
                                    ? 'bg-white/95 backdrop-blur-2xl text-slate-800 rounded-[2rem] rounded-tl-sm border border-white shadow-slate-200/50' 
                                    : 'bg-blue-600 text-white rounded-[2rem] rounded-tr-sm shadow-blue-600/20'
                                }`}>
                                    {m.content}
                                </div>
                                <div className={`mt-1.5 flex items-center gap-1.5 opacity-60 transition-opacity ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    {!m.isAdmin && <CheckCheck size={12} className={m.id.toString().startsWith('temp-') ? 'text-slate-400' : 'text-emerald-400'} />}
                                </div>
                            </div>
                        </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
               </div>

               {/* Error Toast */}
               <AnimatePresence>
                 {error && (
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mx-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-2 text-rose-600 shadow-xl shadow-rose-500/5"
                   >
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
                       <AlertCircle size={14} /> {error.includes('Network') ? 'Network Connection Error' : 'Database Protocol Error'}
                     </div>
                     <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter leading-tight">{error}</p>
                     
                     {error.includes('Network Error') && (
                       <div className="pt-2 border-t border-rose-100/50">
                         <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">Troubleshooting:</p>
                         <ul className="text-[8px] font-bold text-rose-400 uppercase space-y-1 list-disc pl-3">
                           <li>Check if Supabase project is active</li>
                           <li>Verify CORS settings for this domain</li>
                           <li>Check your internet connection</li>
                         </ul>
                       </div>
                     )}

                     <button 
                       onClick={() => session?.user?.id && fetchHistory(session.user.id)}
                       className="mt-1 flex items-center justify-center gap-2 py-2 bg-white border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 transition-all"
                     >
                       <RefreshCcw size={10} /> Re-Initialize Connection
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Input Footer */}
               <div className="p-8 bg-gradient-to-t from-white/60 to-transparent shrink-0">
                  {session && (
                    <div className="flex flex-col gap-6">
                      <form onSubmit={handleSendMessage} className="relative group">
                         <div className="absolute inset-0 bg-white/40 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
                         <div className="relative flex items-center bg-white/90 backdrop-blur-3xl border border-white rounded-full p-2 pr-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus-within:shadow-xl focus-within:scale-[1.01] transition-all">
                            <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-blue-500 transition-all hover:bg-blue-50 shrink-0">
                               <Plus size={24} />
                            </button>
                            <input 
                              value={inputValue} 
                              onChange={e=>setInputValue(e.target.value)} 
                              placeholder="Message Hub..." 
                              disabled={isSending}
                              className="flex-1 bg-transparent py-4 px-2 text-[15px] font-bold text-slate-950 outline-none placeholder:text-slate-300 disabled:opacity-50" 
                            />
                            <button 
                              type="submit" 
                              disabled={!inputValue.trim() || isSending} 
                              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 shrink-0 ${
                                !inputValue.trim() ? 'bg-slate-50 text-slate-300' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30'
                              }`}
                            >
                               {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={20} fill="currentColor" className="ml-0.5" />}
                            </button>
                         </div>
                      </form>
                      
                      <div className="flex items-center justify-around px-4">
                         <ActionIcon icon={<ImageIcon size={20} />} label="Node Files" />
                         <ActionIcon icon={<Smile size={20} />} label="React" />
                         <ActionIcon icon={<Zap size={20} />} label="Macros" />
                         <div className="w-px h-5 bg-slate-100"></div>
                         <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">Security</span>
                            <span className="text-[9px] font-black text-slate-300 uppercase leading-none mt-1">AES-256 GCM</span>
                         </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex items-center justify-center gap-3 opacity-20 hover:opacity-40 transition-opacity group cursor-default">
                      <ShieldCheck size={12} className="text-slate-900" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] group-hover:text-blue-600 transition-colors">Proprietary iOS Terminal Engine</span>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.15); }
      `}} />
    </div>
  );
};

const ActionIcon = ({ icon, label }: any) => (
    <button className="flex flex-col items-center gap-1.5 group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
            {icon}
        </div>
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{label}</span>
    </button>
);

export default ChatWidget;

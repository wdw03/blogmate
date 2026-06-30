
import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, User, Send, Bot, ShieldCheck, Loader2, 
    MoreVertical, CheckCheck, Clock, Zap, MessageSquare,
    Filter, Radio, Activity, ExternalLink, ArrowRight, RefreshCcw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChatHubProps {
    adminProfile: any;
}

const ChatHub: React.FC<ChatHubProps> = ({ adminProfile }) => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const scrollRef = useRef<HTMLDivElement>(null);

    const isSuperAdmin = adminProfile?.role === 'superadmin';

    // Ultra Strict Privacy Masking
    const maskEmail = (email: string) => {
        if (!email || isSuperAdmin) return email;
        return '[ACCESS_RESTRICTED]';
    };

    const maskName = (name: string, id: string) => {
        if (isSuperAdmin || name === 'GUEST USER') return name;
        // Completely anonymous for normal admins
        return `NODE_${id.slice(-4).toUpperCase()}`;
    };

    const fetchConversations = async () => {
        try {
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .order('created_at', { ascending: false });

            if (usersError) throw usersError;

            const enriched = usersData?.map(u => ({
                ...u,
                lastMsg: 'Active Session',
                time: 'Just now',
                online: true
            })) || [];

            setConversations(enriched);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!selectedUserId) return;

        const loadMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', selectedUserId)
                .order('created_at', { ascending: true });
            setMessages(data || []);
            scrollToBottom();
        };

        loadMessages();

        const channel = supabase.channel(`admin-chat-sync-${selectedUserId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `user_id=eq.${selectedUserId}`
            }, (payload) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
                scrollToBottom();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [selectedUserId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSending || !selectedUserId) return;
        
        setIsSending(true);
        const text = inputValue;
        setInputValue('');

        try {
            const { error } = await supabase.from('messages').insert({
                user_id: selectedUserId,
                content: text,
                is_admin: true
            });

            if (error) throw error;
        } catch (err: any) {
            alert("ADMIN_TRANSMISSION_FAILED: " + err.message);
            setInputValue(text);
        } finally {
            setIsSending(false);
            scrollToBottom();
        }
    };

    const selectedUser = conversations.find(c => c.id === selectedUserId);

    return (
        <div className="flex flex-col md:flex-row min-h-[620px] md:h-full bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-700">
            <aside className="w-full max-h-72 md:max-h-none md:w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
                <header className="p-4 sm:p-6 md:p-8 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Support Hub</h3>
                        <button onClick={fetchConversations} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><RefreshCcw size={16} /></button>
                    </div>
                    <div className="relative group">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" />
                        <input 
                            type="text" 
                            placeholder="Filter Nodes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
                    ) : conversations.filter(c => (isSuperAdmin ? c.full_name : `NODE_${c.id.slice(-4).toUpperCase()}`).toLowerCase().includes(searchTerm.toLowerCase())).map((conv) => (
                        <button 
                            key={conv.id}
                            onClick={() => setSelectedUserId(conv.id)}
                            className={`w-full p-4 sm:p-6 flex items-start gap-4 transition-all border-b border-slate-50 group hover:bg-white ${selectedUserId === conv.id ? 'bg-white' : ''}`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-slate-100 transition-all ${selectedUserId === conv.id ? 'bg-blue-600 text-white shadow-blue-500/20 rotate-3' : 'bg-white text-slate-400 group-hover:bg-slate-50'}`}>
                                    {isSuperAdmin ? (conv.full_name?.[0] || 'U') : 'N'}
                                </div>
                                {conv.online && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-4 border-slate-50 animate-pulse"></div>}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-black text-[13px] text-slate-900 uppercase tracking-tight truncate">{maskName(conv.full_name, conv.id)}</h4>
                                    <span className="text-[8px] font-bold text-slate-300 uppercase shrink-0">{conv.time}</span>
                                </div>
                                <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-widest">{conv.lastMsg}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
                {selectedUserId ? (
                    <>
                        <header className="px-4 py-4 sm:px-6 md:px-10 md:py-6 bg-white border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 shadow-xl border border-white/10">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{maskName(selectedUser?.full_name, selectedUserId)}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{maskEmail(selectedUser?.email)}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><MoreVertical size={18}/></button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-8 custom-scrollbar bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-90">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.is_admin ? 'justify-end' : 'justify-start'} animate-in fade-up duration-500`}>
                                    <div className={`max-w-[88%] sm:max-w-[78%] md:max-w-[70%] flex gap-4 ${m.is_admin ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`p-5 rounded-[1.75rem] text-[13px] font-medium leading-relaxed shadow-sm ${
                                            m.is_admin 
                                            ? 'bg-slate-900 text-white rounded-tr-none border border-white/5' 
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                        }`}>
                                            {m.content}
                                            <div className={`mt-2 flex items-center gap-1.5 text-[8px] font-black uppercase opacity-40 ${m.is_admin ? 'justify-end' : 'justify-start'}`}>
                                                {new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                {m.is_admin && <CheckCheck size={10} className="text-blue-400" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        <footer className="p-3 sm:p-5 md:p-8 bg-white border-t border-slate-100">
                            <form onSubmit={handleSend} className="flex gap-4 items-center bg-slate-50 border border-slate-200 rounded-[2rem] p-2 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-xl transition-all">
                                <input 
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    placeholder="Deploy Response Protocol..."
                                    className="flex-1 bg-transparent px-6 py-3.5 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                />
                                <button 
                                    disabled={!inputValue.trim() || isSending}
                                    className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-30 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                                >
                                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={22} fill="currentColor" />}
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-40">
                        <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 shadow-inner">
                            <MessageSquare size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Support_Idle</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4">Select an active node to initialize secure sync</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChatHub;

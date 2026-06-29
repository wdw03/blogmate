
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Tag, ArrowRight, CheckCircle2, Clock, DollarSign, Sparkles, MessageCircle, Percent, Zap } from 'lucide-react';
import { Listing, ChatMessage } from '../../types';

interface CartItemNegotiationProps {
    listing: Listing;
    onApplyDiscount: (discount: number) => void;
    currentDiscount: number;
    niche?: 'General' | 'CBD' | 'Casino';
}

const CartItemNegotiation: React.FC<CartItemNegotiationProps> = ({ listing, onApplyDiscount, currentDiscount, niche }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { 
            id: '1', 
            content: `Hi there! I'm the automated sales agent for **${listing.domain}**. I can help you with pricing or delivery terms. What's on your mind?`, 
            isAdmin: true, 
            timestamp: new Date() 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pendingOffer, setPendingOffer] = useState<number | null>(null);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            content: text,
            isAdmin: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            let botResponse = "I'll forward that request to the publisher.";
            let discountOffer = 0;

            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('discount') || lowerText.includes('price') || lowerText.includes('lower')) {
                if (currentDiscount > 0) {
                    botResponse = "We have already applied the maximum available discount for this domain.";
                } else {
                    botResponse = "Good news! I checked the publisher's rules. I can authorize a **10% discount** on your order if you checkout now.";
                    discountOffer = 10;
                }
            } else if (lowerText.includes('fast') || lowerText.includes('tat') || lowerText.includes('time')) {
                botResponse = "Standard TAT is 3 days. However, for this price, we can mark your order as **Priority** for 24-hour delivery.";
            } else {
                botResponse = "I understand. I've noted that for the order instructions.";
            }

            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: botResponse,
                isAdmin: true,
                timestamp: new Date(),
                isOffer: discountOffer > 0
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);

            if (discountOffer > 0) {
                setPendingOffer(discountOffer);
            }

        }, 1200);
    };

    const handleAcceptOffer = (discount: number) => {
        onApplyDiscount(discount);
        setPendingOffer(null);
        
        const confirmationMsg: ChatMessage = {
            id: 'conf-' + Date.now(),
            content: `Excellent! I've successfully applied the **${discount}% discount** to your cart for **${listing.domain}**. You'll see the updated total in your order summary.`,
            isAdmin: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmationMsg]);
    };

    const handleOpenHumanChat = () => {
        window.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <div className="flex flex-col h-[500px] w-full bg-slate-50 relative rounded-3xl overflow-hidden border border-slate-200">
            <div className="absolute top-0 left-0 right-0 z-20 bg-indigo-50 border-b border-indigo-100 p-2 flex justify-center">
                <button 
                    onClick={handleOpenHumanChat}
                    className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                >
                    <MessageCircle size={12} /> Talk to Human Agent instead
                </button>
            </div>

            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-6 pt-10 space-y-6 custom-scrollbar scroll-smooth"
                style={{ paddingBottom: '140px' }}
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                        {msg.isAdmin && (
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                <Bot size={16} />
                            </div>
                        )}
                        
                        <div className={`max-w-[85%] flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
                            {msg.isAdmin && <span className="text-[10px] font-bold text-slate-400 ml-1 mb-1">Bot Agent</span>}
                            
                            <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm relative group ${
                                msg.isAdmin 
                                ? (msg.isOffer ? 'bg-indigo-600 text-white rounded-2xl rounded-tl-none ring-4 ring-indigo-500/10' : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none') 
                                : 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                            }`}>
                                {msg.isOffer && (
                                    <div className="flex items-center gap-2 mb-2 text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <Zap size={12} fill="currentColor" className="text-yellow-400" /> Special Deal Unlocked
                                    </div>
                                )}

                                <div className="font-medium">
                                    {msg.content.split('**').map((part, i) => 
                                        i % 2 === 1 ? <strong key={i} className={msg.isAdmin && !msg.isOffer ? "text-slate-900" : "text-white"}>{part}</strong> : part
                                    )}
                                </div>
                                
                                {msg.isOffer && pendingOffer && (
                                    <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-indigo-900 shadow-lg">
                                                    <Percent size={18} strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold opacity-80 uppercase leading-none mb-0.5">Discount</div>
                                                    <div className="text-lg font-black leading-none">{pendingOffer}% OFF</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleAcceptOffer(pendingOffer)}
                                                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                                            >
                                                Claim Discount
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!pendingOffer && msg.isOffer && (
                                    <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-indigo-100 font-bold text-xs italic">
                                        <CheckCircle2 size={14} className="text-white" /> Offer claimed!
                                    </div>
                                )}
                            </div>
                            <span className="text-[9px] text-slate-300 mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4">
                <div className="relative flex items-center gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Negotiate terms..."
                        className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItemNegotiation;

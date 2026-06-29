
import React, { useState, useEffect } from 'react';
import Header from './components/homepage/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import Marketplace from './pages/Marketplace';
import DomainDetail from './pages/DomainDetail';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Profile from './auth/Profile';
import AdminPanel from './admin/AdminPanel';
import CartDrawer from './components/marketplace/CartDrawer';
import ChatWidget from './components/ChatWidget';
import Toast from './components/ui/Toast';
import { supabase } from './lib/supabase';
import { sendEmailDirect } from './lib/emailService';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [niche, setNiche] = useState('General');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', title: '' });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- EMAIL BACKGROUND WORKER (Point-to-Point Node) ---
  useEffect(() => {
    const runEmailWorker = async () => {
      // Worker only runs if an operator is online to act as a bridge
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) return;

      const { data: prof } = await supabase.from('profiles').select('role').eq('id', currentSession.user.id).single();
      if (!prof || (prof.role !== 'admin' && prof.role !== 'superadmin')) return;

      // Scan for pending transmissions
      const { data: pending, error } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .limit(3);

      if (error || !pending || pending.length === 0) return;

      for (const email of pending) {
        if (!email.recipient) {
          await supabase.from('email_queue').update({ status: 'error', error_log: 'Recipient address is empty' }).eq('id', email.id);
          continue;
        }
        const result = await sendEmailDirect(email.recipient, email.subject, email.html_content);
        if (result.success) {
          await supabase.from('email_queue').update({ status: 'sent' }).eq('id', email.id);
        } else {
          // If Failed to fetch happens here, we keep it as pending to try again later
          if (result.error !== 'Failed to fetch') {
            await supabase.from('email_queue').update({ status: 'error', error_log: result.error }).eq('id', email.id);
          }
        }
      }
    };

    const interval = setInterval(runEmailWorker, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCart = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('cart').select('*').eq('user_id', userId);
      if (!error && data) {
        setCartItems(data.map(item => ({
          db_id: item.id,
          domain: item.domain_name,
          price: item.price,
          category: item.category,
          da: item.da,
          dr: item.dr,
          serviceType: item.configuration?.serviceType || 'Guest Post',
          configuration: item.configuration || {
            contentType: 'provide',
            contentRequirements: { links: [{ anchorText: '', landingPageUrl: '' }] }
          }
        })));
      }
    } catch (e) {
      console.warn("Cart node sync failed.");
    }
  };

  useEffect(() => {
    const fallbackTimer = setTimeout(() => setIsInitializing(false), 3000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchCart(session.user.id);
        setupRealtimeListener(session.user.id);
      }
      setIsInitializing(false);
      clearTimeout(fallbackTimer);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' && session?.user) {
        fetchCart(session.user.id);
        setupRealtimeListener(session.user.id);
      }
      else if (event === 'SIGNED_OUT') setCartItems([]);
    });

    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('chat-state-change', ((e: CustomEvent) => setIsChatOpen(e.detail.isOpen)) as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('chat-state-change', ((e: CustomEvent) => setIsChatOpen(e.detail.isOpen)) as EventListener);
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const setupRealtimeListener = (userId: string) => {
    const channelName = `user-messages-${userId}`;

    // Remove existing channel to prevent the "cannot add callbacks after subscribe" error
    const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channel = supabase.channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${userId}`
      }, (payload: any) => {
        if (payload.new.is_admin) {
          const chatWidgetElement = document.getElementById('domintel-chat-widget');
          const isWidgetOpen = chatWidgetElement?.getAttribute('data-open') === 'true';

          if (!isWidgetOpen) {
            setToast({
              show: true,
              title: "Security Transmission",
              message: payload.new.content
            });
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const addToCart = async (item: any) => {
    const existing = cartItems.find(i => i.domain === item.domain);
    if (existing) {
      if (session?.user && existing.db_id) {
        await supabase.from('cart').delete().eq('id', existing.db_id);
      }
      setCartItems(prev => prev.filter(i => i.domain !== item.domain));
    }

    const serviceType = item.serviceType || 'Guest Post';
    const finalPrice = item.price;

    const initialConfig = {
      contentType: 'provide',
      serviceType: serviceType,
      contentRequirements: { links: [{ anchorText: '', landingPageUrl: '' }] }
    };

    const newItem = {
      ...item,
      price: finalPrice,
      serviceType: serviceType,
      configuration: initialConfig
    };

    if (session?.user) {
      try {
        const { data } = await supabase.from('cart').insert([{
          user_id: session.user.id,
          domain_name: item.domain,
          price: finalPrice,
          category: item.category,
          da: item.da,
          dr: item.dr,
          configuration: initialConfig
        }]).select().single();
        if (data) newItem.db_id = data.id;
      } catch (e) {
        console.error("Cart save error");
      }
    }

    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = async (domain: string) => {
    const item = cartItems.find(i => i.domain === domain);
    if (session?.user && item?.db_id) {
      try { await supabase.from('cart').delete().eq('id', item.db_id); } catch (e) { }
    }
    setCartItems(cartItems.filter(i => i.domain !== domain));
  };

  if (isInitializing) {
    return <div className="min-h-screen w-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
    </div>;
  }

  const renderContent = () => {
    const hash = currentPath;
    if (hash === '#/login') return <Login />;
    if (hash === '#/signup') return <Signup />;
    if (hash === '#/admin') return <AdminPanel />;
    if (hash === '#/profile') return <Profile />;

    if (hash.startsWith('#/checkout')) {
      const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
      const orderIdParam = urlParams.get('order_id');
      return <Checkout items={cartItems} niche={niche} orderId={orderIdParam} onOrderSuccess={() => setCartItems([])} />;
    }

    if (hash.toLowerCase().startsWith('#/domains/') && hash.split('/').length > 2) {
      return <DomainDetail domainName={hash.split('/')[2]} addToCart={addToCart} niche={niche} />;
    }

    if (hash.toLowerCase().includes('domains'))
      return <Marketplace niche={niche} setNiche={setNiche} onAddToCart={addToCart} />;

    if (hash.toLowerCase().includes('services')) return <main className="pt-20"><Services isFullPage={true} /></main>;
    if (hash.toLowerCase().includes('pricing')) return <Pricing />;
    if (hash.toLowerCase().includes('contact')) return <Contact />;

    if (hash === '#/' || hash === '' || hash === '#') {
      return <main><Hero /><div id="home-marketplace"><Marketplace isSection={true} niche={niche} onAddToCart={addToCart} /></div><Services /><BlogSection /></main>;
    }
    return <main className="pt-56 pb-20 text-center min-h-screen text-slate-900 font-bold uppercase italic tracking-widest">Protocol_Unknown: Page Not Found</main>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffcfd]">
      {!['#/login', '#/signup', '#/admin'].includes(currentPath.split('?')[0]) && (
        <Header cartCount={cartItems.length} onOpenCart={() => setIsCartOpen(true)} />
      )}
      <div className="flex-1">{renderContent()}</div>
      {!['#/login', '#/signup', '#/admin'].includes(currentPath.split('?')[0]) && <Footer />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} niche={niche} onRemove={removeFromCart} />

      {/* Real-time Support Layer */}
      <ChatWidget />
      <Toast
        isOpen={toast.show}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Menu, X, User, Bell, 
  ChevronRight, Search, Zap, Globe, 
  CheckCircle, CreditCard, Info, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Marketplace');
  const [session, setSession] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUnreadCount(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUnreadCount(session.user.id);
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchUnreadCount = async (userId: string) => {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    setUnreadCount(count || 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/login';
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const navLinks = [
    { label: 'Domains', href: '#/domains', icon: <img src="/assets/images/dmoainsicons.png" alt="Domains" className="w-6 h-6 object-contain" /> },
    { label: 'Pricing', href: '#/pricing', icon: <img src="/assets/images/pricing.png" alt="Pricing" className="w-6 h-6 object-contain" /> },
    { label: 'Contact', href: '#/contact', icon: <img src="/assets/images/concact.png" alt="Contact" className="w-6 h-6 object-contain" /> },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-700 ${isScrolled ? 'pt-2' : 'pt-6'}`}>
        <div className="container mx-auto px-4 md:px-6 max-w-[1500px]">
          <div className={`relative flex items-center justify-between transition-all duration-500 rounded-[2.5rem] border px-4 md:px-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
            isScrolled 
              ? 'bg-slate-950/80 backdrop-blur-2xl border-white/10 py-2.5' 
              : 'bg-slate-900/60 backdrop-blur-3xl border-white/5 py-4'
          }`}>
            
            <div className="flex items-center space-x-8">
              <a 
                href="#/" 
                onClick={(e) => navigateTo(e, '#/')}
                className="flex items-center space-x-3 group cursor-pointer shrink-0"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl italic shadow-2xl transition-all group-hover:scale-105 group-hover:rotate-6">
                  B
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg font-black text-white uppercase leading-none tracking-tight">BLOGMET</span>
                  <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase mt-0.5 opacity-80">GP Marketplace</span>
                </div>
              </a>

              <nav className="hidden xl:flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                {navLinks.map((link) => (
                  <a 
                    key={link.label} 
                    href={link.href}
                    onClick={(e) => navigateTo(e, link.href)}
                    className={`relative flex items-center space-x-3 px-5 py-2.5 text-[13px] font-bold transition-all rounded-xl hover:scale-105 hover:shadow-lg ${
                      window.location.hash.includes(link.label.toLowerCase())
                        ? 'text-slate-900 bg-white shadow-xl' 
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden lg:flex items-center space-x-3 pr-5 border-r border-white/10">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg" 
                  title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
                >
                  <img 
                    src={isDarkMode ? "/assets/images/darktheme.png" : "/assets/images/sunlightwhite.png"} 
                    alt="Theme" 
                    className="w-7 h-7 object-contain" 
                  />
                </button>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg" 
                >
                  <img src="/assets/images/searchicons.png" alt="Search" className="w-7 h-7 object-contain" />
                </button>
                
                {/* Notification Dropdown Trigger */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`p-2.5 rounded-xl transition-all relative hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg ${isNotificationsOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                  >
                    <img src="/assets/images/notifications.png" alt="Notifications" className="w-7 h-7 object-contain" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-900 rounded-full animate-ping"></span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <NotificationDropdown 
                      userId={session?.user?.id} 
                      onClose={() => setIsNotificationsOpen(false)} 
                    />
                  )}
                </div>

              </div>

              {/* Cart is now outside the hidden block so it shows on mobile */}
              <button 
                onClick={onOpenCart}
                className="flex lg:hidden p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all relative" 
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-orange-500 text-white text-[8px] font-black px-1 rounded-full min-w-[14px]">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:flex items-center">
                <button 
                  onClick={onOpenCart}
                  className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all relative ml-2" 
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-orange-500 text-white text-[8px] font-black px-1 rounded-full min-w-[14px]">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {session ? (
                  <a 
                    href="#/profile"
                    onClick={(e) => navigateTo(e, '#/profile')}
                    className="flex items-center mr-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-xl cursor-pointer hover:bg-blue-600/20 transition-all max-w-[200px]"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2 shrink-0">
                      <User size={14} fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-tight truncate">
                      {session.user.user_metadata?.full_name || 'My Account'}
                    </span>
                  </a>
                ) : (
                  <div className="hidden md:flex items-center space-x-5 lg:space-x-7 ml-4">
                    <button 
                      onClick={(e) => navigateTo(e, '#/login')}
                      className="transition-all hover:scale-105 active:scale-95 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 p-1"
                    >
                      <img src="/assets/images/loginbutn.png" alt="Login" className="h-11 md:h-13 lg:h-14 w-auto object-contain" />
                    </button>
                    <button 
                      onClick={(e) => navigateTo(e, '#/signup')}
                      className="transition-all hover:scale-105 active:scale-95 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 p-1"
                    >
                      <img src="/assets/images/signup.png" alt="Sign Up" className="h-11 md:h-13 lg:h-14 w-auto object-contain" />
                    </button>
                  </div>
                )}

                <button className="lg:hidden p-2.5 text-white bg-white/10 border border-white/10 rounded-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[2400] bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-[2500] bg-slate-950 flex flex-col p-6 pt-24 shadow-2xl border-l border-white/10 overflow-y-auto"
            >
              <div className="flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <a 
                    key={link.label} 
                    href={link.href}
                    onClick={(e) => navigateTo(e, link.href)}
                    className="text-lg md:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3 hover:text-blue-400 transition-colors"
                  >
                    <span className="text-blue-600">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
                
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="text-lg md:text-xl font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight flex items-center gap-3 text-left hover:text-white transition-colors"
                >
                  <span className="text-slate-500">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</span>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                
                <button 
                  onClick={() => { onOpenCart(); setIsMobileMenuOpen(false); }}
                  className="text-lg md:text-xl font-bold text-slate-300 uppercase tracking-tight text-left flex items-center justify-between hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} className="text-slate-500" />
                    Cart
                  </div>
                  {cartCount > 0 && <span className="bg-orange-500 text-white text-xs px-2.5 py-0.5 rounded-full">{cartCount}</span>}
                </button>

                {session && (
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="text-lg md:text-xl font-bold text-slate-300 uppercase tracking-tight text-left flex items-center justify-between hover:text-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-slate-500" />
                      Notifications 
                    </div>
                    {unreadCount > 0 && <span className="bg-rose-500 text-white text-xs px-2.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </button>
                )}

                {/* Notification Overlay inside Mobile Menu */}
                {isNotificationsOpen && session && (
                  <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden mb-4 shadow-inner border border-white/5 mt-2">
                    <NotificationDropdown 
                      userId={session.user.id} 
                      onClose={() => setIsNotificationsOpen(false)} 
                    />
                  </div>
                )}
                
                <div className="h-px bg-white/10 my-2" />
                {session ? (
                  <>
                    <a 
                      href="#/profile"
                      onClick={(e) => navigateTo(e, '#/profile')}
                      className="text-lg md:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3 hover:text-blue-400 transition-colors"
                    >
                      <User size={20} className="text-slate-500" />
                      My Profile
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="text-lg md:text-xl font-bold text-rose-500 uppercase tracking-tight text-left flex items-center gap-3 hover:text-rose-400 transition-colors"
                    >
                      <X size={20} className="text-rose-500" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <a 
                      href="#/login"
                      onClick={(e) => navigateTo(e, '#/login')}
                      className="transition-all hover:scale-102 active:scale-95 rounded-xl hover:shadow-xl p-1 flex justify-center"
                    >
                      <img src="/assets/images/loginbutn.png" alt="Login" className="h-11 w-auto object-contain" />
                    </a>
                    <a 
                      href="#/signup"
                      onClick={(e) => navigateTo(e, '#/signup')}
                      className="transition-all hover:scale-102 active:scale-95 rounded-xl hover:shadow-xl p-1 flex justify-center"
                    >
                      <img src="/assets/images/signup.png" alt="Sign Up" className="h-11 w-auto object-contain" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[3000] flex items-start justify-center pt-24 md:pt-40 px-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setIsSearchOpen(false)} />
          <div className="w-full max-w-2xl relative z-10 animate-in zoom-in-95 fade-in">
            <div className="bg-slate-950 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden p-6 md:p-8">
              <div className="relative">
                <img src="/assets/images/searchicons.png" alt="Search" className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 object-contain" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Find your perfect domain..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-xl font-bold text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

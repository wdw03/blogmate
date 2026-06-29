
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, Sun, Moon, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn] = useState(false); // Mock auth state
  const cartItemCount = 2; // Mock cart state

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Domains', href: '#/domains' },
    { label: 'Pricing', href: '#/pricing' },
    { label: 'Blog', href: '#/blog' },
    { label: 'Contact', href: '#/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
            D
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">DomIntel</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors relative">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-sm font-medium">Account</span>
            </div>
          ) : (
            <a href="#/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Login
            </a>
          )}

          <a 
            href="#/domains" 
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Explore Domains
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="block text-lg font-medium text-slate-900 border-b border-slate-50 pb-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-4">
            <button className="flex items-center space-x-2 text-slate-600">
              <Globe size={18} />
              <span>EN</span>
            </button>
            <button className="flex items-center space-x-2 text-slate-600">
              <ShoppingCart size={18} />
              <span>Cart ({cartItemCount})</span>
            </button>
          </div>
          <a 
            href="#/domains" 
            className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold"
          >
            Explore Domains
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;

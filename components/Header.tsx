
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navLinks = [
    { label: 'Domains', href: '#/domains' },
    { label: 'Pricing', href: '#/pricing' },
    { label: 'Blog', href: '#/blog' },
    { label: 'Contact', href: '#/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
            D
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">DomIntel</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <a href="#/profile" className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <User size={16} className="text-slate-500 dark:text-slate-400" />
              </div>
            </a>
          ) : (
            <a href="#/login" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
              Sign In
            </a>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-400"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-lg font-medium text-slate-900 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-300"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
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

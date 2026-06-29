
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bell } from 'lucide-react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Toast: React.FC<ToastProps> = ({ message, isOpen, onClose, title = "New Message" }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-28 left-8 z-[9999] w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden cursor-pointer"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-chat'));
            onClose();
          }}
        >
          <div className="flex items-start gap-4 p-5">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <MessageSquare size={20} fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{title}</h4>
              <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
                {message}
              </p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-slate-300 hover:text-slate-900"
            >
              <X size={16} />
            </button>
          </div>
          <div className="h-1 bg-slate-100 w-full">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-blue-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

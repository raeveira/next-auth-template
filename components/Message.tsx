'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface MessageProps {
  message: string;
  type: 'success' | 'error' | '';
  onCloseAction: () => void;
}

export const Message: React.FC<MessageProps> = ({ message, type, onCloseAction }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onCloseAction();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onCloseAction]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md flex items-center space-x-2 ${
            type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {getIcon()}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

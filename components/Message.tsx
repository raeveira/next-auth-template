'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {CheckCircle, Info, XCircle} from 'lucide-react';
import {MessageProps} from "@/lib/interfaces";

/*
* This is the message component.
*
* It displays a message to the user.
*
* @param message - string The message to display.
* @param type - string The type of message.
* @param onCloseAction - function The function to call when the message is closed.
*
* @returns JSX.Element
* */
export const Message: React.FC<MessageProps> = ({ message, type, onCloseAction }) => {

  /*
  * Close the message after 5 seconds.
  *
  * This function is used to close the message after 5 seconds.
  *
  * @returns void
  * */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onCloseAction();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onCloseAction]);

  /*
  * Get the icon for the message.
  *
  * This function is used to get the icon for the message.
  *
  * @returns JSX.Element
  * */
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
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

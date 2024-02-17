// src/app/ChatLayout.tsx
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import Header from './Header';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const [isChatReset, setIsChatReset] = useState(false);

  const handleNewChatClick = () => {
    setIsChatReset(true);
  };

  const resetChat = () => {
    setIsChatReset(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;

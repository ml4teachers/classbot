// src/app/ChatLayout.tsx
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';

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
      <Header />
      <div className="flex">
        <main className="flex-1">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;

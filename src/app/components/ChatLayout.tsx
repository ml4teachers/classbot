// src/app/ChatLayout.tsx
"use client";

import React, { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {

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

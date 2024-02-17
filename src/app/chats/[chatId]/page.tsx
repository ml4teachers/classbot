// src/app/page.tsx

import React from 'react';
import ChatLayout from '../../components/ChatLayout';
import ChatWindow from '../../components/ChatWindow';
import Header from '../../components/Header';
import { TokensProvider } from '../../context/TokensContext';



const Page: React.FC = () => {
  // Hier könntest du Zustände und Funktionen definieren, um Nachrichten zu verwalten

  return (
    <TokensProvider>
      <ChatLayout>
        <Header />
        <ChatWindow />
      </ChatLayout>
    </TokensProvider>
  );
};

export default Page;

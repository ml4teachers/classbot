// src/app/page.tsx

import React from 'react';
import ChatLayout from '../../ChatLayout';
import ChatWindow from '../../../components/ChatWindow';
import Header from '../../../components/Header';



const Page: React.FC = () => {
  // Hier könntest du Zustände und Funktionen definieren, um Nachrichten zu verwalten

  return (
    <ChatLayout>
      <Header />
      <ChatWindow />
    </ChatLayout>
  );
};

export default Page;

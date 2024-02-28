// src/app/chats/[chatId]/page.tsx

import React from 'react';
import ChatWindow from '@/app/components/ChatWindow';
import Layout from '@/app/layout';

const ChatPage: React.FC = () => {
  return (
    <Layout>
      <ChatWindow />
    </Layout>
  );
};

export default ChatPage;

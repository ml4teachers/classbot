// src/components/ChatList.tsx
'use client'

import React, { useEffect, useState } from 'react';
import ChatListItem from './ChatListItem';
import { useTokens } from '../../hooks/useTokens';

const ChatList = ( { onChatChange }: { onChatChange: any }, { handleChatSelection }: { handleChatSelection: any } ) => {
  const { totalTokens } = useTokens();
  const [chats, setChats] = useState([]);
  

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch('/api/chats');
        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error('Fehler beim Laden der Konversationen:', error);
      }
    }

    fetchChats();
  }, [onChatChange]);

  return (
    <div className="fixed bg-blue-100 top-36 h-full left-0 w-64 pr-2 flex-col overflow-y-auto">
      <div className="mb-64">
        {chats.map((chat: { id: string }) => (
          <ChatListItem key={chat.id} chat={chat} onChatChange={onChatChange} handleChatSelection={handleChatSelection}/>
        ))}
      </div>
      <div className="fixed bottom-4 p-4 text-gray-600 text-sm">Gebrauchte Tokens: {totalTokens}</div>
    </div>
  );
};

export default ChatList;
// src/components/ChatListItem.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

type ChatListItemProps = {
  chat: any;
  onChatChange: () => void;
  handleChatSelection: (chatId: string) => void;
};

const ChatListItem = ({ chat, onChatChange, handleChatSelection }: ChatListItemProps) => {
  const router = useRouter();
  const firstMessage = chat.messages[0]?.text || 'Keine Nachrichten';

  const handleDelete = async () => {
    try {
      await fetch(`/api/chats/${chat.id}`, { method: 'DELETE' });
      onChatChange(); // Aufruf hier sollte jetzt funktionieren
    } catch (error) {
      console.error('Fehler beim Löschen des Chats:', error);
    }
  };

  const navigateToChat = () => {
    router.push(`/chats/${chat.id}`);
  }

  return (
    <div className="p-2 hover:bg-blue-50 cursor-pointer rounded-r-xl">
      <div className="flex justify-between">
        <div className="flex-1 w-52 cursor-pointer" onClick={navigateToChat}>
          <div className="text-sm text-gray-600 truncate">{firstMessage}</div>
          <span className="text-xs text-gray-400">{new Date(chat.createdAt).toLocaleTimeString()}</span>
        </div>
        <TrashIcon onClick={handleDelete} className="h-5 mx-1 hover:text-gray-700 text-gray-400" />
      </div>
    </div>
  );
};

export default ChatListItem;

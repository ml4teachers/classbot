// src/components/NewChatButton.tsx

import React from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

interface NewChatButtonProps {
  onNewChat: () => void;
}


const NewChatButton: React.FC<NewChatButtonProps> = ({ onNewChat }) => {
  return (
    <div className="fixed top-14 w-64 py-2 bg-blue-100 rounded-tr-xl">
      <div className="p-4 mr-3 bg-blue-100 hover:bg-blue-50 rounded-r-xl my-2">
        <button onClick={onNewChat} className="flex items-center text-lg">
          <DocumentPlusIcon className="w-6 h-6 mr-2 text-sm" />
          Neuer Chat
        </button>
      </div>
    </div>
  );
};

export default NewChatButton;

// components/MessageBubble.tsx

import React, { useState } from 'react';
import SpeakerButton from './SpeakerButton';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import './markdown-styles.css';

interface MessageBubbleProps {
  text: string;
  isOwnMessage: boolean;
  isBotMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isOwnMessage,
  isBotMessage,
}) => {

  const [copied, setCopied] = useState(false);

  const userMessageStyle = 'flex items-center max-w-3/4 mx-2 my-1 px-4 py-2 rounded-lg bg-slate-200';
  const botMessageStyle = 'flex mx-2 my-1 px-4 py-2';
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // Reset nach 1 Sekunde
    } catch (error) {
      console.error('Fehler beim Kopieren: ', error);
    }
  };

  if (isBotMessage) {
    return (
      <div className={botMessageStyle}>
        <div className="flex-col">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          <div className="flex">
            {copied ? (
              <CheckIcon className="w-7 h-7 mt-1 text-gray-500 p-1" />
            ) : (
              <ClipboardIcon
                onClick={handleCopy}
                className="w-7 h-7 cursor-pointer mt-1 text-gray-300 p-1 hover:text-gray-500"
              />
            )}
            {// <SpeakerButton textToSpeak={text} />
            }
          </div>
        </div>
      </div>
    );
  }

  // Bubble für Benutzernachrichten
  return (
    <div className="flex">
      <div className={`${userMessageStyle} ${isOwnMessage ? 'self-start' : 'self-end'}`}>
        <div className="flex-1">{text}</div>
      </div>
    </div>
  );
};

export default MessageBubble;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat, UseChatOptions } from 'ai/react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import { usePathname } from 'next/navigation';

export default function ChatWindow() {
  const [expert, setExpert] = useState(null);
  const pathname = usePathname();
  const chatId = pathname && pathname.split('/').pop() || uuidv4();
  const messagesEndRef = useRef(null);
  const inputBarRef = useRef(null);
  const [inputBarHeight, setInputBarHeight] = useState(0);

  // Autoscroll zum neuesten Nachricht
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auslesen der Expertendaten aus dem localStorage
    const expertData = localStorage.getItem('selectedExpert');
    if (expertData) {
      setExpert(JSON.parse(expertData));
    }
  }, []);

  // Chat-Optionen für ai/react nutzen, inklusive handleFinish
  const chatOptions: UseChatOptions = {
    id: chatId,
    onFinish: handleFinish,
    initialMessages: expert ? [
      {id: chatId, content: expert.initialPrompt, role: 'user', createdAt: new Date() },
      {id: chatId, content: expert.initialAnswer, role: 'assistant', createdAt: new Date() }
    ] : [],
  };

  // Verwaltung des Chat-Status mithilfe des ai/react Hooks
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
  } = useChat(chatOptions);

  useEffect(() => {
    // Scrollen, wenn Nachrichten aktualisiert werden
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Berechnen der Höhe des Input-Bars
    if (inputBarRef.current) {
      setInputBarHeight(inputBarRef.current.offsetHeight);
    }
  }
  , [input]);

  // Speichert Nachrichten nach Abschluss der Chatbot-Antwort
  async function handleFinish(message: any) {
    const messagesToSave = [
      { chatId, text: input, role: 'user' },
      { chatId, text: message.content, role: 'assistant' },
    ];
    await saveMessages(messagesToSave);
  }

  // Speichert Nachrichten in der Datenbank
  async function saveMessages(messages: any[]) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });
    } catch (error) {
      console.error('Fehler beim Speichern der Nachrichten:', error);
    }
  }


  return (
    <div className="flex flex-col h-full mx-auto max-w-screen-md mt-14 w-full">
      {expert && <img src={expert.imageUrl} alt={expert.name} className="w-32 h-32 rounded-full mx-auto"/>}
      <div className="flex-grow overflow-y-scroll p-4 bg-white mb-12">
        {messages.map((m, index) => {
          if (index === 0 && m.role === 'user') return null;

          return (
          <MessageBubble key={index} text={m.content} isOwnMessage={m.role === 'user'} isBotMessage={m.role === 'assistant'} />
          );
          })}
        <div ref={messagesEndRef} />
        {isLoading && <SparklesIcon className="h-6 text-blue-100 animate-spin mt-4 ml-8" />}
        {error && <div>Fehler: {error.message}</div>}
      </div>
      <div ref={inputBarRef} />
      <InputBar
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        handleInputUpdate={setInput}
      />
    </div>
  );
}

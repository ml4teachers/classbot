// src/app/components/ChatWindow.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat, UseChatOptions } from 'ai/react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import { usePathname, useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';

// import { useTokens } from '../context/TokensContext';


interface Expert {
  name: string;
  description: string;
  imageUrl: string;
  initialPrompt: string;
  initialAnswer: string;
}

export default function ChatWindow() {
  const [expert, setExpert] = useState<Expert | null>(null);
  const pathname = usePathname();
  const chatId = pathname && pathname.split('/').pop() || uuidv4();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  // const { updateTokens } = useTokens();

  // Zugangscode aus LocalStorage
  const accessCode = typeof window !== 'undefined' ? localStorage.getItem('accessCode') : null;

  useEffect(() => {
    const validateAccessCode = async () => {
      if (accessCode) {
        try {
          const { data, error } = await supabase
            .from('access_codes')
            .select('*')
            .eq('code', accessCode)
            .gte('expires_at', new Date().toISOString())
            .single();

          if (error || !data) {
            console.warn('Ungültiger oder abgelaufener Zugangscode.');
            localStorage.removeItem('accessCode');
            setIsAuthorized(false);
          } else if (data.current_users < data.max_users) {
            setIsAuthorized(true);
          } else {
            console.warn('Maximale Anzahl von Nutzer:innen erreicht.');
            localStorage.removeItem('accessCode');
            setIsAuthorized(false);
          }
        } catch (err) {
          console.error('Fehler bei der Prüfung des Zugangscodes:', err);
          setIsAuthorized(false);
        }
      }
    };

    validateAccessCode();
  }, [accessCode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Autoscroll zur neuesten Nachricht
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auslesen der Expertendaten aus dem localStorage
    const expertData = localStorage.getItem('selectedExpert');
    if (expertData) {
      setExpert(JSON.parse(expertData) as Expert);
    }
  }, []);

  // Chat-Optionen für ai/react nutzen, inklusive handleFinish
  const chatOptions: UseChatOptions = {
    id: chatId,
    // onFinish: handleFinish,
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
    setMessages,
  } = useChat(chatOptions);

  useEffect(() => {
    // Scrollen, wenn Nachrichten aktualisiert werden
    scrollToBottom();
  }, [messages]);

  // Speichert Nachrichten nach Abschluss der Chatbot-Antwort
  // async function handleFinish(message: any) {
  //   const messagesToSave = [
  //     { chatId, text: input, role: 'user' },
  //     { chatId, text: message.content, role: 'assistant' },
  //   ];
  //   await saveMessages(messagesToSave);
  //   // await updateTokens();
  // }

  // Speichert Nachrichten in der Datenbank
  // async function saveMessages(messages: any[]) {
  //   try {
  //     await fetch('/api/messages', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(messages),
  //     });
  //   } catch (error) {
  //     console.error('Fehler beim Speichern der Nachrichten:', error);
  //   }
  // }

  const handleSendImage = (imageMessage: any) => {
    console.log('Image Message:', imageMessage);
    setMessages(imageMessage);
    handleSubmit({ preventDefault: () => {} } as any);  // Simuliert einen Submit Event
  };


  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Zugriff verweigert</h1>
        <p className="mb-6">
          Du hast keinen Zugriff auf diesen Chat. Bitte melde dich an oder verwende einen gültigen Zugangscode.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Zurück zur Startseite
        </button>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full mx-auto max-w-screen-md mt-14 w-full">
      {expert && (
        <>
          {expert.name === 'Code' ? (
            <ImageUpload onSendImage={handleSendImage} />
          ) : (
            <div>
              <img src={expert.imageUrl} alt={expert.name} className="w-16 h-16 mt-16 mx-auto" />
              <h3 className="mt-4 text-lg font-bold text-center">{expert.name}</h3>
            </div>
          )}
        </>
      )}
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

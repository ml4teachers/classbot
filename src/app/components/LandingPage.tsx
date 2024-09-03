// app/components/LandingPage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import UserButton from './UserButton';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface Expert {
  map(arg0: (expert: any, index: any) => React.JSX.Element): React.ReactNode;
  name: string;
  description: string;
  imageUrl: string;
  initialPrompt: string;
  initialAnswer: string;
  voice: string;
}

interface CustomBot extends Expert {
  id: string;
  createdAt: string;
  expiration: string;
}

export default function LandingPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [customBots, setCustomBots] = useState<CustomBot[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const loggedInUser = data.session?.user || null;
      setUser(loggedInUser);
      if (loggedInUser) {
        const email = loggedInUser.email;
        if (email) {
          const allowedDomains = ['@stadtschulenzug.ch', '@zugerklassen.ch', '@phzg.ch', '@phlu.ch'];
          const domain = email.substring(email.lastIndexOf('@'));
          setIsAllowed(allowedDomains.includes(domain));
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const loggedInUser = session?.user || null;
        setUser(loggedInUser);
        if (loggedInUser) {
          const email = loggedInUser.email;
          if (email) {
            const allowedDomains = ['@stadtschulenzug.ch', '@zugerklassen.ch', '@phzg.ch'];
            const domain = email.substring(email.lastIndexOf('@'));
            setIsAllowed(allowedDomains.includes(domain));
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Laden der vordefinierten Experten
    if (typeof window !== 'undefined') {
      fetch('/experts.json')
        .then((response) => response.json())
        .then((data) => setExperts(data));
    }

    // Laden der benutzerdefinierten Bots
    const fetchCustomBots = async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('Chat')
        .select('*')
        .lte('startTime', now)  // startTime ist in der Vergangenheit oder jetzt
        .gt('expiration', now)  // expiration ist in der Zukunft
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Fehler beim Laden der benutzerdefinierten Bots:', error);
      } else {
        setCustomBots(data as CustomBot[]);
      }
    };

    fetchCustomBots();
  }, []);

  const startChatWithExpert = (expert: Expert | CustomBot) => {
    const chatId = uuidv4();
    localStorage.setItem('selectedExpert', JSON.stringify(expert));
    router.push(`/chats/${chatId}`);
  };

  const handleEdit = async (bot: CustomBot) => {
    // Bot löschen
    const { error } = await supabase
      .from('Chat')
      .delete()
      .match({ id: bot.id });

    if (error) {
      console.error('Fehler beim Löschen des Bots:', error);
      alert('Fehler beim Bearbeiten des Bots. Bitte versuchen Sie es erneut.');
      return;
    }

    // Zur Bearbeitungsseite navigieren
    router.push(`/create?edit=${encodeURIComponent(JSON.stringify(bot))}`);
  };

  const renderExpertCard = (expert: Expert | CustomBot, index: number) => (
    <div key={index} className="p-4 m-4 cursor-pointer w-80 min-h-80 bg-white">
      <div onClick={() => startChatWithExpert(expert)}>
        <img src={expert.imageUrl || '/custom.png'} alt={expert.name} className="w-32 h-32 mx-auto"/>
        <h3 className="mt-4 text-lg font-bold text-center">{expert.name}</h3>
        <p className="text-sm text-center">{expert.description}</p>
      </div>
      {'userId' in expert && expert.userId === user?.id && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(expert as CustomBot);
          }}
          className="mt-4 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Bearbeiten
        </button>
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-24 md:mt-36">Willkommen bei classbot.ch</h1>
      <div className="flex flex-col items-center mt-8 px-4">
        <p className="text-center mb-8 max-w-2xl">
          Hier kannst du dich mit virtuellen Lernbots der Stadtschulen Zug austauschen, die auf einem grossen Sprachmodell basieren.
          Sie wurden darauf programmiert, auf deine Fragen zu antworten und dir beim Lernen zu helfen.
          Denke daran, dass die Bots auf Algorithmen basieren und Fehler machen können.
        </p>
        {user ? (
          isAllowed ? (
            <>
              <p className="text-center m-4 pb-8">Was möchtest du heute tun? Wie kann ich dir beim Lernen helfen?</p>
              <div className="flex flex-wrap justify-center items-center">
                {experts.map((expert, index) => renderExpertCard(expert, index))}
                {customBots.map((bot, index) => renderExpertCard({...bot, voice: 'nova', imageUrl: '/custom.png'}, experts.length + index))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center mt-8 px-4 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4"/>
            <p className="text-lg font-bold mb-8">Dieser Chatbot darf nur durch Personen der Stadtschulen Zug benutzt werden.</p>
            <UserButton />   
          </div>
            )
        ) : (
          <>
            <p className="text-center m-4 pb-8">Melde dich über das Microsoft-Logo an, um zu beginnen.</p>
            <UserButton />
          </>
        )}
        <p className="text-center my-16 max-w-2xl">
          Wenn du mehr darüber erfahren willst, wie unsere Bots funktionieren, findest du
          <Link href="/about" className="text-blue-600 visited:text-purple-600"> hier </Link>
          weitere Informationen.
        </p>
      </div>
    </div>
  );
}
// app/components/LandingPage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import UserButton from './UserButton';
import Link from 'next/link';


interface Expert {
  map(arg0: (expert: any, index: any) => React.JSX.Element): React.ReactNode;
  name: string;
  description: string;
  imageUrl: string;
  initialPrompt: string;
  initialAnswer: string;
  voice: string;
}

export default function LandingPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/experts.json')
        .then((response) => response.json())
        .then((data) => setExperts(data));
    }
  }, []);

  const startChatWithExpert = (expert: Expert) => {
    const chatId = uuidv4();
    localStorage.setItem('selectedExpert', JSON.stringify(expert));
    router.push(`/chats/${chatId}`);
  };

  
  return (
  <div>
    <h1 className="text-4xl font-bold text-center mt-24 md:mt-36">Willkommen bei classbot.ch</h1>
    <div className="flex flex-col items-center mt-8 px-4">
      <p className="text-center mb-8 max-w-2xl">
            Hier kannst du dich mit virtuellen Expertenbots austauschen, die mit einem grossen Sprachmodell trainiert wurden,
            um auf deine Fragen zu antworten. Denke daran, dass die Bots auf Algorithmen basieren und Fehler machen können!</p>
      {user ? (
        <>
          <p className="text-center m-4 pb-8">Wähle einen Experten aus, um das Gespräch zu beginnen:</p>
          <div className="flex flex-wrap justify-center items-center bg-white">
            {experts.map((expert, index) => (
              <div key={index} className="p-4 m-4 border rounded-lg cursor-pointer w-80 bg-slate-50 hover:bg-slate-100 min-h-80" onClick={() => startChatWithExpert(expert)}>
                <img src={expert.imageUrl} alt={expert.name} className="w-32 h-32 rounded-full mx-auto"/>
                <h3 className="mt-4 text-lg font-bold text-center">{expert.name}</h3>
                <p className="text-sm text-center">{expert.description}</p>
              </div>
            ))}
          </div>
        </>
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

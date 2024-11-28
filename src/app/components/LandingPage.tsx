'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import UserButton from './UserButton';
import AccessCodeDialog from './AccessCodeDialog';
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
  accessCode: string | null; // Neuer Parameter für Zugangscode
}

export default function LandingPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [customBots, setCustomBots] = useState<CustomBot[]>([]);
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const allowedDomains = ['@stadtschulenzug.ch', '@zugerklassen.ch', '@phzg.ch', '@schule-oberaegeri.ch', 
    '@schulen-unteraegeri.ch', 'schulen-huenenberg.ch', '@schulenrisch.ch', '@schulen-steinhausen.ch'];

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
            setIsAccessGranted(false);
          } else if (data.current_users < data.max_users) {
            setIsAccessGranted(true);
          } else {
            console.warn('Maximale Anzahl von Nutzer:innen erreicht.');
            localStorage.removeItem('accessCode');
            setIsAccessGranted(false);
          }
        } catch (err) {
          console.error('Fehler bei der Prüfung des Zugangscodes:', err);
          setIsAccessGranted(false);
        }
      }
    };

    validateAccessCode();
  }, [accessCode]);

  useEffect(() => {
    const checkUserAccess = async (loggedInUser: User | null) => {
      if (!loggedInUser?.email) return;

      const email = loggedInUser.email;
      const domain = email.substring(email.lastIndexOf('@'));

      // Zuerst überprüfen, ob die E-Mail-Domäne erlaubt ist
      if (allowedDomains.includes(domain)) {
        setIsAllowed(true);
        return;
      }

      // Wenn die Domäne nicht erlaubt ist, prüfen, ob die E-Mail in der Supabase-Datenbank enthalten ist
      const { data, error } = await supabase
        .from('AllowedEmails')
        .select('email')
        .eq('email', email);

      if (error) {
        console.error('Fehler beim Überprüfen der E-Mail:', error);
        return;
      }

      // Setze isAllowed basierend darauf, ob die E-Mail in der Tabelle vorhanden ist
      setIsAllowed(data?.length > 0);
    };

    supabase.auth.getSession().then(({ data }) => {
      const loggedInUser = data.session?.user || null;
      setUser(loggedInUser);
      if (loggedInUser) {
        checkUserAccess(loggedInUser);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const loggedInUser = session?.user || null;
        setUser(loggedInUser);
        if (loggedInUser) {
          checkUserAccess(loggedInUser);
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
  
      try {
        let query = supabase
          .from('Chat')
          .select('*')
          .lte('startTime', now) // startTime ist in der Vergangenheit oder jetzt
          .gt('expiration', now) // expiration ist in der Zukunft
          .order('createdAt', { ascending: false });
  
        if (user) {
          // Angemeldete Benutzer: Zeige eigene und öffentliche Bots
          query = query.or(
            `accessCode.is.null,accessCode.not.is.null`
          );
        }
  
        if (accessCode) {
          // Benutzer mit Zugangscode: Zeige passende und öffentliche Bots
          query = query.or(`accessCode.eq.${accessCode},accessCode.is.null`);
        }
  
        const { data, error } = await query;
  
        if (error) throw error;
  
        setCustomBots(data as CustomBot[]);
      } catch (error) {
        console.error('Fehler beim Laden der benutzerdefinierten Bots:', error);
      }
    };
  
    fetchCustomBots();
  }, [user, accessCode]);

  const startChatWithExpert = (expert: Expert | CustomBot) => {
    const chatId = uuidv4();
    localStorage.setItem('selectedExpert', JSON.stringify(expert));
    router.push(`/chats/${chatId}`);
  };

  const renderExpertCard = (expert: Expert | CustomBot, index: number) => (
    <div key={index} className="p-4 m-4 cursor-pointer w-80 min-h-80 bg-white">
      <div onClick={() => startChatWithExpert(expert)}>
        <img src={expert.imageUrl || '/custom.png'} alt={expert.name} className="w-32 h-32 mx-auto" />
        <h3 className="mt-4 text-lg font-bold text-center">{expert.name}</h3>
        <p className="text-sm text-center">{expert.description}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-24 md:mt-36">
        Willkommen bei classbot.ch
      </h1>
      <div className="flex flex-col items-center mt-8 px-4">
        <p className="text-center mb-8 max-w-2xl">
          Hier kannst du dich mit virtuellen Lernbots der Stadtschulen Zug austauschen, die auf einem grossen Sprachmodell basieren.
          Sie wurden darauf programmiert, auf deine Fragen zu antworten und dir beim Lernen zu helfen.
          Denke daran, dass die Bots auf Algorithmen basieren und Fehler machen können.
        </p>
        {user || isAccessGranted ? (
          isAllowed || isAccessGranted ? (
            <>
              <p className="text-center m-4 pb-8">
                Was möchtest du heute tun? Wie kann ich dir beim Lernen helfen?
              </p>
              <div className="flex flex-wrap justify-center items-center">
                {experts.map((expert, index) => renderExpertCard(expert, index))}
                {customBots.map((bot, index) =>
                  renderExpertCard(
                    { ...bot, voice: 'nova', imageUrl: '/custom.png' },
                    experts.length + index
                  )
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center mt-8 px-4 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-bold mb-8">
                Dieser Chatbot darf nur durch Lehrpersonen der gemeindlichen Schulen des Kantons Zug benutzt werden.
              </p>
              <UserButton />
            </div>
          )
        ) : (
          <>
            <p className="text-center m-4 pb-8">
              Melde dich als Lehrperson über das Microsoft-Logo an oder nutze einen&nbsp;
              <AccessCodeDialog onAccessGranted={() => setIsAccessGranted(true)} />
              , um zu beginnen.
            </p>
            <UserButton />
          </>
        )}
        <p className="text-center my-16 max-w-2xl">
          Wenn du mehr darüber erfahren willst, wie unsere Bots funktionieren, findest du
          <Link
            href="/about"
            className="text-blue-600 visited:text-purple-600"
          >
            {' '}
            hier{' '}
          </Link>
          weitere Informationen.
        </p>
      </div>
    </div>
  );
}
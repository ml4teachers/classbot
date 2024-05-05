// src/components/Header.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import UserButton from './UserButton';
// import { useTokens } from '@/hooks/useTokens.js';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';

const Header: React.FC = () => {
  // const { totalTokens } = useTokens();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

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

  const handleHeaderClick = () => {
    router.push('/');
  }

  const isChatActive = pathname && pathname.includes('/chats/');

  return (
    <div className="fixed bg-white h-14 w-full flex items-center px-4 shadow-md z-10">
      <div className="flex items-center cursor-pointer" onClick={handleHeaderClick}>
        <AcademicCapIcon className="w-9 mr-2"/>
        <h1 className="text-xl font-bold my-2">classbot.ch</h1>
      </div>
      <div className="flex-grow"></div>
      {isChatActive && (
        <button
          onClick={() => router.back()}
          className="text-sm sm:block mr-6 text-slate-500 hover:text-slate-800"
        >
          Bot wechseln
        </button>
      )}
      { // user && totalTokens !== undefined &&
        // <div className="hidden text-sm sm:block mr-6 text-slate-500">Gebrauchte Tokens: {totalTokens}</div>
      }
      <UserButton />
    </div>
  );
};

export default Header;

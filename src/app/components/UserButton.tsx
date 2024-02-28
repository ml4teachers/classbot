// components/UserButton.tsx

import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';


export default function UserButton() {
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
  
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: { 
        redirectTo: `${origin}/auth/callback`,
        scopes: 'email',
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex right-4 top-4">
      {user ? (
        <button onClick={handleSignOut} className="
        flex items-center text-sm text-slate-500 px-4 py-2 bg-slate-50 rounded-full
       hover:bg-slate-100 border hover:shadow-sm
       ">
          <img className="h-5 mr-2" src="/microsoft.svg" alt="Microsoft Logo" />
          <span>Abmelden</span>
        </button>
      ) : (
        <button onClick={handleSignIn} className="
          flex items-center text-sm text-slate-500 px-4 py-2 bg-slate-50 rounded-full
         hover:bg-slate-100 border hover:shadow-sm
         ">
          <img className="h-5 mr-2" src="/microsoft.svg" alt="Microsoft Logo" />
          <span>Anmelden</span>
        </button>
      )}
    </div>
  );
}

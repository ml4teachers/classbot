// components/UserButton.tsx

import React, { useState, useEffect } from 'react';
import { createSupabaseFrontendClient } from "@/utils/supabase";

export default function UserButton() {
  const supabase = createSupabaseFrontendClient();
  const [user, setUser] = useState(null);
  
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
    setUser(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      if (!user) {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Fehler beim Abrufen der Session:', error);
        } else {
          setUser((prevState: any) => {
            if (prevState === null) {
              return user;
            } else {
              return prevState;
            }
          });
        }
      }
    };
    checkSession();
  }, []);

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

// auth/user.js

import supabase from '/supabaseClient';

export const signInWithAzure = async () => {
  console.log('signInWithAzure wurde aufgerufen')
  const { user, session, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
    },
  });

  // Du kannst hier die Fehlerbehandlung ergänzen
  if (error) throw error;

  return { user, session };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  // Du kannst hier die Fehlerbehandlung ergänzen
  if (error) throw error;
};
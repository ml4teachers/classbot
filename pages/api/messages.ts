// pages/api/messages.js
import { get_encoding } from "tiktoken"; // Hypothetische Tokenisierungsbibliothek 
import { createServerClient, type CookieOptions, serialize } from "@supabase/ssr"
import { type NextApiRequest, type NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", serialize(name, value, options));
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    }
  );

  
  const { data: { user } } = await supabase.auth.getUser();

  // console.log('user:', user)

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  if (req.method === 'GET') {
    try {
      // Hole alle Chats inklusive Nachrichten von Supabase
      const { data: chats, error } = await supabase
        .from('Chat')
        .select('*, messages(*)');

      if (error) throw error;

      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving chats' });
    }
  } else if (req.method === 'POST') {
    const messages = Array.isArray(req.body) ? req.body : [req.body];

    try {
      const savedMessages: never[] = [];
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      for (const message of messages) {
        let chat = await supabase
          .from('Chat')
          .select('*')
          .eq('id', message.chatId)
          .single();

        if (!chat.data) {
          // Wenn kein Chat gefunden, erstelle ihn
          const { data: newChat, error: newChatError } = await supabase
            .from('Chat')
            .insert([
              { 
                id: message.chatId,
                userId: user.id,
              }
            ])
            .single();

          if (newChatError) throw newChatError;
          chat = newChat;
        }

        // Berechne Tokens
        const tokens = calculateTokens(message.text);

        // Token-Zählung nach Rolle
        if (message.role === 'user') {
          totalInputTokens += tokens;
        } else if (message.role === 'assistant') {
          totalOutputTokens += tokens;
        }

        // Nachricht speichern
        const { data: savedMessage, error } = await supabase
          .from('Message')
          .insert([
            {
              text: message.text,
              chatId: message.chatId,
              role: message.role,
              tokens,
            }
          ])
          .single();

        if (error) throw error;
        savedMessages.push(savedMessage);
      }

      // Token-Nutzung beim Nutzer aktualisieren
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('used_input_tokens, used_output_tokens')
        .eq('id', user.id) // Benutzer-ID anpassen
        .single();

      if (userError) throw userError;

      // Token-Nutzung aktualisieren
      const { error: updateUserError } = await supabase
        .from('User')
        .update({
          used_input_tokens: userData.used_input_tokens + totalInputTokens,
          used_output_tokens: userData.used_output_tokens + totalOutputTokens,
        })
        .eq('id', user.id); // Benutzer-ID anpassen

      if (updateUserError) throw updateUserError;

      res.status(201).json(savedMessages);
    } catch (error: any) {
      console.error('Fehler beim Speichern der Nachrichten:', error);
      res.status(500).json({ error: 'Ein Fehler ist aufgetreten', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

function calculateTokens(text: string) {
  const encoding = get_encoding("cl100k_base"); 
  const encodedText = encoding.encode(text); 
  encoding.free();
  return encodedText.length;
}

// pages/api/tokens.js
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

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // console.log('userId:', user?.id, 'userError:', userError)

  if (!user || userError) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const { data: existingUser, error: existingUserError } = await supabase
        .from('User')
        .select('id, used_input_tokens, used_output_tokens')
        .eq('id', user.id)
        .maybeSingle();

      // Wenn kein Benutzer gefunden wurde, erstelle einen neuen.
      if (!existingUser && !existingUserError) {
        const { data: newUser, error: newUserError } = await supabase
          .from('User')
          .insert([{ id: user.id, used_input_tokens: 0, used_output_tokens: 0 }])
          .single();

        if (newUserError) {
          console.error('Fehler beim Erstellen eines neuen Benutzers:', newUserError);
          res.status(500).json({ error: 'Fehler beim Erstellen eines neuen Benutzers', message: newUserError.message });
          return;
        }

        return;
      } else if (existingUserError) {
        // Wenn ein anderer Fehler auftritt, gebe ihn zurück.
        throw existingUserError;
      }

      // Wenn der Benutzer existiert, gebe die Token-Werte zurück.
      if (existingUser) {
        const { used_input_tokens, used_output_tokens } = existingUser;
        res.status(200).json({ used_input_tokens, used_output_tokens });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      console.error('Fehler beim Abrufen oder Erstellen der Benutzerdaten:', error);
      res.status(500).json({ error: 'Ein Fehler ist aufgetreten', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
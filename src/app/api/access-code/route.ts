import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Kein Zugangscode angegeben.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('access_codes')
      .select('*')
      .eq('code', code)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return NextResponse.json({ message: 'Ungültiger oder abgelaufener Zugangscode.' }, { status: 404 });
    }

    if (data.current_users >= data.max_users) {
      return NextResponse.json({ message: 'Maximale Anzahl von Nutzer:innen erreicht.' }, { status: 403 });
    }

    // Aktualisiere die Anzahl der aktuellen Nutzer:innen
    const { error: updateError } = await supabase
  .from('access_codes')
  .update({ current_users: data.current_users + 1 })
  .eq('id', data.id);

  if (updateError) {
    console.error('Fehler beim Aktualisieren von current_users:', updateError);
    return NextResponse.json({ message: 'Fehler beim Aktualisieren des Zugangscodes.' }, { status: 500 });
  }

    return NextResponse.json({ message: 'Zugangscode erfolgreich aktiviert.' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Interner Serverfehler.' }, { status: 500 });
  }
}
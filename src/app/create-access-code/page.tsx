'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CreateAccessCode = () => {
  const [maxUsers, setMaxUsers] = useState(25);
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Set default expiration to 24 hours from now
  useEffect(() => {
    const defaultExpiration = new Date();
    defaultExpiration.setHours(defaultExpiration.getHours() + 24);
    setExpiresAt(defaultExpiration.toISOString().slice(0, 16)); // Format: yyyy-MM-ddTHH:mm
  }, []);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase().replace(/[0O]/g, 'X'); // Avoids 0 and O
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const code = generateCode();
    const expirationDate = new Date(expiresAt);

    try {
      const { data, error } = await supabase.from('access_codes').insert({
        code,
        max_users: maxUsers,
        expires_at: expirationDate.toISOString(),
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      alert(`Zugangscode erstellt: ${code}`);
      router.push('/access-codes');
    } catch (error) {
      console.error('Fehler beim Erstellen des Codes:', error);
      alert('Fehler beim Erstellen des Codes. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mt-24 md:mt-36 mb-6 text-gray-900">
        Zugangscode erstellen
      </h1>
      <p className="mb-8 text-gray-600 text-center">
        Zugangscodes erlauben es Schülerinnen und Schülern, auf den Bot zuzugreifen, ohne sich anzumelden.
        Standardmässig ist der Zugangscode 24 Stunden gültig. Du kannst die Gültigkeitsdauer und die maximale Anzahl der Nutzer anpassen.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Maximale Anzahl Nutzer</Label>
          <Input
            id="maxUsers"
            type="number"
            value={maxUsers}
            onChange={(e) => setMaxUsers(parseInt(e.target.value))}
            min={1}
            max={35} // Restriction to a maximum of 35 users
            placeholder="Maximale Anzahl Nutzer"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Ablaufdatum</Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Erstellen...' : 'Zugangscode erstellen'}
        </Button>
      </form>
    </div>
  );
};

export default CreateAccessCode;
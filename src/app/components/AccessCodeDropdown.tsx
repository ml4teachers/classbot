'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AccessCodeDropdownProps {
  selectedCode: string | null;
  onCodeSelect: (code: string | null) => void;
}

const AccessCodeDropdown: React.FC<AccessCodeDropdownProps> = ({ selectedCode, onCodeSelect }) => {
  const supabase = createClient();
  const [accessCodes, setAccessCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccessCodes = async () => {
      setLoading(true);
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          console.error('Kein Benutzer angemeldet.');
          return;
        }

        const { data, error } = await supabase
          .from('access_codes')
          .select('code')
          .eq('created_by', user.id);

        if (error) throw error;

        setAccessCodes(data?.map((entry) => entry.code) || []);
      } catch (error) {
        console.error('Fehler beim Laden der Zugangscodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessCodes();
  }, [supabase]);

  return (
    <div className="space-y-2">
      <Label>Zugangscode zuweisen</Label>
      {loading ? (
        <p className="text-sm text-gray-500">Zugangscodes werden geladen...</p>
      ) : (
        <Select
          value={selectedCode || 'open'}
          onValueChange={(value: string) => onCodeSelect(value === 'open' ? null : value)}
        >
          <SelectTrigger id="accessCode" className="w-full">
            {selectedCode ? `Nur für Zugangscode: ${selectedCode}` : 'Offen für alle'}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Offen für alle</SelectItem>
            {accessCodes.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
            {accessCodes.length === 0 && (
              <SelectItem value="" disabled>
                Keine Zugangscodes gefunden
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default AccessCodeDropdown;
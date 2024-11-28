'use client';

import React, { useEffect, useState } from 'react';
import { ClipboardIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

const AccessCodesPage = () => {
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Fetch existing access codes created by the current user
  useEffect(() => {
    const fetchAccessCodes = async () => {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const { data, error } = await supabase
          .from('access_codes')
          .select('*')
          .eq('created_by', user.id)
          .order('expires_at', { ascending: true });

        if (error) {
          console.error('Fehler beim Abrufen der Zugangscodes:', error);
        } else {
          setAccessCodes(data || []);
        }
      }
      setLoading(false);
    };

    fetchAccessCodes();
  }, [supabase]);

  // Delete an access code
  const deleteAccessCode = async (codeId: string) => {
    if (!confirm('Möchtest du diesen Zugangscode wirklich löschen?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', codeId);

      if (error) throw error;

      setAccessCodes((prevCodes) => prevCodes.filter((code) => code.id !== codeId));
      alert('Zugangscode erfolgreich gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Zugangscodes:', error);
      alert('Fehler beim Löschen des Codes. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Reset current users for an access code
  const resetCurrentUsers = async (codeId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('access_codes')
        .update({ current_users: 0 })
        .eq('id', codeId);

      if (error) throw error;

      setAccessCodes((prevCodes) =>
        prevCodes.map((code) =>
          code.id === codeId ? { ...code, current_users: 0 } : code
        )
      );
      alert('Nutzerzahlen erfolgreich zurückgesetzt.');
    } catch (error) {
      console.error('Fehler beim Zurücksetzen der Nutzerzahlen:', error);
      alert('Fehler beim Zurücksetzen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the "Create Access Code" page
  const handleCreateNewCode = () => {
    router.push('/create-access-code');
  };

  // Copy access code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Zugangscode in die Zwischenablage kopiert!');
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Zugangscodes verwalten</CardTitle>
          <CardDescription>
            Erstelle und verwalte Zugangscodes für deine Klasse. Du kannst die aktuellen Nutzerzahlen
            zurücksetzen oder Zugangscodes löschen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Lade Zugangscodes...</p>
          ) : accessCodes.length === 0 ? (
            <p>Du hast noch keine Zugangscodes erstellt.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="text-left">Code</TableCell>
                  <TableCell className="text-left">Max. Nutzer</TableCell>
                  <TableCell className="text-left">Aktuelle Nutzer</TableCell>
                  <TableCell className="text-left">Verfügbar bis</TableCell>
                  <TableCell className="text-left">Löschen</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="flex items-center gap-2">
                      {code.code}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code.code)}
                      >
                        <ClipboardIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-left">{code.max_users}</TableCell>
                    <TableCell className="flex items-center gap-2 text-left">
                      {code.current_users}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetCurrentUsers(code.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-left">
                      {new Date(code.expires_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-left">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAccessCode(code.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex mb-4 mt-8">
            <Button className="bg-slate-50 text-gray-600 border hover:bg-slate-100" onClick={handleCreateNewCode}>Neuen Zugangscode erstellen</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessCodesPage;
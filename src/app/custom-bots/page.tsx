'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface CustomBot {
  id: string;
  name: string;
  description: string;
  accessCode: string | null;
  userId: string;
}

export default function CustomBotsPage() {
  const supabase = createClient();
  const [customBots, setCustomBots] = useState<CustomBot[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const fetchCustomBots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Chat')
        .select('*')
        .eq('userId', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      setCustomBots(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der CustomBots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomBots();
  }, []);

  const handleCreateNewBot = () => {
    router.push('./create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchtest du diesen Bot wirklich löschen?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('Chat').delete().eq('id', id);
      if (error) throw error;
      setCustomBots((prev) => prev.filter((bot) => bot.id !== id));
      alert('Bot erfolgreich gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Bots:', error);
      alert('Fehler beim Löschen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bot: CustomBot) => {
    window.location.href = `/create?edit=${encodeURIComponent(JSON.stringify(bot))}`;
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>CustomBots verwalten</CardTitle>
          <CardDescription>
            Hier siehst du eine Übersicht aller von dir erstellten Bots. Du kannst die Bots bearbeiten
            oder löschen. Falls ein Bot mit einem Zugangscode verbunden ist, wird dieser ebenfalls angezeigt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center text-gray-600">Laden...</p>}
          {!loading && customBots.length === 0 && (
            <p className="text-center text-gray-600">Keine CustomBots gefunden.</p>
          )}
          {!loading && customBots.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="text-center">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customBots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell>{bot.name}</TableCell>
                    <TableCell>{bot.description}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full">
                            Bearbeiten
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(bot)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(bot.id)}
                            className="text-red-600"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex mb-4 mt-8">
            <Button className="bg-slate-50 text-gray-600 border hover:bg-slate-100" onClick={handleCreateNewBot}>Neuen CustomBot erstellen</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AccessCodeDropdown from '@/app/components/AccessCodeDropdown';

const CreateBotPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [initialAnswer, setInitialAnswer] = useState('');
  const [activateImmediately, setActivateImmediately] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [minStartTime, setMinStartTime] = useState('');
  const [assignedAccessCode, setAssignedAccessCode] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const now = new Date();
    setStartTime(now.toISOString().slice(0, 16));
    setMinStartTime(now.toISOString().slice(0, 16));

    const searchParams = new URLSearchParams(window.location.search);
    const editParam = searchParams.get('edit');
    if (editParam) {
      const botData = JSON.parse(decodeURIComponent(editParam));
      setName(botData.name);
      setDescription(botData.description);
      setInitialPrompt(botData.initialPrompt);
      setInitialAnswer(botData.initialAnswer);
      setStartTime(new Date(botData.startTime).toISOString().slice(0, 16));
      setDuration(Math.ceil((new Date(botData.expiration).getTime() - new Date(botData.startTime).getTime()) / (1000 * 60 * 60)));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const startDate = activateImmediately ? now : new Date(startTime);
    const expirationDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

    try {
      const { data, error } = await supabase.from('Chat').insert({
        name,
        description,
        initialPrompt,
        initialAnswer,
        startTime: startDate.toISOString(),
        expiration: expirationDate.toISOString(),
        createdAt: now.toISOString(),
        accessCode: assignedAccessCode,
      });

      if (error) {
        console.error('Supabase-Fehler:', error);
        throw error;
      }

      alert('Bot erfolgreich erstellt!');
      router.push('/custom-bots');
    } catch (error) {
      console.error('Fehler beim Erstellen des Bots:', error);
      alert('Es gab einen Fehler beim Erstellen des Bots.');
    }
  };

  const handleCancel = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const editParam = searchParams.get('edit');
  
    if (editParam) {
      try {
        const botData = JSON.parse(decodeURIComponent(editParam));
        const { error } = await supabase.from('Chat').delete().eq('id', botData.id);
  
        if (error) {
          console.error('Fehler beim Löschen des Bots:', error);
          alert('Es gab einen Fehler beim Löschen des Bots. Bitte versuche es erneut.');
          return;
        }
  
        alert('Der Bot wurde erfolgreich gelöscht.');
      } catch (err) {
        console.error('Fehler beim Verarbeiten des Bots:', err);
      }
    }
  
    router.push('/custom-bots');
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, maxLength: number) => {
    if (value.length <= maxLength) {
      setter(value);
    } else {
      alert(`Maximale Länge von ${maxLength} Zeichen erreicht.`);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Erstelle deinen eigenen Bot</CardTitle>
          <CardDescription>
            Erstelle hier deinen eigenen Chatbot. Fülle die Felder aus, um einen Bot zu konfigurieren,
            der genau auf deine Bedürfnisse zugeschnitten ist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Wie heisst dein Bot? ({name.length}/30)</p>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange(setName, e.target.value, 30)}
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Beschreibe deinen Bot in einem Satz. ({description.length}/100)</p>
              <input
                type="text"
                value={description}
                onChange={(e) => handleInputChange(setDescription, e.target.value, 100)}
                placeholder="Beschreibung"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Wie soll dein Bot auf den User reagieren? ({initialPrompt.length}/10000)</p>
              <textarea
                value={initialPrompt}
                onChange={(e) => handleInputChange(setInitialPrompt, e.target.value, 10000)}
                placeholder="Initialer Prompt"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                required
              ></textarea>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Welche Begrüssung soll dein Bot dem User geben? ({initialAnswer.length}/500)</p>
              <input
                type="text"
                value={initialAnswer}
                onChange={(e) => handleInputChange(setInitialAnswer, e.target.value, 500)}
                placeholder="Begrüssungstext"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={activateImmediately}
                  onChange={(e) => setActivateImmediately(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Bot sofort aktivieren</span>
              </label>
            </div>
            {!activateImmediately && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Wann soll der Bot aktiviert werden?</p>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  min={minStartTime}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Wie lange soll der Bot erreichbar sein? (max 24h)</p>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.min(Math.max(1, parseInt(e.target.value)), 24))}
                min="1"
                max="24"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <AccessCodeDropdown
              selectedCode={assignedAccessCode}
              onCodeSelect={(code) => setAssignedAccessCode(code)}
            />
            <div className="flex space-x-4">
              <button type="submit" className="flex-1 px-4 py-2 text-white bg-slate-600 rounded-md hover:bg-slate-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Erstellen</button>
              <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Löschen und zurück</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBotPage;
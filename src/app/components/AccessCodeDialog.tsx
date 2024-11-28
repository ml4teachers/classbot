'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';

interface AccessCodeDialogProps {
  onAccessGranted: () => void; // Callback-Funktion, um `isAccessGranted` zu aktualisieren
}

const AccessCodeDialog: React.FC<AccessCodeDialogProps> = ({ onAccessGranted }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccessCodeSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Fehler bei der Aktivierung des Codes.');
      }
  
      // Zugangscode speichern, falls noch nicht vorhanden
      if (!localStorage.getItem('accessCode')) {
        localStorage.setItem('accessCode', accessCode);
      }
  
      // Zustand aktualisieren
      onAccessGranted();
      alert('Zugangscode erfolgreich aktiviert.');
      setDialogOpen(false);
    } catch (error: any) {
      alert(error.message || 'Ungültiger Zugangscode oder maximale Anzahl von Nutzer:innen erreicht.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button className="text-blue-600 underline visited:text-purple-600">
          Zugangscode
        </button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-bold mb-4">Zugangscode eingeben</h2>
        <p className="text-sm mb-4 text-gray-600">
          Gib den Zugangscode ein, der dir von deiner Lehrperson mitgeteilt wurde. Zugangscodes sind
          zeitlich begrenzt und können nur von einer begrenzten Anzahl von Nutzer:innen verwendet werden.
        </p>
        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Zugangscode"
        />
        <button
          onClick={handleAccessCodeSubmit}
          className={`mt-4 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Prüfen...' : 'Aktivieren'}
        </button>
        <DialogClose asChild>
          <button className="mt-4 w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
            Abbrechen
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AccessCodeDialog;
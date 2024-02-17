// src/components/SpeakerButton.tsx


import React from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'; // Stelle sicher, dass du das korrekte Icon-Paket importierst

interface SpeakerButtonProps {
  textToSpeak: string;
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({ textToSpeak }) => {
  const handleSpeakClick = async () => {
  try {
    const response = await fetch('/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textToSpeak }),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Sprachausgabe');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Fehler beim Vorlesen des Textes:', error);
  }
};

return (
  <SpeakerWaveIcon className="w-7 h-7 cursor-pointer mt-1 text-gray-300 p-1 hover:text-gray-500" onClick={handleSpeakClick} />
);
};

export default SpeakerButton;
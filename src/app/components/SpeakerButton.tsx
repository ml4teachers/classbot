// src/components/SpeakerButton.tsx


import React, { useState, useRef, useEffect } from 'react';
import { SpeakerWaveIcon, PauseCircleIcon } from '@heroicons/react/24/outline';

interface SpeakerButtonProps {
  textToSpeak: string;
}

interface Expert {
  name: string;
  description: string;
  imageUrl: string;
  initialPrompt: string;
  initialAnswer: string;
  voice: string;
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({ textToSpeak }) => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Auslesen der Expertendaten aus dem localStorage
    const expertData = localStorage.getItem('selectedExpert');
    if (expertData) {
      setExpert(JSON.parse(expertData) as Expert);
    }
  }, []);

  const handleAudioPlay = async () => {
    if (!audioRef.current) {
      try {
        const response = await fetch('/api/speak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textToSpeak, voice: expert?.voice }),
        });

        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Sprachausgabe');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setIsFinished(true);
        };
      } catch (error) {
        console.error('Fehler beim Vorlesen des Textes:', error);
        return;
      }
    }

    if (audioRef.current.paused && !isFinished) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (isFinished) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setIsFinished(false);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <button onClick={handleAudioPlay} className="w-7 h-7 mt-1 text-gray-300 p-1 hover:text-gray-500">
      {isPlaying ? (
        <PauseCircleIcon />
      ) : (
        <SpeakerWaveIcon />
      )}
    </button>
  );
};


export default SpeakerButton;
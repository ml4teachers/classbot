// src/components/InputBar.tsx

import React, { useEffect, useRef, useState } from 'react';
import autosize from 'autosize';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import RecordButton from './RecordButton';
import Link from 'next/link';

const schimpfwortliste = ['assi', 'anal', 'missi', 'arsch', 'möse', 'bastard', 'mutterficker', 'bimbo', 'homo', 'tunte', 'assel', 'cock', 'nigger', 'neger', 'mongo', 'fick', 'ficken', 'hure', 'hurensohn'];

interface InputBarProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputUpdate: (newInput: string) => void;
}

const DEBOUNCE_TIME = 3000; // Mindestzeit zwischen zwei Nachrichten in Millisekunden

const InputBar: React.FC<InputBarProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleInputUpdate,
}) => {
  const textareaRef = useRef(null);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);

      return () => {
        if (textareaRef.current) {
          autosize.update(textareaRef.current);
        }
      };
    }
  }, [input]);

  const containsSchimpfwort = (message: string) => {
    const lowercasedMessage = message.toLowerCase();
    return schimpfwortliste.some(word => new RegExp(`\\b${word}\\b`).test(lowercasedMessage));
  };

  const handleAudioTranscription = async (audioBlob: Blob) => {
    console.log('AudioBlob:', audioBlob);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.mp3');
      console.log('FormData File:', formData.get('file'));

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('Transkriptionsergebnis:', result);

      handleInputUpdate(result.text);
      if (textareaRef.current) {
        autosize.update(textareaRef.current);
      }
    } catch (error) {
      console.error('Fehler bei der Audio-Transkription:', error);
    }
  };

  const validateAndSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = Date.now();

    if (now - lastMessageTime < DEBOUNCE_TIME) {
      alert('Du sendest Nachrichten zu schnell hintereinander. Bitte warte einen Moment.');
      return;
    }

    if (containsSchimpfwort(input)) {
      alert('Die Nachricht enthält unangemessene Sprache. Bitte formuliere sie anders.');
      return;
    }

    setLastMessageTime(now);
    handleSendMessage(e);
  };

  return (
    <div className="fixed bottom-0 pb-2 right-0 w-full z-10 bg-white px-2 md:px-0">
      <form className="flex justify-between items-end w-full max-w-screen-md mx-auto left-0 right-0" onSubmit={validateAndSendMessage}>
        <div className="flex-grow border rounded-3xl flex items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 resize-none ml-4 my-3 overflow-y-scroll max-h-96 focus:outline-none"
            placeholder="Schreibe eine Nachricht..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                validateAndSendMessage(e as any);
              }
            }}
          />
          <div className="flex items-center">
            <RecordButton onAudioRecorded={handleAudioTranscription} />
          </div>
          {input.length > 0 &&
          <button type="submit" className="m-1 p-2 rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 hover:bg-slate-200 justify-end">
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
          }
        </div>
      </form>
      <p className="text-center text-xs text-gray-400 mt-2">
        Classbot kann Fehler machen. Teile keine persönlichen Informationen. Weitere Informationen findest du
        <Link href="/about" className="text-blue-600 visited:text-purple-600"> hier</Link>
        .
      </p>
    </div>
  );  
};

export default InputBar;
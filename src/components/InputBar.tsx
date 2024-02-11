// src/components/InputBar.tsx

import React, { useEffect, useRef } from 'react';
import autosize from 'autosize';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import RecordButton from './RecordButton';


interface InputBarProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputUpdate: (newInput: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleInputUpdate,
}) => {

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current); // Initialisieren von autosize beim ersten Render
  
      // Dieser Effekt wird jedes Mal aufgerufen, wenn sich der `input` ändert
      return () => {
        if (textareaRef.current) {
          autosize.update(textareaRef.current); // Update von autosize, wenn sich der Inhalt ändert
        }
      };
    }
  }, [input]); // Abhängigkeiten-Array enthält `input`, sodass der Effekt bei Änderung ausgeführt wird
  

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

  return (
    <div className="fixed bottom-0 pb-8 right-0 w-full z-10 bg-white">
    <form className="flex justify-between items-center w-full max-w-screen-md mx-auto left-0 right-0" onSubmit={handleSendMessage}>
        <div className="flex-grow border rounded-3xl flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 resize-none ml-4 my-1 overflow-hidden focus:outline-none"
            placeholder="Schreibe eine Nachricht..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
          />
          <div className="flex items-center">
            <RecordButton onAudioRecorded={handleAudioTranscription} />
          </div>
        </div>
        <button type="submit" className="ml-2 flex-shrink-0">
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );  
};

export default InputBar;
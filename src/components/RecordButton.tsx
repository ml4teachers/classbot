// src/components/RecordButton.tsx

import React, { useState } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

interface RecordButtonProps {
  onAudioRecorded: (audioBlob: Blob) => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      let chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        onAudioRecorded(audioBlob);
        chunks = [];
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Fehler beim Starten der Aufnahme:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 text-gray-500 m-1 ${
        isRecording ? 'bg-gray-300 text-gray-800' : ''
      }`}
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={stopRecording} // Füge dies hinzu, falls der Nutzer die Maus wegbewegt
    >
      <MicrophoneIcon className="w-6 h-6" />
    </div>
  );
};

export default RecordButton;

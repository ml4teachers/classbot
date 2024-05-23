import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { CameraIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const WebcamCapture: React.FC<{ onCapture: (imageSrc: string) => void; onDelete: () => void; onSend: (imageMessage: any) => void; }> = ({ onCapture, onDelete, onSend }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const resetCapture = () => {
    onDelete();
    setCapturedImage(null);
  };

  const sendCapture = async () => {
    if (!capturedImage) return;
    
    const imageMessage = {
      role: 'user',
      content: [
        { type: 'text', text: 'Beschreibe das Bild im Detail.' },
        { type: 'image_url', image_url: capturedImage },
      ],
    };

    onSend(imageMessage);
    resetCapture();
  };

  return (
    <div className="sm:border rounded-3xl sm:w-1/2 flex flex-col items-center justify-center mx-auto mt-8">
      {capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured" className="p-4 w-full max-w-[560px]" />
          <div>
            <button onClick={sendCapture} className="text-white rounded-full mt-2">
              <PaperAirplaneIcon className="w-10 h-10 p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 text-gray-500 hover:text-gray-700 mb-4" />
            </button>
            <button onClick={resetCapture} className="text-white rounded-full mt-2">
              <TrashIcon className="w-10 h-10 p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 text-gray-500 hover:text-gray-700 mb-4" />
            </button>
          </div>
        </>
      ) : (
        <>
          <Webcam
            className="w-full max-w-[560px] p-4"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          <button onClick={capture} className="rounded-full mt-2">
            <CameraIcon className="w-10 h-10 p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 text-gray-500 hover:text-gray-700 mb-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;

import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';

const ImageUpload: React.FC<{ onSendImage: (imageMessage: any) => void }> = ({ onSendImage }) => {
  const [image, setImage] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  const handleCapture = async (imageSrc: string) => {
    setImage(imageSrc);
    const fileUrl = await handleSendImage(imageSrc);
    setFilePath(fileUrl);
    console.log('Image uploaded:', fileUrl)
  };

  const handleSendImage = async (imageSrc: string) => {
    try {
      const formData = new FormData();
      formData.append('file', dataURItoBlob(imageSrc), 'image.jpg');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Fehler beim Hochladen des Bildes');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.fileUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleDeleteImage = async () => {
    if (filePath) {
      try {
        const response = await fetch('/api/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        });

        if (!response.ok) {
          throw new Error('Fehler beim Löschen des Bildes');
        }

        const result = await response.json();
        console.log('Delete successful:', result);
        setImage(null);
        setFilePath(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    } else {
      setImage(null);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="flex flex-col items-center">
      <WebcamCapture onCapture={handleCapture} onDelete={handleDeleteImage} onSend={onSendImage} />
    </div>
  );
};

export default ImageUpload;

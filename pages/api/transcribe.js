// pages/api/transcribe.js

import { IncomingForm } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Fehler beim Verarbeiten der Formulardaten:', err);
        return res.status(500).json({ message: 'Fehler beim Verarbeiten der Formulardaten', error: err.message });
      }

      try {
        // Stelle sicher, dass die Datei existiert
        if (!files.file || files.file.length === 0) {
          return res.status(400).json({ message: 'Keine Datei hochgeladen.' });
        }
  
        const audioFile = files.file[0];
        const audioStream = fs.createReadStream(audioFile.filepath);

        const formData = new FormData();
        formData.append('file', audioStream, { filename: 'audio.mp3', contentType: 'audio/mp3' });
        formData.append('model', 'whisper-1');
        formData.append('voice', 'echo');

        const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            ...formData.getHeaders(),
          },
          body: formData,
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          throw new Error(errorText);
        }

        const transcription = await openaiResponse.json();
        res.status(200).json(transcription);
      } catch (error) {
        console.error('Fehler beim Senden der Transkriptionsanfrage:', error);
        res.status(500).json({ message: 'Ein Fehler ist aufgetreten', error: error.message });
      }
    });
  } else {
    res.status(405).end('Nur POST-Anfragen sind erlaubt');
  }
}

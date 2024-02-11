// api/speak.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, voice = 'nova' } = req.body;

    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: voice
        }),
      });

      if (!openaiResponse.ok) {
        // Wenn OpenAI einen Fehler zurückgibt, diesen als Text weiterleiten
        const errorText = await openaiResponse.text();
        console.error('OpenAI error:', errorText);
        return res.status(openaiResponse.status).json({ error: errorText });
      }

      // Abrufen des binären Inhalts der Antwort und an den Client senden
      const buffer = await openaiResponse.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Fehler beim Senden der Text-zu-Sprache-Anfrage:', error);
      return res.status(500).json({ message: 'Ein Fehler ist aufgetreten' });
    }
  } else {
    return res.status(405).end('Methode nicht erlaubt');
  }
}

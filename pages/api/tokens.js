// pages/api/tokens.js
import prisma from '../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Angenommen, du hast einen Benutzer mit id = 1
      const user = await prisma.user.findUnique({
        where: {
          id: 1, // Anpassen an die tatsächliche Benutzer-ID
        },
      });
      const { used_input_tokens, used_output_tokens } = user;
      res.status(200).json({ used_input_tokens, used_output_tokens });
    } catch (error) {
      console.error('Fehler beim Abrufen der Token-Daten:', error);
      res.status(500).json({ error: 'Ein Fehler ist aufgetreten', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// pages/api/messages.js
import prisma from '../../prismaClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const chats = await prisma.chat.findMany({
        include: {
          messages: true,
        },
      });
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving chats' });
    }
  } else if (req.method === 'POST') {
    const messages = Array.isArray(req.body) ? req.body : [req.body];

    try {
      const savedMessages = await Promise.all(messages.map(async (message) => {
        // Versuche, den Chat mit der gegebenen ID zu finden
        let chat = await prisma.chat.findUnique({
          where: { id: message.chatId },
        });

        // Wenn kein Chat gefunden wurde, erstelle einen neuen Chat
        if (!chat) {
          chat = await prisma.chat.create({
            data: {
              id: message.chatId,
              userId: 1, // Anpassen an die tatsächliche Benutzerlogik
            },
          });
        }

        // Speichere die Nachricht im gefundenen oder neu erstellten Chat
        return prisma.message.create({
          data: {
            chatId: chat.id,
            text: message.text,
            role: message.role,
          },
        });
      }));

      res.status(201).json(savedMessages);
    } catch (error) {
      console.error('Fehler beim Speichern der Nachrichten:', error);
      res.status(500).json({ error: 'Ein Fehler ist aufgetreten', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

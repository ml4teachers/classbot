// pages/api/chats/[chatId].js
import prisma from '../../../prismaClient';

export default async function handler(req, res) {
  const { chatId } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Lösche zuerst alle Nachrichten des Chats
      await prisma.message.deleteMany({
        where: {
          chatId: chatId,
        },
      });

      // Lösche anschließend den Chat selbst
      await prisma.chat.delete({
        where: {
          id: chatId,
        },
      });

      res.status(200).json({ message: 'Chat erfolgreich gelöscht' });
    } catch (error) {
      console.error('Fehler beim Löschen des Chats:', error);
      res.status(500).json({ error: 'Ein Fehler ist aufgetreten', message: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: true,
        },
      });

      if (chat) {
        res.status(200).json(chat);
      } else {
        res.status(404).json({ error: 'Chat nicht gefunden' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen des Chats' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Methode ${req.method} nicht erlaubt` });
  }
}

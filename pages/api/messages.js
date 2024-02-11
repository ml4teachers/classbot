// api/messages.js
import prisma from '../../prismaClient';
import { get_encoding } from "tiktoken";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const messages = Array.isArray(req.body) ? req.body : [req.body];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    const savedMessages = [];
    for (const message of messages) {
      let chat = await prisma.chat.findUnique({ where: { id: message.chatId } });
      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            id: message.chatId,
            userId: 1, // Anpassen an die tatsächliche Benutzerlogik
          },
        });
      }

      // Tokens zählen
      const tokens = calculateTokens(message.text);

      // Unterscheidung zwischen Eingabe und Ausgabe, um die Token-Nutzung zu kategorisieren
      if (message.role === 'user') {
        totalInputTokens += tokens;
      } else if (message.role === 'assistant') {
        totalOutputTokens += tokens;
      }

      const savedMessage = await prisma.message.create({
        data: {
          text: message.text,
          chatId: chat.id,
          role: message.role,
          tokens,
        },
      });
      savedMessages.push(savedMessage);
    }

    await prisma.user.update({
      where: { id: 1 }, // Hier ggf. die Benutzerzuordnung anpassen
      data: {
        used_input_tokens: { increment: totalInputTokens },
        used_output_tokens: { increment: totalOutputTokens },
      },
    });
    // console.log('Total input tokens:', totalInputTokens, 'Total output tokens:', totalOutputTokens);

    res.status(201).json(savedMessages);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

function calculateTokens(text) {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
}

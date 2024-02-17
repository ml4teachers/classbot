// pages/api/chats/[chatId].js

// Beschreibung des Codes:
// Die API-Routen in Next.js sind Dateien, die in einem speziellen Verzeichnis pages/api liegen.
// In diesem Fall handelt es sich um eine dynamische Route, die den Chat anhand der chatId aus der Datenbank abruft.
// Die chatId wird aus der URL-Struktur extrahiert und als Parameter an die API-Routen-Funktion übergeben.
// Die Funktion prüft, ob die Anfrage eine GET-Anfrage ist. In diesem Fall wird der Chat aus der Datenbank abgerufen und zurückgegeben.
// Wenn die Anfrage eine DELETE-Anfrage ist, werden zuerst alle Nachrichten des Chats gelöscht und anschließend der Chat selbst.
// Die Funktion verwendet die Prisma-Client-Bibliothek, um auf die Datenbank zuzugreifen.

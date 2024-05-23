import fs from 'fs';
import path from 'path';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { filePath } = req.body;

  if (!filePath) {
    res.status(400).json({ message: 'No file path provided' });
    return;
  }

  const absolutePath = path.join(process.cwd(), 'public', filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      res.status(500).json({ message: 'Error deleting file' });
      return;
    }

    res.status(200).json({ message: 'File deleted successfully' });
  });


};

export default handler;

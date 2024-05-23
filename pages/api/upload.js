import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const uploadDir = path.join(process.cwd(), 'public/data');
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      return `${Date.now()}_${part.originalFilename}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(500).json({ message: 'Error parsing form' });
      return;
    }

    const file = files.file[0]; // Adjust this line to access the correct file object
    if (!file) {
      console.log('No file uploaded');
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const fileUrl = `/data/${file.newFilename}`;
    res.status(200).json({ fileUrl });
  });


};

export default handler;

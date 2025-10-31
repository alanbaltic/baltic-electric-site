import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { pool, ensureSchema } from './db.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL ? undefined : process.env.CLOUDINARY_CLOUD_NAME,
});
// CLOUDINARY_URL env var will be auto-read by SDK if present (recommended).

export const config = {
  api: { bodyParser: false }
};

function checkAuth(req) {
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev_secret_change_me';
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['be_admin'];
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await ensureSchema();

    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(400).json({ error: 'Bad form data' });
      }

      const section = String(fields.section || 'work');
      const title = String(fields.title || '');
      const caption = String(fields.caption || '');
      const file = files.file;

      if (!file) return res.status(400).json({ error: 'No file uploaded' });

      try {
        const up = await cloudinary.uploader.upload(file.filepath, {
          folder: 'baltic-electric',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });

        // determine next position in section
        const { rows } = await pool.query(
          'SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM gallery_images WHERE section=$1',
          [section]
        );
        const position = rows[0]?.next_pos ?? 0;

        const insert = await pool.query(
          'INSERT INTO gallery_images(section,title,caption,image_url,public_id,position) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
          [section, title, caption, up.secure_url, up.public_id, position]
        );

        return res.status(200).json({ ok: true, image: insert.rows[0] });
      } catch (e) {
        console.error('Upload/store error:', e);
        return res.status(500).json({ error: 'Upload failed' });
      }
    });
  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

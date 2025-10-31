import { pool, ensureSchema } from './db.js';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

function isAuthed(req) {
  try {
    const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev_secret_change_me';
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['be_admin'];
    if (!token) return false;
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    const section = req.query.section || null;
    if (section) {
      const { rows } = await pool.query(
        'SELECT * FROM gallery_images WHERE section=$1 ORDER BY position ASC, created_at DESC',
        [section]
      );
      return res.status(200).json({ images: rows });
    } else {
      const { rows } = await pool.query(
        'SELECT * FROM gallery_images ORDER BY section ASC, position ASC, created_at DESC'
      );
      return res.status(200).json({ images: rows });
    }
  }

  if (req.method === 'POST') {
    // reorder: [{id, position}, ...]
    if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const body = req.body;
      if (!Array.isArray(body)) return res.status(400).json({ error: 'Expected array' });
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const item of body) {
          await client.query('UPDATE gallery_images SET position=$1 WHERE id=$2', [item.position, item.id]);
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK'); throw e;
      } finally {
        client.release();
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('Reorder error:', e);
      return res.status(500).json({ error: 'Failed to reorder' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

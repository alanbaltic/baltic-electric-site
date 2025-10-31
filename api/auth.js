import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev_secret_change_me';

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'POST') {
    const { username, password } = req.body || {};
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ u: username }, JWT_SECRET, { expiresIn: '2d' });
      res.setHeader('Set-Cookie', cookie.serialize('be_admin', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 2 * 24 * 60 * 60
      }));
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (method === 'GET') {
    // /api/auth?me=1  → check session
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies['be_admin'];
      if (!token) throw new Error('No token');
      jwt.verify(token, JWT_SECRET);
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(401).json({ ok: false });
    }
  }

  if (method === 'DELETE') {
    // logout
    res.setHeader('Set-Cookie', cookie.serialize('be_admin', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    }));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id SERIAL PRIMARY KEY,
      section TEXT NOT NULL,       -- e.g., 'mission' | 'expertise' | 'quality' | 'work'
      title TEXT,
      caption TEXT,
      image_url TEXT NOT NULL,
      public_id TEXT,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

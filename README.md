# Baltic Electric — Vercel-only App

This repository contains a complete Vercel app with:
- Admin login (JWT cookie)
- Photo uploads to Cloudinary
- Metadata persisted in Neon PostgreSQL
- Drag/drop reordering in admin
- Public gallery consuming /api/gallery
- Email send API using Microsoft 365 SMTP

## Quick Start

1) Create a new GitHub repo (or use existing) and upload all files.
2) On Vercel, import the repo.
3) Set Environment Variables (Project Settings → Environment Variables):

- CLOUDINARY_URL = cloudinary://<api_key>:<api_secret>@<cloud_name>
- DATABASE_URL   = postgres://... (Neon connection string)
- ADMIN_USER     = balticelectric
- ADMIN_PASS     = 
- ADMIN_JWT_SECRET = set_a_long_random_string
- SMTP_HOST      = smtp.office365.com
- SMTP_PORT      = 587
- SMTP_USER      = admin@balticelectric.com
- SMTP_PASS      = <your app password>

4) Deploy.

### Local dev (optional)
Vercel CLI recommended:
- `npm i -g vercel`
- `vercel dev`


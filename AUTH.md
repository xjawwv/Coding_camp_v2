# Authentication Setup

Project ini menggunakan PostgreSQL 16 dan session cookie HTTP-only.

1. Buat database PostgreSQL 16 bernama `coding_camp`.
2. Salin `.env.example` menjadi `.env` lalu sesuaikan `DATABASE_URL`.
3. Jalankan schema dengan `psql "$DATABASE_URL" -f database/schema.sql`.
4. Jalankan aplikasi dengan `npm run dev`.

Endpoint yang tersedia:

- `POST /api/auth/register` dengan `name`, `email`, `password`.
- `POST /api/auth/login` dengan `email`, `password`.
- `POST /api/auth/logout`.
- `GET /api/auth/me`.

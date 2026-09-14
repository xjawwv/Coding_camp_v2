# Authentication Setup

Project ini menggunakan MySQL dan session cookie HTTP-only.

1. Pastikan MySQL berjalan dan buat database `coding_camp`.
2. Salin `.env.example` menjadi `.env` lalu sesuaikan `DATABASE_URL`.
3. Jalankan schema dengan `mysql -u root -p < database/schema.sql`.
4. Jalankan aplikasi dengan `npm run dev`.

Endpoint yang tersedia:

- `POST /api/auth/register` dengan `name`, `email`, `password`.
- `POST /api/auth/login` dengan `email`, `password`.
- `POST /api/auth/logout`.
- `GET /api/auth/me`.

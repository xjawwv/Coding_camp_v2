# Authentication API

Autentikasi menggunakan MySQL 9.6.0, session token acak, dan cookie `cc_session` HTTP-only. Request body menggunakan JSON dan query database menggunakan parameter terpisah (`?`).

## Setup

1. Pastikan MySQL 9.6.0 berjalan.
2. Jalankan schema dengan `mysql -u root -p < database/schema.sql`.
3. Untuk database existing, jalankan `mysql -u root -p < database/migrate-admin.sql`.
4. Salin `.env.example` menjadi `.env` dan sesuaikan `DATABASE_URL`.
5. Jalankan aplikasi dengan `npm run dev`.

Verifikasi versi server:

```bash
mysql --version
mysql -u root -p -e "SELECT VERSION();"
```

## Endpoints

### Register

`POST /api/auth/register`

```json
{
  "name": "Felix Juan",
  "email": "felix@example.com",
  "password": "password123"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "felix@example.com",
  "password": "password123"
}
```

Login dan register mengembalikan user publik tanpa password hash. Session dikirim melalui header `Set-Cookie`, bukan response JSON.

### Current User

`GET /api/auth/me`

Mengembalikan `{ "user": { ... } }` jika cookie session valid, atau `{ "user": null }` jika belum login.

### Logout

`POST /api/auth/logout`

Menghapus session dari database dan cookie `cc_session`.

## Session Security

- Cookie bernama `cc_session`.
- `HttpOnly` mencegah JavaScript membaca token.
- `SameSite=Lax` mengurangi risiko CSRF.
- `Secure` aktif otomatis pada production HTTPS.
- Masa berlaku session 30 hari.
- Database menyimpan hash SHA-256 token, bukan token asli.

Tidak mengembalikan `session_id` atau token pada JSON adalah keputusan keamanan yang disengaja.

## Error Codes

- `400`: body tidak valid atau password kurang dari 8 karakter.
- `401`: email atau password salah.
- `409`: email sudah terdaftar.
- `500`: kegagalan internal server atau database.

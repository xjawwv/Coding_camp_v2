# Authentication API

Autentikasi menggunakan MySQL, session token acak, dan cookie `cc_session` HTTP-only. Request body menggunakan JSON. Query database menggunakan parameter terpisah (`?`), bukan string interpolation.

## Setup

1. Pastikan MySQL berjalan.
2. Buat database dan tabel:

```bash
mysql -u root -p < database/schema.sql
```

3. Salin `.env.example` menjadi `.env`.
4. Sesuaikan koneksi database pada `.env`:

```env
DATABASE_URL=mysql://root:password@localhost:3306/coding_camp
```

5. Jalankan aplikasi:

```bash
npm run dev
```

## Register

`POST /api/auth/register`

Request header:

```http
Content-Type: application/json
```

Request body:

```json
{
  "name": "Felix Juan",
  "email": "felix@example.com",
  "password": "password123"
}
```

Response `201` atau `200`:

```json
{
  "user": {
    "id": "uuid",
    "name": "Felix Juan",
    "email": "felix@example.com"
  }
}
```

Server juga mengirimkan header `Set-Cookie`:

```http
Set-Cookie: cc_session=<random-token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000
```

Password hash dan session token tidak pernah dikirim dalam response JSON.

## Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "felix@example.com",
  "password": "password123"
}
```

Response berhasil:

```json
{
  "user": {
    "id": "uuid",
    "name": "Felix Juan",
    "email": "felix@example.com"
  }
}
```

Response error password atau email salah, tanpa stack trace:

```json
{
  "error": true,
  "message": "Email atau password salah"
}
```

Status code error: `401 Unauthorized`.

## Session

Login dan register tidak mengembalikan `session_id` atau session token pada JSON response. Itu disengaja agar token tidak terekspos ke JavaScript, log frontend, atau penyimpanan browser.

Session disimpan pada cookie:

- Nama: `cc_session`
- `HttpOnly`: JavaScript browser tidak dapat membaca token.
- `SameSite=Lax`: mengurangi risiko CSRF pada navigasi lintas situs.
- `Secure`: aktif otomatis pada production HTTPS.
- Masa berlaku: 30 hari.

Nilai cookie adalah token acak. Database hanya menyimpan hash SHA-256 token tersebut pada tabel `sessions`. Endpoint `GET /api/auth/me` membaca cookie ini dari request dan mengembalikan user aktif.

## Current User

`GET /api/auth/me`

Jika session valid:

```json
{
  "user": {
    "id": "uuid",
    "name": "Felix Juan",
    "email": "felix@example.com"
  }
}
```

Jika belum login:

```json
{
  "user": null
}
```

## Logout

`POST /api/auth/logout`

Response:

```json
{
  "ok": true
}
```

Logout menghapus session dari database dan menghapus cookie `cc_session`.

## cURL

Register:

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Felix Juan","email":"felix@example.com","password":"password123"}'
```

Login:

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"felix@example.com","password":"password123"}'
```

Cek session:

```bash
curl -i -b cookies.txt http://localhost:3000/api/auth/me
```

Logout:

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/api/auth/logout
```

## Error Codes

- `400`: body tidak valid atau password kurang dari 8 karakter.
- `401`: email atau password salah.
- `409`: email sudah terdaftar.
- `500`: kegagalan internal server atau koneksi database.

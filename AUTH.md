# Authentication API

Autentikasi menggunakan MySQL 9.6.0, session token acak, dan cookie `cc_session` HTTP-only. Request body menggunakan JSON. Query database menggunakan parameter terpisah (`?`), bukan string interpolation.

## Setup

1. Pastikan MySQL 9.6.0 berjalan.
2. Buat database dan tabel:

```bash
mysql -u root -p < database/schema.sql
```

Verifikasi versi server:

```bash
mysql --version
mysql -u root -p -e "SELECT VERSION();"
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

Untuk database yang sudah ada dari versi sebelumnya, jalankan migration admin. Migration ini kompatibel dengan MySQL 9.6.0 dan versi MySQL/MariaDB yang lebih lama:

```bash
mysql -u root -p < database/migrate-admin.sql
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

## Role dan Admin Panel

Semua akun baru memiliki role `user`. Untuk membuat akun admin:

```sql
USE coding_camp;
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Panel admin tersedia pada `/admin` dan hanya dapat digunakan oleh role `admin`.

Fitur panel:

- Melihat daftar user.
- Mengubah nama user.
- Mengubah role user.
- Menghapus user lain.
- Membuat course.
- Mengedit course.
- Menghapus course.

API admin menggunakan session cookie yang sama dan seluruh endpoint divalidasi server-side:

- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

Contoh body create atau update course:

Endpoint course menerima `multipart/form-data`, bukan JSON, karena gambar dikirim sebagai file. Field teks yang dikirim:

```json
{
  "title": "Dasar Pemrograman JavaScript",
  "description": "Materi JavaScript untuk pemula.",
  "learningObjectives": "Peserta memahami sintaks dasar JavaScript.",
  "level": "beginner",
  "category": "Frontend",
  "duration": "6 minggu",
  "uploadedAt": "2026-01-12"
}
```

Tambahkan file gambar pada field `image`. Format yang didukung: PNG, JPEG, WebP, dan GIF. Ukuran maksimal 2 MB.

Contoh cURL create course:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/admin/courses \
  -F "title=Dasar Pemrograman JavaScript" \
  -F "description=Materi JavaScript untuk pemula." \
  -F "learningObjectives=Peserta memahami sintaks dasar JavaScript." \
  -F "image=@./javascript.jpg" \
  -F "level=beginner" \
  -F "category=Frontend" \
  -F "duration=6 minggu" \
  -F "uploadedAt=2026-01-12"
```

Gambar disimpan sebagai data URL pada kolom `courses.image`. Pendekatan ini sesuai untuk aplikasi kecil. Jika ukuran katalog atau file membesar, pindahkan gambar ke object storage seperti S3 atau Cloudinary dan simpan URL-nya di database.

## Materi Course TXT

Pada form Course, upload file `course.txt` pada field `contentFile`. File picker memakai filter `.txt`, tetapi filter browser bukan pengaman. Server tetap menolak file yang extension-nya bukan `.txt`, ukurannya lebih dari 1 MB, atau bukan UTF-8 valid.

Contoh isi materi:

```md
# Dasar Pemrograman JavaScript

Fondasi JavaScript untuk pemula.

## 01. Variable

Variable adalah tempat menyimpan nilai. Gunakan `const` sebagai default.

```javascript
const namaPengguna = "Ilan";
console.log(namaPengguna);
```

:::callout{variant="info"}
Gunakan const untuk nilai yang tidak ditimpa ulang.
:::

- String
- Number
- Boolean
```

Syntax yang didukung: `#` sampai `###` untuk heading, fenced code block, inline code dengan backtick, callout `info/warning/success/danger`, bullet list, quote dengan `>`, dan divider `---`.

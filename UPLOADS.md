# Uploads

Cover image course diupload ke Cloudflare R2 dan URL-nya disimpan pada database. Custom domain yang digunakan adalah `https://cdn.yuroflac.my.id`.

Konfigurasi `.env`:

```env
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=coding-camp
R2_PUBLIC_URL=https://cdn.yuroflac.my.id
```

Server membuat object key acak pada prefix `course-images/`, memvalidasi extension dan magic bytes, lalu mengupload menggunakan S3-compatible API. Database hanya menyimpan URL CDN.

`accept` pada file picker bukan security boundary. Server tetap memvalidasi extension, magic bytes, MIME, dan ukuran maksimal 2 MB.

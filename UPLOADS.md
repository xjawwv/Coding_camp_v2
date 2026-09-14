# Uploads

## Cover Image

Field upload cover adalah `image`. Format valid:

- PNG
- JPEG
- GIF
- WebP

Ukuran maksimal 2 MB. `accept` pada file picker hanya petunjuk UI. Server tetap memeriksa extension dan magic bytes, sehingga file non-gambar yang di-rename menjadi `.jpg` ditolak.

## Course Content

Field materi adalah `contentFile`. File wajib berakhiran `.txt`, UTF-8 valid, dan berukuran maksimal 1 MB. Memilih `All files` tetap tidak dapat melewati validasi server.

## Request

Create dan update course menggunakan `multipart/form-data`:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/admin/courses \
  -F "title=Dasar Pemrograman JavaScript" \
  -F "description=Materi JavaScript untuk pemula." \
  -F "learningObjectives=Peserta memahami sintaks dasar JavaScript." \
  -F "image=@./javascript.jpg" \
  -F "contentFile=@./course.txt" \
  -F "level=beginner" \
  -F "category=Frontend" \
  -F "duration=6 minggu" \
  -F "uploadedAt=2026-01-12"
```

Untuk skala kecil, cover disimpan sebagai data URL di `courses.image`. Jika katalog membesar, gunakan object storage.

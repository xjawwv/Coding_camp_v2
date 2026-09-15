# Admin System

Panel admin menggunakan role `admin` dan memiliki dua area terpisah:

- `/admin/users`: pengelolaan user.
- `/admin/courses`: CRUD course.

## Course Status

Course baru dibuat dengan status `draft`. Course draft tidak muncul pada katalog publik.

Admin dapat:

- Publish course agar muncul pada katalog.
- Unpublish course agar kembali menjadi draft dan tidak tampil pada katalog.
- Edit course.
- Hapus course.

## Course API

- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`
- `POST /api/admin/courses/:id/publish`
- `POST /api/admin/courses/:id/unpublish`

Katalog publik hanya membaca course dengan status `published` melalui `GET /api/courses`.

## User API

- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

Admin aktif tidak dapat menurunkan role dirinya sendiri atau menghapus dirinya sendiri.

## Authorization

Semua endpoint admin memvalidasi session dan role di server menggunakan `requireAdmin()`. Menyembunyikan menu pada frontend bukan pengaman.

# Admin System

Sistem memiliki role `user` dan `admin`. User baru selalu memiliki role `user`.

Promosi akun admin:

```sql
USE coding_camp;
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Route admin:

- `/admin`: overview.
- `/admin/users`: pengelolaan user.
- `/admin/courses`: pengelolaan course.

API user:

- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

API course:

- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

Semua endpoint memvalidasi role admin di server menggunakan `requireAdmin()`. Detail upload dan materi ada di `UPLOADS.md` dan `COURSE_CONTENT.md`.

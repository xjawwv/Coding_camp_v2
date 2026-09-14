# Admin System

Panel admin saat ini hanya menangani user. Course dibuat dan dikelola langsung pada source page di `pages/course`.

## Roles

- `user`: dapat mengakses dashboard dan course.
- `admin`: dapat mengakses dashboard dan panel User.

Promosi akun admin:

```sql
USE coding_camp;
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Routes

- `/admin`: overview admin untuk user.
- `/admin/users`: daftar dan pengelolaan user.

## API

- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

Semua endpoint memvalidasi role admin di server menggunakan `requireAdmin()`.

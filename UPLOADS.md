# Uploads

Panel admin saat ini tidak menyediakan upload course. Materi course dibuat langsung pada `pages/course`.

Jika upload ditambahkan kembali, `accept` pada file picker tidak boleh dianggap sebagai validasi keamanan. Server harus memvalidasi extension, MIME, magic bytes, ukuran, dan isi file.

# Course Content

Admin mengupload satu file `course.txt` untuk materi. Aplikasi mem-parsing Markdown sederhana dan merendernya sebagai component Vue, bukan raw HTML.

Contoh:

````md
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

> Code is read more often than it is written.

---
````

Syntax yang didukung:

- `#` sampai `###`: heading.
- Text biasa: paragraph.
- Backtick: inline code.
- Fenced code block: code playground.
- `:::callout`: callout dengan variant `info`, `warning`, `success`, atau `danger`.
- `- item` atau `* item`: bullet list.
- `> text`: quote.
- `---`: divider.

Parser: `utils/course-markdown.ts`.

Renderer: `components/CourseContentRenderer.vue`.

Flow:

```text
course.txt -> validasi -> courses.content -> parser -> reader renderer
```

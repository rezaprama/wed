# Menambah fitur tanpa membongkar seluruh web

[English](features.md) · [Prompt AI siap salin](../prompts/feature.id.txt) · [Pengaturan tanpa kode](customize.id.md)

## Cek yang sudah tersedia dulu

| Permintaan | Cara paling pendek |
| --- | --- |
| Dress code, parkir, pesan untuk tamu | `extraSections` dalam `wedding.json` |
| Kota atau acara tambahan | Tambah entri `events`, maksimal empat |
| Foto tambahan | `gallery`, maksimal 12 |
| Musik dan video | `music.file` dan `videoUrl` |
| Profil atau tautan lain | `socials` |
| Ucapan dengan persetujuan pengelola | [Buku tamu D1](guestbook.id.md) |

Untuk hal di atas, cukup ubah isi file. Tidak perlu meminta AI membuat ulang proyek.

## Jika memang membutuhkan kode

Salin [prompt fitur](../prompts/feature.id.txt). Isi fitur yang kamu mau dan contoh perilakunya. Contoh: “Tambahkan countdown menuju acara pertama. Setelah waktunya lewat, tampilkan pesan terima kasih. Gunakan zona waktu acara.”

Berikan AI file dari salinanmu. Jika AI tidak bisa membuka repo privat, minta ia menyebut file yang dibutuhkan. Untuk perubahan kode, cara paling nyaman memakai alat AI yang dapat membuka folder proyek dan terminal. Cara chat biasa tetap bisa memberi file lengkap, tetapi tidak menjalankan pemeriksaan sendiri.

## Peta file untuk AI atau pengembang

| File | Tugas |
| --- | --- |
| `wedding.json` | Isi undangan dan pilihan fitur |
| `wedding.schema.json` | Bentuk pengaturan yang dikenali editor |
| `src/config.mjs` | Menolak pengaturan yang salah |
| `src/theme.mjs` | Tiga warna, tiga ukuran, kontras, dan penerapan token CSS |
| `src/render.mjs` | HTML semua varian dan label bahasa |
| `src/style.css` | Tata letak dengan token desain yang sama |
| `src/client/app.js` | Interaksi di browser, seperti cover dan galeri |
| `src/worker.ts` | Routing dan API buku tamu opsional |
| `scripts/build.mjs` | Menghasilkan web dan aset yang ringan |
| `scripts/check.mjs` | Memeriksa batas desain, aset, privasi contoh, dan tautan dokumen |
| `tests/` | Pengujian perilaku |

## Urutan kerja untuk perubahan kode

1. Tulis satu contoh hasil yang diinginkan. Hindari menggabungkan banyak fitur yang tidak berkaitan.
2. AI membaca `AGENTS.md` dan file terkait. Fitur berat sebaiknya punya pilihan aktif/nonaktif, dengan keadaan awal nonaktif.
3. Jika menambah pengaturan, perbarui schema dan validasi. Jika menambah tulisan antarmuka, sediakan Inggris dan Indonesia.
4. Tetap gunakan token warna/ukuran yang ada. Pertahankan akses keyboard, dukungan reduced motion, dan empat varian undangan.
5. Uji perilaku baru yang penting. Jalankan `npm run verify` dengan Node.js 24. Ini memeriksa kode, tes, hasil build, desain, aset, dokumen, dan dry-run Cloudflare.
6. Untuk perubahan tampilan, buka desktop dan mobile. Cek cover, tombol, bagian baru, dan kemungkinan tulisan keluar layar.
7. Jika publikasi sudah diminta, jalankan `npm run deploy`, lalu `npm run smoke -- https://alamat-webmu.workers.dev`.
8. Untuk perubahan yang memengaruhi unduhan awal atau interaksi utama, ukur kembali PageSpeed pada URL yang sudah terbit. Catat angka sebenarnya.

Pemeriksaan lulus tidak membuktikan bahwa fakta acara sudah benar. Jangan mengarang hasil tes, skor, atau janji biaya. Jangan mematikan pemeriksaan supaya perubahan yang bermasalah terlihat berhasil.

## Batas yang perlu dipertahankan

- Maksimal tiga warna UI, tiga ukuran tulisan, dan tiga keluarga font. Foto tetap boleh berwarna.
- Kontras tulisan dan tombol minimal 4,5:1 terhadap latar.
- Aset berat, musik, video, dan layanan luar dimuat setelah diperlukan.
- Data tamu dan token tidak dimasukkan ke repo publik atau log.
- Buku tamu mempertahankan validasi, same-origin, moderasi, dan pembatasan kirim.
- Resource berbayar, perubahan akses/visibilitas, penghapusan database, dan force-push memerlukan permintaan yang jelas. Perubahan isi biasa tidak membutuhkan pembuatan token baru.

Aturan kerja tersedia di `AGENTS.md`, dengan penunjuk `CLAUDE.md` dan `GEMINI.md`. Alat AI berbeda-beda; bila ia tidak memuat aturan otomatis, minta ia membacanya atau tempelkan aturannya. Aturan teks membantu mengarahkan AI. Validasi otomatis menjadi pemeriksaan tambahan yang dapat dijalankan.

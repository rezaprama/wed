# Undangan pertamamu

Siapkan akun GitHub dan Cloudflare. Pilih paket Free. Kita mulai dengan undangan yang bisa dipakai tanpa database.

## 1. Buat salinan

Klik tombol Deploy to Cloudflare pada README. Cloudflare akan menghubungkan akun GitHub dan membuat salinan repo. Pilihan lain: **Use this template → Create a new repository** di GitHub. Pilih **Private** bila akan mengunggah foto pribadi. Hubungkan salinan itu melalui Cloudflare Workers & Pages → Create application → Import a repository.

Namai singkat, misalnya `nikah-kami`. Repo adalah folder tempat file websitemu disimpan.

## 2. Pasang contoh dulu

Jika diminta, isi seperti ini:

| Kolom | Isi |
| --- | --- |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Node version | `24` |
| Database / secrets | Tidak perlu untuk versi awal |

Jika tidak ada kolom Node version, tambahkan build environment variable `NODE_VERSION` dengan nilai `24`. Cloudflare membaca konfigurasi Wrangler. Buka tautan `workers.dev` yang muncul. Seharusnya terlihat contoh Rani & Dimas dan ilustrasi pengganti foto.

Acuan resmi: [tombol Deploy](https://developers.cloudflare.com/workers/platform/deploy-buttons/), [template GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/).

## 3. Ganti tulisan

Di salinan repo GitHub, buka `wedding.json`. Klik pensil. Ganti tulisan di dalam tanda petik. Jangan hapus nama kolom, tanda petik, koma, atau kurung.

```json
"language": "id",
"demo": false,
"allowIndexing": false
```

- `language`: `id` untuk bahasa Indonesia, `en` untuk Inggris.
- `demo: false`: menghapus tulisan pemberitahuan bahwa ini contoh.
- `allowIndexing: false`: meminta mesin pencari tidak menampilkan undangan. Skor audit SEO akan turun dengan sengaja. Pengaturan ini tidak memberi kata sandi pada web.
- `couple`: nama pasangan, keluarga, nama orang tua/pengundang, foto cover, dan tagar.
- `events`: daftar acara/kota. Tanggal memakai `YYYY-MM-DD`, misalnya `2027-06-12`. Jam memakai `HH:MM`, misalnya `11:00`. Zona waktu dapat memakai `Asia/Jakarta`.
- `slug`: kode pendek kota pada tautan. `jakarta` menjadi `/jakarta/` dan `/JAKARTA/`. Pakai huruf kecil, angka, atau tanda hubung. Sisakan minimal satu acara.

Klik **Commit changes** untuk menyimpan. Cloudflare membuat ulang webnya. Jika ada isi yang salah, pesan build menunjukkan kolom yang perlu diperbaiki. Versi terakhir yang berhasil tetap tampil.

## 4. Masukkan foto

Lihat [peta foto](photos.md). Unggah ke `public/media/`. Setelah itu, ubah alamat file di `wedding.json`. File `cover.jpg` yang diunggah ke folder itu ditulis sebagai `/media/cover.jpg`.

Foto JPG, PNG, WebP, dan AVIF bisa dipakai. Build membuat salinan WebP yang lebih kecil dan membuang metadata dari salinan foto yang dihasilkan. Metadata file asli dalam repo tidak ikut dihapus. Pakai repo privat untuk sumber foto pribadi. File SVG contoh boleh dihapus setelah semua alamatnya diganti.

## 5. Tambahan, bila ingin

**Musik:** unggah audio yang boleh kamu pakai, misalnya `public/media/song.mp3`. Isi `music.file` dengan `/media/song.mp3`. Kosongkan untuk mematikan fitur. Musik mulai setelah tamu membuka undangan. Sebagian browser meminta klik Putar musik lagi. Gunakan file kecil; unduhan dimulai setelah undangan dibuka.

**Profil:** isi `socials`, misalnya `{"label":"Instagram kami","url":"https://www.instagram.com/akunmu/"}`. Array kosong menyembunyikan tautan.

**Hadiah:** isi `gifts` dengan `label`, `value`, dan `owner`. Tamu bisa menyalin `value`. Biarkan `gifts: []` bila tidak ingin menampilkannya. Undangan orang tua tidak menampilkan hadiah.

**Video:** isi `videoUrl` dengan tautan HTTPS lengkap. Video dibuka setelah diklik, bukan saat halaman pertama dimuat.

**Ucapan:** ikuti [panduan buku tamu](guestbook.id.md). Lewati bila ingin web paling sederhana.

## 6. Buat tautan tamu

Buka `/send/` pada alamat websitemu. Pilih kota dan pengundang. Tulis satu nama per baris. Klik Buat tautan tamu. Salin tautan atau pesan. Tombol WhatsApp membuka draf; kamu sendiri yang memilih mengirimnya. Tidak ada pesan yang dikirim otomatis.

Kamu juga bisa menambahkan `?to=Budi%20dan%20Keluarga` di belakang tautan undangan. Jangan masukkan nomor telepon, kata sandi, atau identitas privat dalam tautan.

## Jika tersangkut

| Yang terlihat | Yang perlu dilakukan |
| --- | --- |
| `Missing image` | Periksa nama file, huruf besar/kecil, dan alamat `/media/`. |
| JSON error | Batalkan perubahan terakhir. Cari koma atau tanda petik yang terhapus. |
| Masih tertulis contoh | Simpan `"demo": false`, lalu tunggu build berhasil. |
| Isi lama masih tampil | Pastikan build Cloudflare terbaru berhasil, lalu refresh. |
| Musik diam | Klik Buka undangan atau Putar musik. Pastikan file audio ada dan bisa diputar. |
| Buku tamu nonaktif | Ini pengaturan awal. Aktifkan lewat panduan terpisah bila dibutuhkan. |
| Tautan orang tua berbeda | Tautan huruf besar memang memakai orang tua sebagai pengundang. |

Jika meminta bantuan lewat issue, jangan unggah foto pribadi, nama tamu, detail hadiah, atau token.

# Ganti tulisan, warna, ukuran, dan bagian isi

[English](customize.md) · [Panduan dari nol](setup.id.md) · [Minta bantuan AI](ai.id.md)

Semua perubahan di halaman ini memakai **`wedding.json`**. Buka file itu di salinan GitHub milikmu, klik pensil, ubah nilainya, lalu **Commit changes**. Cloudflare menerbitkan perubahan setelah pemeriksaan berhasil.

Potongan di bawah adalah contoh bagian file. Jangan mengganti seluruh `wedding.json` dengan satu potongan kecil. [Prompt AI](../prompts/personalize.id.txt) bisa menyiapkan file lengkap jika kamu belum nyaman mengedit JSON.

## Tulisan dan nama

- `couple.names`: nama bersama, misalnya `Galih & Ratna`.
- `couple.first` dan `couple.second`: nama, keluarga, foto, dan tanggal lahir masing-masing.
- `birthDate`: format `2000-01-01`. Contoh kedua adalah `2000-08-17`. Hapus kolom ini jika ingin menyembunyikan tanggal lahir.
- `events`: kota, nama acara, tanggal, jam, tempat, dan peta.
- `language`: `id` untuk Indonesia, `en` untuk Inggris. Ini mengganti label bawaan. Tulisan yang kamu isi sendiri tetap mengikuti tulisanmu.

## Tiga warna

Cari `theme`, lalu `colors`:

```json
"colors": {
  "background": "#f7f1f9",
  "text": "#3d1c47",
  "accent": "#7b2f91"
}
```

`background` adalah latar. `text` adalah tulisan utama. `accent` adalah tombol dan tautan. Kode warna ditulis dengan tanda `#` dan enam angka/huruf. Ilustrasi contoh ikut memakai palet pilihanmu. Foto dan SVG milikmu yang tidak ditandai sebagai placeholder tetap memakai warna aslinya.

Kamu boleh menyalin satu baris pilihan ini ke tiga kolom tadi:

| Pilihan | background | text | accent |
| --- | --- | --- | --- |
| Ungu bawaan | `#f7f1f9` | `#3d1c47` | `#7b2f91` |
| Hijau | `#f6f7ed` | `#203b2f` | `#356848` |
| Hangat | `#fff5ec` | `#442c24` | `#934b34` |

Build memeriksa keterbacaan warna. Tulisan utama dan warna tombol harus memiliki rasio kontras minimal 4,5:1 terhadap latar. Jika muncul `too hard to read`, pilih tulisan lebih gelap pada latar terang, atau gunakan contoh di atas. Gradasi dan warna keempat tidak termasuk pengaturan ini.

## Tiga ukuran tulisan

```json
"fontSizes": { "body": 16, "heading": 28, "title": 52 }
```

| Kolom | Kegunaan | Angka yang diterima |
| --- | --- | --- |
| body | Isi biasa, tombol, dan atribusi kecil | 16 sampai 20 |
| heading | Judul bagian | 24 sampai 40 |
| title | Nama besar pada cover | 40 sampai 64 |

Tulis angka tanpa tanda petik dan tanpa `px`. Urutannya harus `body < heading < title`. Contoh lebih besar: `18`, `32`, `56`. Dua font lokal tetap dipakai. Foto dan layout menyesuaikan layar.

## Tambah dress code, parkir, atau pesan sendiri

Ganti `"extraSections": []` dengan:

```json
"extraSections": [
  { "title": "Dress code", "text": "Silakan memakai pakaian berwarna hijau sage." },
  { "title": "Parkir", "text": "Gunakan area parkir di sebelah pintu utama." }
]
```

Bagian ini muncul setelah informasi acara pada semua varian undangan. Maksimal empat bagian. Judul maksimal 100 karakter, isi maksimal 1.000 karakter. Isinya tulisan biasa. Kode HTML tidak dijalankan. Kosongkan array menjadi `[]` untuk menyembunyikannya.

## Pilihan lain yang sudah tersedia

| Keinginan | Pengaturan |
| --- | --- |
| Tambah foto kenangan | Isi `gallery` dengan alamat file dalam `/media/`. |
| Musik | Unggah audio yang boleh kamu gunakan, lalu isi `music.file`, misalnya `/media/song.mp3`. |
| Video | Isi `videoUrl` dengan tautan HTTPS. |
| Profil Instagram atau tautan lain | Isi `socials` dengan `label` dan `url`. |
| Hadiah | Isi `gifts` dengan `label`, `value`, `owner` pada salinan privatmu. |
| Ucapan tamu | Ikuti [panduan buku tamu](guestbook.id.md). |
| Tidak tampil di mesin pencari | Isi `allowIndexing` dengan `false`. Ini tidak memberi kata sandi. |

Untuk fitur yang belum tersedia, gunakan [panduan fitur](features.id.md). Satu perubahan kecil per langkah membuat kesalahan lebih mudah ditemukan.

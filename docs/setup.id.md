# Undangan pertamamu, mulai dari belum punya akun

[English](setup.md) · [Kembali ke halaman utama](../README.id.md)

Kita buat web contoh dulu. Setelah bisa dibuka, baru ganti tulisan dan foto. Semua langkah utama bisa dilakukan lewat browser di laptop. Tidak perlu memasang aplikasi atau mengetik perintah terminal.

## Kenalan dengan tulisan di layar

| Tulisan | Artinya |
| --- | --- |
| GitHub | Tempat menyimpan file undangan. Bayangkan sebuah folder daring. |
| Repository, atau repo | Satu folder proyek di GitHub. |
| Cloudflare | Layanan yang menerbitkan file tadi menjadi web untuk tamu. |
| Commit changes | Simpan perubahan file. |
| Build | Cloudflare sedang menyiapkan web dari filemu. |
| Deploy | Cloudflare sedang menerbitkan web yang sudah siap. |

## Belum punya akun? Mulai di sini

1. Buka [daftar GitHub](https://github.com/signup). Ikuti formulir atau pilihan masuk yang tersedia. Siapkan email yang bisa kamu buka.
2. Pilih nama pengguna, misalnya `galih-ratna`. Ini nama akun, bukan tulisan pada undangan.
3. Buka email dari GitHub dan selesaikan verifikasi. Pilih paket **Free** jika diminta.
4. Buka [daftar Cloudflare](https://dash.cloudflare.com/sign-up). Ikuti pendaftaran dan verifikasi emailnya.
5. Masuk ke dashboard Cloudflare. Untuk panduan ini, gunakan **Workers Free**. Pembelian domain dan pengaturan DNS bisa dilewati.

Hasil webmu nanti memiliki alamat `workers.dev` gratis. Kamu tidak perlu membeli domain atau menyiapkan database untuk contoh awal. Jika layar menawari paket berbayar, kamu belum membutuhkannya untuk langkah ini.

Sudah benar kalau kamu bisa masuk ke kedua akun tersebut. Petunjuk resmi: [akun GitHub](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github), [akun Cloudflare](https://developers.cloudflare.com/fundamentals/account/create-account/).

## 1. Buat salinan

1. Buka [Buat salinan wed](https://github.com/rezaprama/wed/generate).
2. Pada **Owner**, pilih akun GitHub milikmu.
3. Pada **Repository name**, isi nama pendek, misalnya `nikah-kami`.
4. Pilih **Private** agar sumber foto dan detail pribadimu tidak terbuka melalui GitHub.
5. Klik **Create repository**. Tunggu sampai daftar file muncul.

Sudah benar kalau alamat browser memakai akunmu, misalnya `github.com/akunmu/nikah-kami`. Lakukan perubahan di salinan ini. Repo privat menyembunyikan file sumber. Website yang diterbitkan tetap bisa dibuka siapa pun yang punya tautannya.

## 2. Pasang contoh dulu

Di Cloudflare, buka **Workers & Pages → Create application → Import a repository** atau pilihan **Connect to Git**. Hubungkan akun GitHub milikmu. Jika diminta memilih akses repo, cukup pilih salinan undanganmu. Pilih repo `nikah-kami` tadi, lalu isi:

| Kolom | Isi |
| --- | --- |
| Worker name | `wed` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Node version | `24` |
| Database / secrets | Tidak perlu untuk versi awal |

Jika tidak ada kolom Node version, tambahkan build environment variable `NODE_VERSION` dengan nilai `24`. Cloudflare membaca konfigurasi Wrangler.

Klik **Deploy**, lalu tunggu sampai berhasil. Buka tautan `workers.dev` yang muncul. Seharusnya terlihat contoh Galih & Ratna dan ilustrasi pengganti foto. Nama menu bisa berubah; cari pilihan mengimpor repo GitHub. Tombol **Deploy to Cloudflare** pada README adalah jalur lain yang sekaligus membuat salinan. Karena kamu sudah punya salinan pada langkah 1, lanjutkan dengan mengimpor salinan tersebut.

Nama repo dan nama Worker berbeda. `wed` sesuai dengan kolom `name` bawaan di `wrangler.jsonc`. Kalau ingin nama web lain, buka file itu di salinanmu, ubah `name`, lalu simpan. Pakai nama yang persis sama di Cloudflare. Dengan begitu, build tidak gagal karena nama Worker berbeda.

Acuan resmi: [tombol Deploy](https://developers.cloudflare.com/workers/platform/deploy-buttons/), [template GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [bantuan build](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/).

## 3. Ganti tulisan

Di salinan repo GitHub, buka `wedding.json`. Klik ikon pensil **Edit this file**. Ganti tulisan di dalam tanda petik. Jangan hapus nama kolom, tanda petik, koma, atau kurung.

```json
"language": "id",
"demo": false,
"allowIndexing": false
```

- `language`: `id` untuk bahasa Indonesia, `en` untuk Inggris.
- `demo: false`: menghapus tulisan pemberitahuan bahwa ini contoh.
- `allowIndexing: false`: meminta mesin pencari tidak menampilkan undangan. Skor audit SEO akan turun dengan sengaja. Pengaturan ini tidak memberi kata sandi pada web.
- `couple`: nama pasangan, keluarga, nama orang tua/pengundang, foto cover, dan tagar.
- `couple.first.birthDate` dan `couple.second.birthDate`: tanggal lahir opsional, ditulis `YYYY-MM-DD`. Contohnya Galih (1 Januari 2000) dan Ratna (17 Agustus 2000). Hapus kolom `birthDate` bila tidak ingin menampilkannya.
- `events`: daftar acara/kota. Tanggal memakai `YYYY-MM-DD`, misalnya `2027-06-12`. Jam memakai `HH:MM`, misalnya `11:00`. Zona waktu dapat memakai `Asia/Jakarta`.
- `slug`: kode pendek kota pada tautan. `jakarta` menjadi `/jakarta/` dan `/JAKARTA/`. Pakai huruf kecil, angka, atau tanda hubung. Sisakan minimal satu acara.

Klik **Commit changes** untuk menyimpan. Cloudflare membuat ulang webnya. Jika ada isi yang salah, pesan build menunjukkan kolom yang perlu diperbaiki. Versi terakhir yang berhasil tetap tampil.

Belum nyaman mengedit file? [Minta AI menyiapkan file lengkap](ai.id.md), lalu salin hasilnya ke GitHub. Untuk warna, ukuran, dan dress code, gunakan [panduan penyesuaian](customize.id.md). Semua memakai file yang sama.

## 4. Masukkan foto

1. Di salinan GitHub milikmu, buka folder **public**, lalu **media**.
2. Klik **Add file → Upload files**. Pilih foto dari laptopmu, misalnya `couple.jpg`.
3. Klik **Commit changes** untuk menyimpan unggahan.
4. Buka `wedding.json`, klik pensil, lalu ganti `/media/couple.svg` menjadi `/media/couple.jpg`.
5. Simpan dengan **Commit changes**. Tunggu build Cloudflare berhasil.

[Peta foto](photos.md) menunjukkan bagian mana memakai setiap gambar. Pakai nama file sederhana dan cocokkan huruf besar/kecilnya.

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

Untuk mengembalikan isi lama: buka `wedding.json` → **History** → pilih versi yang sebelumnya berhasil → salin teks file itu. Kembali ke file pada cabang `main`, klik pensil, tempel teks lama, lalu **Commit changes**. Salah ketik tidak perlu diperbaiki dengan menghapus repo.

Kata sandi, kode email, dan token tetap kamu simpan sendiri. [Panduan AI](ai.id.md) menyediakan prompt memperbaiki kesalahan. [Panduan fitur](features.id.md) membantu bila perubahan membutuhkan kode.

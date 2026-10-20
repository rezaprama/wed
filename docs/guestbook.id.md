# Buku tamu opsional

Lewati panduan ini bila hanya ingin undangan. Demo awal tidak mengumpulkan ucapan. Buku tamu membutuhkan database kecil Cloudflare D1 dan dua nilai acak yang dirahasiakan. Penggunaan bisa masuk kuota Free D1, mengikuti batas akun.

## Aktifkan di komputer

Pasang Node.js 24. Unduh atau clone repo milikmu. Buka terminal pada folder repo.

```sh
npm ci
npx wrangler login
npm run setup:guestbook
npm run typegen
npm run deploy
```

Skrip setup membuat D1 dengan nama unik, menambahkan binding ke `wrangler.jsonc`, mengaktifkan `guestbook.enabled` dan mematikan mode contoh di `wedding.json`, serta membuat `ADMIN_TOKEN` dan `IP_HASH_KEY` acak dalam `.dev.vars` bila file itu belum ada. Token lokal yang sudah ada dipertahankan. File token yang tidak lengkap atau tidak valid menghentikan setup tanpa ditimpa.

Deploy memasang skema dan mengunggah secret melalui `--secrets-file`. Nilainya tidak diletakkan dalam argumen perintah atau dicetak oleh skrip. Build berikutnya di Cloudflare memakai secret yang sudah tersimpan. Jika binding DB sudah ada, setup tidak membuat database baru. Periksa binding dan `guestbook.enabled` sebelum deploy.

Simpan **`wedding.json`** dan **`wrangler.jsonc`** ke repo milikmu. ID database bukan secret. **Jangan simpan `.dev.vars` ke Git.** Hubungkan repo yang sama pada integrasi GitHub di Cloudflare agar perubahan berikutnya memperbarui Worker yang sama.

## Setujui ucapan

1. Buka `.dev.vars` di komputer. Salin nilai setelah `ADMIN_TOKEN=`.
2. Buka `https://webmu.workers.dev/admin/`.
3. Masukkan token dalam kolom kata sandi. Klik Masuk.
4. Setujui atau tolak ucapan. Ucapan yang belum disetujui tidak tampil ke publik.
5. Klik Keluar setelah selesai. Token hanya disimpan dalam memori tab browser.

Jangan letakkan token dalam tautan, screenshot, issue, atau pesan chat. Web live harus memakai HTTPS. Pengiriman ucapan memerlukan asal situs yang sama, JSON berukuran terbatas, ID pengiriman, dan kode acara valid. Ucapan ditampilkan sebagai teks. Database menyimpan hash berpenambah acak harian untuk membatasi pengiriman, bukan IP mentah. Satu sumber dibatasi lima ucapan per hari UTC untuk seluruh acara. ID pengiriman yang sama tidak membuat ucapan ganda.

## Backup sebelum mengubah skema berikutnya

```sh
npx wrangler d1 export DB --remote --output .local/guestbook-backup.sql
```

Jangan masukkan ekspor ke Git atau lampiran issue publik. Migrasi awal membuat tabel. Perubahan skema berikutnya perlu mempertahankan pesan lama dan mempunyai rencana pemulihan. Menghapus atau mematikan frontend tidak menghapus database.

## Coba di komputer sendiri

`npm run dev` memakai SQLite lokal, bukan D1 produksi. Untuk mencoba formulir, aktifkan `guestbook.enabled`, lalu jalankan preview. Token lokal disimpan dalam `.dev.vars` yang diabaikan Git. `npm test` memeriksa moderasi, pemisahan kelompok tamu, pembatasan pengiriman, pagination, teks mirip SQL, asal permintaan, dan batas ukuran tanpa akun Cloudflare.

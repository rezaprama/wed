# Minta bantuan AI, lalu salin dan tempel

[English](ai.md) · [Panduan dari nol](setup.id.md) · [Warna dan ukuran](customize.id.md)

AI bisa membantu menulis isi file. Untuk cara ini, kamu tidak perlu API key, terminal, atau fitur AI coding berbayar. Akun GitHub dan Cloudflare tetap kamu buat sendiri. Setelah AI menyiapkan isi, kamu yang menyimpannya ke repo milikmu.

## 1. Pilih satu tempat mengobrol

Buka salah satu: [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com), atau [Claude](https://claude.ai). Ikuti pendaftaran atau masuk ke akun yang bisa kamu gunakan. Cukup gunakan percakapan teks. Ketersediaan dan batas pemakaian mengikuti layanan masing-masing.

Tidak perlu memakai ketiganya. Jangan menempelkan kata sandi, kode email, token, atau daftar tamu pribadi ke percakapan.

## 2. Salin prompt ini

Buka **[prompt ubah isi undangan](../prompts/personalize.id.txt)**. Salin seluruh teksnya ke AI. Ganti bagian `[TULIS KEINGINANMU DI SINI]` dengan permintaanmu.

Contoh permintaan:

> Ganti nama menjadi Galih dan Ratna. Galih lahir 1 Januari 2000, Ratna 17 Agustus 2000. Pakai warna hijau dari panduan. Tambahkan dress code: hijau sage. Tanggal acara tetap seperti file sekarang.

Prompt meminta AI membaca filemu lebih dulu, tidak mengarang data, dan mengembalikan file lengkap. Jadi kamu tidak harus menyambung potongan kode.

## 3. Berikan file milikmu

1. Buka salinan repo GitHub milikmu.
2. Klik **`wedding.json`**.
3. Salin seluruh isi file. Tombol **Raw** atau salin file dapat membantu.
4. Tempelkan teks itu ke percakapan AI. Jawab pertanyaan data yang diperlukan.

Sebagian AI bisa membuka tautan repo, sebagian tidak. Menempelkan isi file tetap bisa dipakai. Repo privat tidak otomatis bisa dibaca AI hanya karena kamu memberi tautannya.

## 4. Simpan hasilnya ke GitHub

1. Periksa nama, tanggal, jam, alamat, dan tautan peta pada jawaban AI.
2. Salin **isi JSON saja** dari kotak jawaban. Jangan ikut menyalin tanda pagar pembuka/penutup kotak kode.
3. Buka `wedding.json` di repo GitHub milikmu. Klik pensil **Edit this file**.
4. Pilih seluruh isi file lama, lalu tempel hasil AI.
5. Klik **Commit changes** untuk menyimpan.
6. Tunggu build Cloudflare berhasil. Buka kembali tautan webmu.

Kalau AI menjawab bahwa web sudah diterbitkan padahal tidak punya akses akunmu, itu belum menjadi bukti. Bukti akhirnya adalah build berhasil dan tautan web yang benar-benar menampilkan perubahan.

## Jika muncul pesan kesalahan

Salin prompt berikut, lalu isi bagian dalam kurung siku:

```text
Aku memakai wed. Bantu perbaiki kesalahan ini dengan perubahan paling kecil.
Pesan kesalahan: [TEMPEL PESAN, TANPA TOKEN ATAU DATA RAHASIA]
Isi wedding.json saat ini: [TEMPEL FILE, HAPUS DETAIL PRIVAT YANG TIDAK DIPERLUKAN]
Jangan ubah data lain atau melemahkan pemeriksaan agar lolos.
Kembalikan wedding.json lengkap yang valid dan jelaskan apa yang diperbaiki.
Jika masalahnya bukan pada file ini, jelaskan file mana yang perlu diperiksa.
```

## Mau tambah fitur?

Mulai dari [fitur tanpa kode](customize.id.md). Dress code dan parkir cukup memakai `extraSections`.

Untuk perubahan yang memerlukan kode, pakai **[prompt tambah fitur](../prompts/feature.id.txt)** dan baca [panduan fitur](features.id.md). AI yang hanya bisa mengobrol akan memberikan file untuk kamu salin. AI dengan akses editor/terminal dapat mengerjakan file dan menjalankan pemeriksaan. Kemampuan itu bergantung alat dan akses yang kamu berikan.

## Pagar pembatas yang sudah disertakan

- `AGENTS.md` berisi aturan kerja dan peta file. `CLAUDE.md` serta `GEMINI.md` mengarah ke aturan yang sama.
- Schema membantu editor mengenali pengaturan. Validasi build memeriksa tanggal, tautan, warna, ukuran, dan file gambar.
- Desain dibatasi maksimal tiga warna, tiga ukuran, dan tiga keluarga font. Warna harus terbaca.
- `npm run verify` menjalankan tes, build, pemeriksaan desain/aset/dokumen, dan dry-run Cloudflare. GitHub Actions menjalankannya juga.
- Tidak ada klaim skor 100 hanya karena AI bilang demikian. Pengukuran PageSpeed dilakukan pada URL yang sudah terbit.

Instruksi membantu mengarahkan AI. Pemeriksaan otomatis memberi batas yang benar-benar dijalankan, tetapi tetap tidak membuktikan bahwa semua data acara sudah benar. Kamu yang memeriksa fakta acaranya.

Acuan: [OpenAI, petunjuk prompt](https://developers.openai.com/api/docs/guides/prompt-engineering), [mulai memakai Gemini](https://support.google.com/gemini/answer/13275745), [mulai memakai Claude](https://support.claude.com/en/articles/8114491-get-started-with-claude).

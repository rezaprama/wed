# Put each photo in the right place / Letakkan foto di tempatnya

Upload your own files to **`public/media/`**. Then change the matching path in **`wedding.json`**. The filename in the config must match exactly, including uppercase/lowercase letters.

Unggah file ke **`public/media/`**. Lalu ganti alamat yang sesuai di **`wedding.json`**. Nama file harus sama persis, termasuk huruf besar/kecil.

| On the website / Di website | Setting / Pengaturan | Example upload / Contoh file | Shape / Bentuk |
| --- | --- | --- | --- |
| Cover and desktop portrait / Cover dan foto desktop | `couple.photo` | `public/media/couple.jpg` | Portrait / Tegak, about 2:3 |
| First person / Orang pertama | `couple.first.photo` | `public/media/person-one.jpg` | Portrait / Tegak, about 4:5 |
| Second person / Orang kedua | `couple.second.photo` | `public/media/person-two.jpg` | Portrait / Tegak, about 4:5 |
| Gallery / Galeri | `gallery` | `public/media/memory-one.jpg` | Landscape / Mendatar, about 3:2 |
| Optional music / Musik opsional | `music.file` | `public/media/song.mp3` | Audio you may legally use / Audio yang boleh dipakai |

For example / Contoh:

```json
"photo": "/media/couple.jpg"
```

```json
"gallery": [
  "/media/memory-one.jpg",
  "/media/memory-two.jpg",
  "/media/memory-three.jpg"
]
```

**Keep `/media/` in the settings. Do not write `/public/media/`.** `/public` is a source folder; the public URL starts at `/media/`.

**Tetap tulis `/media/` dalam pengaturan. Jangan tulis `/public/media/`.** `/public` adalah folder sumber. Alamat di web dimulai dari `/media/`.

Use JPG, PNG, WebP or AVIF photos. Aim for clear source images around 1200–2000 pixels wide. The build automatically makes 400/800/1200-pixel WebP versions where appropriate and strips metadata from those generated raster files. Faces near the top of the portrait work well with the cover crop. The source files remain in your repository, so keep that repository private if they are private.

Pakai foto JPG, PNG, WebP, atau AVIF. Sumber sekitar 1200–2000 piksel sudah cukup. Build otomatis membuat salinan WebP 400/800/1200 piksel sesuai kebutuhan, serta menghapus metadata pada salinan raster yang dihasilkan. Wajah dekat bagian atas foto cocok untuk potongan cover. File asli tetap berada dalam repo. Pakai repo privat bila sumber fotonya privat.

The supplied SVGs are original, neutral placeholders. Replace them with your own images, or keep them under the MIT license. To remove the gallery, use `"gallery": []`. To hide music, use `"music": {"file":""}`. No file is required for a disabled feature.

The build publishes generated copies of configured images and your selected music file. It does not publish unused uploads or the original raster photo files. Keep `botanical.svg`; it supplies the page decoration. Choose trusted media that you have permission to use.

SVG bawaan merupakan ilustrasi placeholder orisinal. Ganti dengan fotomu sendiri, atau tetap pakai sesuai lisensi MIT. Untuk menghapus galeri, isi `"gallery": []`. Untuk mematikan musik, isi `"music": {"file":""}`. Fitur yang dimatikan tidak memerlukan file.

Build menerbitkan salinan gambar yang dipilih pada konfigurasi dan file musik yang digunakan. Unggahan yang tidak dipakai dan foto raster asli tidak diterbitkan. Tetap simpan `botanical.svg` untuk dekorasi halaman. Gunakan media tepercaya yang memang boleh kamu pakai.

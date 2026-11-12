# Undangan Pernikahan Digital — Rizal & Silvi
**Vintage Javanese Watercolor — Luxury Floral Elegance**

React + Vite + TypeScript + Framer Motion + Lucide. Siap di-deploy ke Netlify.

## 1. Install
```bash
npm install
```

## 2. Menjalankan
```bash
npm run dev        # mode pengembangan
npm run build      # build produksi -> dist/
npm run preview    # cek hasil build
```

## Struktur
```
public/images/   foto + ilustrasi dekoratif (PNG RGBA transparan)
public/music/    musik-undangan.mp3
src/components/  semua komponen (Opening, Hero, Couple, Event, Gallery, dst.)
src/data/        wedding.ts (semua data), assets.ts (impor ilustrasi)
src/hooks/       useCountdown, useAudio, useGuestName, useNetlifyForm
src/styles/      theme.css, opening.css, sections.css, forms.css
scripts/         skrip pembuat aset (opsional)
source-art/      gambar asli (background putih) sebelum diproses jadi transparan
```

## Daftar aset
| File | Fungsi | Status |
|---|---|---|
| `public/images/foto-utama.jpg` | Foto utama pasangan di Hero | **PLACEHOLDER — ganti dengan foto asli** |
| `public/images/foto-galeri-1.jpg` | Galeri #1 | **PLACEHOLDER — ganti** |
| `public/images/foto-galeri-2.jpg` | Galeri #2 | **PLACEHOLDER — ganti** |
| `public/images/foto-galeri-3.jpg` | Galeri #3 | **PLACEHOLDER — ganti** |
| `public/images/peacock.png` | Ilustrasi merak watercolor | PNG RGBA transparan |
| `public/images/flower-corner.png` | Karangan bunga sudut (mawar lavender, hydrangea, melati, eukaliptus) | PNG RGBA transparan |
| `public/images/floral-decoration.png` | Rangkaian bunga horizontal | PNG RGBA transparan |
| `public/images/gunungan.png` | Ornamen gunungan Jawa | PNG RGBA transparan |
| `public/images/watercolor-joglo.png` | Ilustrasi joglo watercolor | PNG RGBA transparan |
| `public/images/batik-pattern.png` | Pola batik tipis (garis) | PNG RGBA transparan |
| `public/images/og-image.jpg` | Gambar pratinjau WhatsApp/sosial media | Siap pakai |
| `public/favicon.png` | Favicon bertema floral | PNG RGBA |
| `public/music/musik-undangan.mp3` | Musik latar | Musik instrumental sederhana buatan sistem — **disarankan diganti lagu pilihan Anda** |

> Foto pasangan **tidak dikarang**. File foto saat ini hanya placeholder berlabel jelas. Jika file foto hilang, website menampilkan kotak keterangan (bukan gambar rusak).

## 3. Mengganti foto utama
Timpa `public/images/foto-utama.jpg` dengan foto Anda (nama file sama). Disarankan rasio potret ±4:5, lebar 1000–1600 px, ukuran < 400 KB. Foto ditampilkan dalam bingkai lengkung dengan `object-fit: cover`.

## 4. Mengganti foto galeri
Timpa `foto-galeri-1.jpg`, `foto-galeri-2.jpg`, `foto-galeri-3.jpg` di `public/images/`. Galeri selalu tepat 3 foto. Foto 1 tampil besar (potret), foto 2 & 3 lebih kecil. Untuk mengubah path/alt teks: `src/data/wedding.ts` → `gallery`.

## 5. Mengganti musik
Timpa `public/music/musik-undangan.mp3` (nama file sama), atau ubah `music` di `src/data/wedding.ts`. Musik hanya diputar setelah tamu menekan **BUKA UNDANGAN** (aturan autoplay browser). Jika diblokir, tombol musik di kanan bawah dapat dipakai manual. Jika file tidak ada, tidak terjadi error.

## 6. Mengganti gambar dekoratif
Timpa file di `public/images/` dengan nama sama. **Gambar dekoratif HARUS berupa PNG transparan RGBA (alpha channel asli)**, bukan JPG atau PNG berlatar putih — jika tidak akan tampak kotak putih. CSS tidak memakai trik blend untuk menyembunyikan latar.
Ilustrasi diimpor lewat `src/data/assets.ts` sehingga ikut ter-bundle ke `dist/index.html`.

Untuk memproses gambar berlatar putih menjadi PNG RGBA:
```bash
pip install pillow numpy scipy
# letakkan gambar asli di source-art/<nama>.png, lalu
python3 scripts/make_transparent.py
```
Cek hasil: 
```bash
python3 -c "from PIL import Image; im=Image.open('public/images/peacock.png'); print(im.mode, im.getchannel('A').getextrema())"
# harus: RGBA (0, 255)
```

## 7. Mengganti nama pengantin
`src/data/wedding.ts` → `groom` dan `bride` (nama lengkap, panggilan, inisial). Teks "Rizal & Silvi" di Hero/Footer/OG ada di `HeroSection.tsx`, `FooterSection.tsx`, `index.html` dan `public/images/og-image.jpg` (dibuat dengan `scripts/make_placeholders.py`).

## 8. Mengubah tanggal acara
`src/data/wedding.ts` → `dateLong`, `dateShort`, `countdownTarget` (format ISO dengan zona waktu, mis. `2027-01-06T09:00:00+07:00`), dan jam di `events`. Teks "RABU, 6 JANUARI 2027" pada `Countdown.tsx` serta metadata di `index.html` juga perlu disesuaikan.

## 9. Mengubah rekening
`src/data/wedding.ts` → `accounts` (`bank`, `holder`, `number`). Tombol salin otomatis mengikuti.

## 10. Mengubah Google Maps
`src/data/wedding.ts` → `mapsUrl`. Tombol membuka tautan di tab baru. Alamat lokasi tidak dikarang; tambahkan sendiri di `EventSection.tsx` bila diperlukan.

## 11. Personalisasi nama tamu
Tambahkan `?to=Nama%20Tamu` di akhir URL:
```
https://domain-anda.com/?to=Bapak%20Ahmad
```
Nama dibaca dengan `URLSearchParams`, dibersihkan (karakter kontrol & `<` `>` dibuang, maksimal 80 karakter) dan ditampilkan sebagai teks biasa oleh React (aman dari XSS). Tanpa parameter, tampil **Bapak/Ibu/Saudara/i**. Nama juga mengisi otomatis kolom Nama di RSVP & Ucapan. Spasi dapat ditulis `%20` atau `+`.

## 12. Netlify Forms
- Dua form: `rsvp` (nama, kehadiran, jumlah, ucapan) dan `guestbook` (nama, ucapan).
- Salinan HTML statis ada di `index.html` (agar terdeteksi saat build) dan form React memiliki `data-netlify="true"`, hidden input `form-name`, serta honeypot `bot-field`.
- Kirim dilakukan dengan `fetch("/", { method: "POST" ... })`. Pesan sukses **hanya** tampil bila server membalas HTTP 2xx; jika gagal tampil pesan error.
- Saat dijalankan lokal (`npm run dev`) atau di hosting selain Netlify, pengiriman akan gagal — ini normal.
- Jika nama field diubah, ubah juga form statis di `index.html`.
- Lihat data masuk: Netlify Dashboard → **Forms**. Aktifkan notifikasi email di *Forms → Form notifications*.
- Daftar ucapan **tidak** ditampilkan publik (tidak ada backend). Jangan menaruh token Netlify di frontend; jika ingin menampilkan ucapan publik, buat Netlify Function yang membaca Forms API dengan token di *Environment variables*.

## 13. Deploy ke Netlify
1. Push project ke GitHub/GitLab, lalu **Add new site → Import from Git** di Netlify.
2. Build command `npm run build`, publish directory `dist` (sudah di `netlify.toml`).
3. Deploy. Atau tanpa Git: jalankan `npm run build` lalu seret folder `dist` ke Netlify Drop.
4. Pastikan *Forms → Active forms* menampilkan `rsvp` dan `guestbook`.

## 14. Domain sendiri
Netlify → **Domain management → Add a domain**. Arahkan DNS: domain utama dengan `A`/ALIAS ke load balancer Netlify, atau subdomain dengan `CNAME` ke `nama-situs.netlify.app` (atau pakai Netlify DNS). HTTPS (Let's Encrypt) otomatis aktif.

## Catatan
- `prefers-reduced-motion` didukung: animasi dimatikan/diminimalkan.
- Build menggunakan `vite-plugin-singlefile`: seluruh JS/CSS/ilustrasi PNG di-inline ke `dist/index.html`. Foto & musik di `public/` tetap dimuat sebagai file terpisah.

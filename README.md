# CLI Weather Terminal 🌩️💻

Sebuah aplikasi pengecek cuaca interaktif dengan antarmuka web bergaya *hacker/terminal* yang super estetik. Bagian *backend*-nya ditenagai oleh **Rust** (berjalan sebagai Vercel Serverless Function) untuk performa yang sangat cepat, sementara bagian *frontend*-nya menggunakan HTML, CSS, dan Javascript murni dengan tema retro modern (Glassmorphism + CRT Scanlines).

## 🚀 Fitur Utama

- **Tampilan Premium**: Antarmuka terminal bergaya kaca (*Glassmorphism*) transparan dengan animasi rotasi latar belakang.
- **Efek Retro CRT**: Dilengkapi dengan layar pendar neon hijau, *scanlines*, dan *flicker* halus ala monitor lawas.
- **Boot Sequence Animasi**: Meniru proses _booting_ terminal yang otentik saat halaman pertama kali dimuat.
- **Rust Backend**: Menggunakan `vercel_runtime` untuk komputasi cepat.
- **Akurat & Gratis**: Menggunakan Open-Meteo API yang cepat tanpa memerlukan API Key.

## 🛠️ Teknologi yang Digunakan

- **Backend**: Rust 🦀, Tokio, Reqwest, Vercel Runtime.
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript.
- **Deployment**: Vercel.

## 💻 Cara Menjalankan Secara Lokal (Development)

Pastikan Anda sudah menginstal **Node.js** & **npm**, lalu instal Vercel CLI jika belum memilikinya.

1. _Clone_ repositori ini:
   ```bash
   git clone https://github.com/erlk1m/CLI-Weather.git
   cd CLI-Weather
   ```

2. Jalankan _server_ lokal Vercel:
   ```bash
   npx vercel dev
   ```
   *Catatan: Pastikan untuk menjawab "cli-weather" (huruf kecil semua tanpa spasi) saat ditanya nama project oleh Vercel.*

3. Buka browser dan kunjungi `http://localhost:3000`.

## 🌐 Deploy ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Hubungkan akun GitHub Anda dan pilih repositori `CLI-Weather`.
3. Biarkan pengaturan *Framework Preset* diatur secara default atau pilih **Other**.
4. Klik **Deploy**!

---
*Dibuat oleh [erlk1m](https://github.com/erlk1m)*

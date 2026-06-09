# ECHOMIND — Media Bimbingan & Konseling (Board Game Self-Disclosure)

## Original Problem Statement
User mengirim zip codebase ECHOMIND dan meminta revisi sesuai dokumen `Revisi Game Echomind.docx`.

## Revisi yang Diterapkan (2026-01-09)

### Branding & Teks
- Judul Hero: "LET THE GAME BEGIN" → **"ECHOMIND · BIMBINGAN & KONSELING"**
- Hapus seluruh aesthetic/copy **"NEON Y2K"** (badge hero, about tags, ticker bottom)
- Section "BUKA DIRI, BANGUN KONEKSI" → **"ABOUT ECHOMIND"** dengan deskripsi baru (media BK board game)
- Section "STAY IN THE LOOP" + newsletter form → **dihapus**, diganti dengan card "Untuk Guru BK" + CTA Refleksi
- Section "UNLOCK BOOSTERS" → **"TIPE KARTU PERMAINAN"** (Challenge, Scenario, Twist, Boost dengan icon emoji)
- Page title HTML: "ECHOMIND · Media Bimbingan & Konseling"

### Konten Kartu (60 kartu)
File `/app/frontend/src/constants/cards.js` di-overwrite total:
- 6 aspek × 10 kartu = 60 (sesuai dokumen)
- Per aspek: 3 Challenge + 5 Scenario + 1 Twist + 1 Boost
- Aspek: Sikap & Opini, Selera & Minat, Pekerjaan/Sekolah, Keuangan, Kepribadian, Aspek Fisik
- Icon aspek: 🧭 🎨 📚 💰 🧠 💪
- Title + prompt setiap kartu = persis dari dokumen (TIME CAPSULE!, ROLEPLAY!, dll)
- Twist effects: back-3, skip-1, reverse, swap, back-aspect, swap-boost
- Boost effects: shield, forward-5, reroll, skip-q, share-3

### Board Ular Tangga (60 kotak)
File `/app/frontend/src/components/SnakeLadder.jsx` di-overwrite total:
- Board **6 baris × 10 kolom = 60 kotak** serpentine (1 di bottom-left, 60 di top-left)
- Setiap kotak menampilkan: nomor + icon tipe kartu + indikator ular/tangga
- 5 ular & 5 tangga (lokasi disesuaikan untuk 60 kotak)
- Modal kartu muncul saat landing — Challenge/Scenario tinggal "Sudah Dijawab"/Skip, Twist/Boost otomatis terapkan efek
- Tameng Penalti tersimpan di state shields[playerIdx]
- Skip Giliran tersimpan di state skipNext[playerIdx]
- Arah giliran bisa terbalik via Twist "GILIRAN PINDAH ARAH!"

### Mode Pass & Play DAN Multiplayer keduanya pakai Board
- `/play/passplay` → langsung Board (1 device, gantian)
- `/play/online` → Lobby (Host/Join + room code + QR) → click "Mulai Board" → Board sama
- Board identik untuk kedua mode, mengikuti identitas visual ECHOMIND (warna aspek, font, retro card)

### Fitur Baru: Riwayat & Refleksi untuk Guru BK
File baru `/app/frontend/src/components/Reflections.jsx` + route `/reflections`:
- **Auto-save** setiap permainan selesai ke `localStorage.echomind_history` (mode, pemenang, posisi akhir, log kartu)
- Halaman menampilkan: 7 pertanyaan refleksi pasca-permainan + daftar riwayat (expandable detail per game)
- Tombol akses: Hero CTA "Riwayat / Refleksi BK", Nav "Refleksi", About "Buka Riwayat", End-game "Buka Refleksi BK"
- Hapus per-entry atau hapus semua

## Architecture
- `/app/frontend/src/App.js` — routes: `/`, `/play/passplay`, `/play/online`, `/play/snake-ladder`, `/reflections`
- `/app/frontend/src/components/Landing.jsx` — Landing page (revisi penuh)
- `/app/frontend/src/components/Play.jsx` — PassPlay & OnlinePlay wrappers (use SnakeLadder)
- `/app/frontend/src/components/SnakeLadder.jsx` — engine board ular tangga 60 kotak + kartu + efek
- `/app/frontend/src/components/Reflections.jsx` — halaman riwayat & refleksi guru BK
- `/app/frontend/src/constants/cards.js` — 60 kartu, 6 aspek, 4 tipe kartu, efek twist/boost

## Backlog / Future
- Wire backend `/api` untuk simpan history per-kelas (saat ini localStorage saja)
- Realtime multiplayer (websocket) — saat ini room code visual saja, board jalan satu device
- Export laporan refleksi BK ke PDF
- Tambah autentikasi guru BK (login + dashboard kelas)

## Update — Revisi 2 (2026-01-09)
Berdasarkan dokumen `REVISI LAGI ECHOMIND DIGITAL.docx`:
- ✅ Hapus subtitle "BIMBINGAN & KONSELING" di hero
- ✅ Hapus 2 paragraf deskripsi "Echomind adalah media..." di hero
- ✅ Ganti seluruh emoji smartphone (🔥💬⚡💖) di card type indicators dengan **ikon lucide-react bertema** (Flame, MessageCircle, Zap, Heart) — diaplikasikan di:
  - Board cells (60 kotak)
  - Legend board
  - Modal kartu
  - Halaman Refleksi (riwayat kartu)
  - Landing "Tipe Kartu Permainan" section
- ✅ Dadu sekarang **dadu fisik dengan pip dot** (1-6 titik) via DiceFace component — bukan angka
- ✅ Pion pemain lebih distinct: border hitam 2px + shadow + highlight kuning untuk pemain aktif (transition 300ms saat bergerak)
- ✅ Title kartu Challenge ditambahkan **emoji prefix** dari dokumen (🎭 ROLEPLAY!, ⚡ FIRST INSTINCT!, 🎤 PODIUM!, 🎵 KARAOKE PAKSA!, 🕵️ TEBAK AKU!, 🛍️ STYLIST DADAKAN!, 🎬 PITCHING!, 📸 TIME CAPSULE!, 🎯 IMPIAN KILAT!, 💸 CRAZY SPENDING!, 🦈 SHARK TANK!, 🧾 AUDIT KEUANGAN!, 💌 SURAT JUJUR!, 🪞 CERMIN JUJUR!, 🎯 TEBAK EMOSIKU!, 🤸 BODY CHALLENGE!, 🪞 SELF-LOVE OUT LOUD!, 🎭 POSE HARI INI!)
- ✅ Twist/Boost titles ditambahkan format dari dokumen: "⚡ TWIST — TUKAR POSISI!" dll, "💖 BOOST — LOMPAT MAJU 5!" dll
- ✅ Field **refleksi** ditambahkan ke kartu yang punya pertanyaan refleksi tambahan (ROLEPLAY!, KARAOKE PAKSA!, PITCHING!) — ditampilkan di modal dengan highlight kuning
- ✅ Page title HTML & teks card content sesuai dokumen baru

Note: untuk papan ilustrasi vector art retro (top-down view dengan banyak detail dekorasi dalam kotak) butuh asset desain custom — di iterasi ini board tetap functional grid 6×10 dengan ikon lucide bertema. Bisa di-upgrade dengan asset SVG custom di iterasi berikutnya.

// ECHOMIND — 60 cards across 6 aspects of self-disclosure (Sidney Jourard's theory)
// Each aspect contains: 3 challenge + 5 scenario + 1 twist + 1 boost = 10 cards
// Total 60 cards = 60 board cells (no empty cells)

export const ASPECTS = [
  { id: "attitudes",   name: "Sikap & Opini",     color: "#FF1493", icon: "🧭" },
  { id: "tastes",      name: "Selera & Minat",    color: "#5B21B6", icon: "🎨" },
  { id: "work",        name: "Pekerjaan / Sekolah", color: "#84CC16", icon: "📚" },
  { id: "money",       name: "Keuangan",          color: "#06B6D4", icon: "💰" },
  { id: "personality", name: "Kepribadian",       color: "#FB923C", icon: "🧠" },
  { id: "body",        name: "Aspek Fisik",       color: "#EC4899", icon: "💪" },
];

// Card type meta — used to style card UI and apply effects
export const CARD_TYPES = {
  challenge: { label: "CHALLENGE", icon: "🔥", color: "#FF1493" },
  scenario:  { label: "SCENARIO",  icon: "💬", color: "#5B21B6" },
  twist:     { label: "TWIST",     icon: "⚡", color: "#06B6D4" },
  boost:     { label: "BOOST",     icon: "💖", color: "#84CC16" },
};

const c = (aspect, type, title, prompt) => ({
  id: `${aspect}-${type}-${title.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).slice(2,6)}`,
  aspect, type, title, prompt,
});

// 60 cards arranged sequentially. Snake-ladder board cell 1..60 maps to CARDS[i-1].
export const CARDS = [
  // ===== ASPEK 1: SIKAP & OPINI =====
  c("attitudes", "challenge", "ROLEPLAY!", "Seorang teman tiba-tiba mengajakmu melakukan hal yang melanggar prinsipmu. Peragakan reaksi jujurmu! Kelompok menilai: prinsip kuat atau mudah goyah?"),
  c("attitudes", "challenge", "FIRST INSTINCT!", "Sebutkan satu hal yang menurutmu SALAH dari pergaulan remaja saat ini — jawab langsung, jangan lebih dari 3 detik!"),
  c("attitudes", "challenge", "PODIUM!", "Sampaikan pesan 45 detik berjudul: 'Satu hal yang perlu berubah dari pergaulan remaja Indonesia sekarang.' Berani?"),
  c("attitudes", "scenario", "Nilai Spiritual", "Seberapa penting nilai religi atau spiritual dalam kesehariamu? Ceritakan satu momen konkret!"),
  c("attitudes", "scenario", "Prinsip Hidup", "Nilai atau prinsip hidup apa yang paling kamu pegang — pernahkah ada situasi yang membuat prinsip itu goyah?"),
  c("attitudes", "scenario", "Batas Pergaulan", "Menurutmu, di mana batas pergaulan yang sehat antara remaja laki-laki dan perempuan?"),
  c("attitudes", "scenario", "Sumber Belajar", "Dari mana kamu belajar tentang apa yang boleh dan tidak boleh dalam pergaulan?"),
  c("attitudes", "scenario", "Beda Keyakinan", "Bagaimana sikapmu jika seorang teman memiliki keyakinan yang sangat berbeda darimu?"),
  c("attitudes", "twist", "TUKAR POSISI!", "Bertukar posisi di papan dengan pemain yang namanya diawali huruf paling dekat dengan 'A'. Ambil gilirannya sekarang!"),
  c("attitudes", "boost", "LOMPAT MAJU 5!", "Kamu berhasil membuka diri — maju 5 langkah sebagai hadiah keberanian!"),

  // ===== ASPEK 2: SELERA & MINAT =====
  c("tastes", "challenge", "KARAOKE PAKSA!", "Nyanyikan satu bait lagu favoritmu sekarang — tanpa malu, tanpa bisik. Kelompok memberi nilai 1–10!"),
  c("tastes", "challenge", "TEBAK AKU!", "Jelaskan hobi favoritmu hanya dengan bahasa tubuh selama 30 detik — tanpa suara. Pemain lain harus menebak!"),
  c("tastes", "challenge", "STYLIST DADAKAN!", "Pilih satu orang di kelompok dan jelaskan outfit impian yang cocok untuknya — orang itu boleh setuju/tidak setuju!"),
  c("tastes", "scenario", "Waktu Bebas", "Jika kamu punya waktu bebas seminggu tanpa batas, kamu isi dengan apa? Jelaskan setiap harinya!"),
  c("tastes", "scenario", "Gaya Berpakaian", "Apa gaya berpakaian harianmu, dan pernahkah ada momen kamu tampil sangat berbeda dari biasanya?"),
  c("tastes", "scenario", "Makanan Favorit", "Adakah makanan atau minuman yang jadi favoritmu? Kenapa, dan di mana pertama kali kamu mencobanya?"),
  c("tastes", "scenario", "Hal Baru", "Hal baru apa yang sangat ingin kamu pelajari atau coba akhir-akhir ini?"),
  c("tastes", "scenario", "Tempat Nyaman", "Tempat apa yang selalu membuatmu bahagia dan nyaman — kenapa tempat itu spesial?"),
  c("tastes", "twist", "LEWATI 1 GILIRAN!", "Diam dulu satu putaran. Tapi pakai waktu ini untuk stalk papan dan menyusun strategi! 😏"),
  c("tastes", "boost", "TAMENG PENALTI!", "Simpan kartu ini. Saat kamu mendapat Twist apapun, tunjukkan kartu ini dan batalkan efeknya!"),

  // ===== ASPEK 3: PEKERJAAN / SEKOLAH =====
  c("work", "challenge", "PITCHING!", "Kamu punya 1 menit. Yakinkan kelompok bahwa jurusan/cita-cita pilihanmu adalah yang terbaik. Kelompok voting: meyakinkan atau tidak?"),
  c("work", "challenge", "TIME CAPSULE!", "Tulis pesan untuk dirimu 5 tahun mendatang tentang mimpi sekolah/karier — baca lantang, lalu lipat dan simpan!"),
  c("work", "challenge", "IMPIAN KILAT!", "Sebutkan cita-citamu dan jelaskan tepat 20 detik — tidak lebih, tidak boleh berhenti. Mulai sekarang!"),
  c("work", "scenario", "Pelajaran Bertumbuh", "Pelajaran atau pengalaman di sekolah apa yang paling membantumu berkembang sebagai pribadi — ceritakan!"),
  c("work", "scenario", "Belajar di Luar Negeri", "Jika ada kesempatan magang atau belajar di luar negeri sekarang, negara apa yang kamu pilih dan kenapa?"),
  c("work", "scenario", "Dinamika Kelas", "Bagaimana hubunganmu dengan teman sekelas — apakah ada dinamika seru atau konflik yang mengajarkan sesuatu?"),
  c("work", "scenario", "Lingkungan Sekolah", "Apa yang membuatmu nyaman atau tidak nyaman di lingkungan sekolahmu saat ini?"),
  c("work", "scenario", "Target Lulus", "Satu target besar apa yang ingin kamu capai sebelum lulus — dan sudah sejauh mana progres-mu?"),
  c("work", "twist", "MUNDUR 3 LANGKAH!", "Evaluasi ulang strategimu! Mundur 3 kotak. Tapi jika kotak baru memiliki tangga — naik tetap berlaku!"),
  c("work", "boost", "LEMPAR DADU ULANG!", "Dadu kurang menguntungkan? Lempar ulang sekali dan ambil hasil yang lebih tinggi!"),

  // ===== ASPEK 4: KEUANGAN =====
  c("money", "challenge", "CRAZY SPENDING!", "Kamu punya Rp 10 juta hari ini — wajib habis dalam 24 jam. Sebutkan daftar belanjamu lengkap di depan kelompok!"),
  c("money", "challenge", "SHARK TANK!", "Presentasikan ide bisnismu dalam 60 detik. Kelompok berperan sebagai investor — 'invest' atau 'pass'?"),
  c("money", "challenge", "AUDIT KEUANGAN!", "Ceritakan pengeluaran paling boros yang pernah kamu lakukan — kelompok voting: WORTH IT atau MENYESAL? Mayoritas worth it → maju 2 langkah!"),
  c("money", "scenario", "Sumber Uang", "Dari mana biasanya kamu mendapatkan uang, dan pernahkah mencoba cara kreatif untuk menambah pemasukan?"),
  c("money", "scenario", "Uang Lebih", "Jika dapat uang lebih sekarang — tabung, belanja, investasi, atau donasi? Kenapa dan bagaimana idealnya dibagi?"),
  c("money", "scenario", "Manajemen Uang Jajan", "Bagaimana cara kamu mengatur uang jajan agar cukup sampai akhir bulan? Punya trik khusus?"),
  c("money", "scenario", "Situasi Finansial", "Pernahkah merasa tidak nyaman atau malu karena kondisi keuangan? Ceritakan cara kamu menghadapinya."),
  c("money", "scenario", "Kebiasaan Finansial", "Menurutmu, kebiasaan keuangan apa yang paling penting dibangun sejak muda — apakah kamu sudah melakukannya?"),
  c("money", "twist", "GILIRAN PINDAH ARAH!", "Arah giliran terbalik! Dari kiri, sekarang ke kanan. Berlaku sampai Twist baru muncul!"),
  c("money", "boost", "SKIP PERTANYAAN!", "Tidak ingin menjawab pertanyaan giliran ini? Gunakan kartu ini dan skip tanpa penalti!"),

  // ===== ASPEK 5: KEPRIBADIAN =====
  c("personality", "challenge", "SURAT JUJUR!", "Tulis surat singkat untuk dirimu tentang perasaan yang sulit kamu ungkapkan. Baca — atau simpan. Pilihanmu."),
  c("personality", "challenge", "CERMIN JUJUR!", "Sebutkan kelebihan dan kekurangan terbesarmu dalam 30 detik — lalu minta seseorang di kelompok konfirmasi: setuju atau tidak?"),
  c("personality", "challenge", "TEBAK EMOSIKU!", "Peragakan reaksi JUJURmu saat menghadapi situasi tersulit dalam hidupmu — tanpa kata, hanya ekspresi dan gestur!"),
  c("personality", "scenario", "Reaksi Marah", "Bagaimana biasanya kamu bereaksi saat marah atau frustasi — dan apakah cara itu selalu berhasil?"),
  c("personality", "scenario", "Ritual Mood", "Saat mood buruk atau sedih, ritual apa yang paling efektif membuatmu merasa lebih baik?"),
  c("personality", "scenario", "Sumber Cemas", "Hal apa yang paling sering membuatmu cemas, dan strategi apa yang terbukti membantu?"),
  c("personality", "scenario", "Orang yang Menyebalkan", "Bagaimana kamu menjaga hubungan baik dengan orang yang kadang menyebalkan?"),
  c("personality", "scenario", "Orang Berpengaruh", "Siapa orang paling berpengaruh dalam hidupmu — dan pelajaran terbesar apa yang kamu dapat darinya?"),
  c("personality", "twist", "KEMBALI KE START ASPEK!", "Kembali ke kotak pertama aspek ini. Tapi ambil 1 kartu Boost gratis sebagai kompensasi perjalananmu!"),
  c("personality", "boost", "BERBAGI KEBAIKAN!", "Berikan kartu ini ke pemain lain — mereka maju 3 langkah. Kebaikanmu akan dibalas semesta! ✨"),

  // ===== ASPEK 6: ASPEK FISIK =====
  c("body", "challenge", "BODY CHALLENGE!", "Lakukan gerakan fisik pilihan kelompok selama 30 detik (push-up, squat, dancing, dll) — lalu deskripsikan rasanya!"),
  c("body", "challenge", "SELF-LOVE OUT LOUD!", "Sebutkan 3 hal yang kamu syukuri dari tubuh dan kondisi fisikmu — sambil berdiri tegak dan menatap semua orang!"),
  c("body", "challenge", "POSE HARI INI!", "Buat pose/gerakan yang merepresentasikan energi fisikmu hari ini — kelompok menebak: lelah, berenergi, atau santai?"),
  c("body", "scenario", "Kesehatan", "Bagaimana kondisi kesehatanmu belakangan — dan satu hal apa yang ingin kamu ubah dari gaya hidupmu?"),
  c("body", "scenario", "Insecurity Fisik", "Adakah hal dari penampilan yang membuatmu insecure — bagaimana kamu belajar menerima atau menghadapinya?"),
  c("body", "scenario", "Rutinitas Fit", "Punya rutinitas khusus untuk tetap fit — olahraga, diet, tidur? Ceritakan yang paling konsisten kamu lakukan!"),
  c("body", "scenario", "Aktivitas Hidup", "Aktivitas fisik apa yang membuatmu merasa paling hidup dan berenergi?"),
  c("body", "scenario", "Self-care", "Bagaimana caramu merawat diri ketika tubuh lelah atau pikiran penuh?"),
  c("body", "twist", "TUKAR KARTU BOOST!", "Jika kamu punya kartu Boost, berikan ke pemain di sebelah kananmu. Jika tidak punya, lewati 1 giliran!"),
  c("body", "boost", "LOMPAT MAJU 5!", "Tubuh sehat, jiwa kuat — maju 5 langkah sebagai bukti staminamu terbaik! 🏃"),
];

// Twist effect codes for engine
export const TWIST_EFFECTS = {
  "MUNDUR 3 LANGKAH!": "back-3",
  "LEWATI 1 GILIRAN!": "skip-1",
  "GILIRAN PINDAH ARAH!": "reverse",
  "TUKAR POSISI!": "swap",
  "KEMBALI KE START ASPEK!": "back-aspect",
  "TUKAR KARTU BOOST!": "swap-boost",
};

export const BOOST_EFFECTS = {
  "TAMENG PENALTI!": "shield",
  "LOMPAT MAJU 5!": "forward-5",
  "LEMPAR DADU ULANG!": "reroll",
  "SKIP PERTANYAAN!": "skip-q",
  "BERBAGI KEBAIKAN!": "share-3",
};

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

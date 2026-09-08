// src/data/assessment-details.js
// Konten halaman detail per asesmen — muncul setelah user klik card di carousel
// Alur: Carousel card (hook) → Halaman detail (ini) → Tombol "Mulai Asesmen" → Link eksternal

export const assessmentDetails = {

  kompas: {
    title: "Kompas Diri",
    tagline: "Sebelum menentukan arah hidup, kenalan dulu sama diri sendiri.",
    aboutTitle: "Apa yang akan kamu temukan?",
    about: "Kompas Diri membantu kamu memetakan pola pikir, kekuatan, dan arah pengembangan diri yang selama ini mungkin belum kamu sadari. Bukan cuma tau 'siapa kamu', tapi juga 'mau kemana kamu'.",
    previewTitle: "Beberapa hal yang akan digali:",
    previewPoints: [
      "Pola pikir dominan dalam mengambil keputusan",
      "Kekuatan alami yang jarang kamu manfaatkan",
      "Arah pengembangan diri yang paling relevan buatmu",
    ],
    outcomeTitle: "Setelah selesai, kamu akan tau:",
    outcome: "Arah hidup yang sesuai dengan siapa dirimu sebenarnya — bukan sekadar ikut arus orang lain.",
    meta: { questions: 20, duration: "7 menit", format: "Skor + Insight" },
  },

  qalbu: {
    title: "Cek Qalbu Dulu",
    tagline: "Hati lo lagi baik-baik aja, apa cuma keliatannya doang?",
    aboutTitle: "Apa yang akan kamu temukan?",
    about: "Cek Qalbu Dulu bantu kamu jujur sama kondisi hati yang sebenarnya — bukan cuma soal ibadah yang jalan, tapi ketenangan batin yang sering luput dari perhatian.",
    previewTitle: "Beberapa hal yang akan digali:",
    previewPoints: [
      "Kondisi ketenangan hati dalam keseharianmu",
      "Hal-hal yang diam-diam mengganggu ibadahmu",
      "Tanda-tanda hati yang butuh perhatian lebih",
    ],
    outcomeTitle: "Setelah selesai, kamu akan tau:",
    outcome: "Apa yang sebenarnya perlu dibenahi supaya hatimu lebih tenang di hadapan Allah.",
    meta: { questions: 18, duration: "6 menit", format: "Skor + Insight" },
  },

  dompet: {
    title: "Cek Dompet Dulu",
    tagline: "Sebelum boncos lebih jauh, intip dulu kesehatan dompet lo.",
    aboutTitle: "Apa yang akan kamu temukan?",
    about: "Cek Dompet Dulu membantu kamu melihat pola keuanganmu secara jujur — dari mana uang bocor, dan kebiasaan apa yang diam-diam bikin kondisi finansialmu gak pernah membaik.",
    previewTitle: "Beberapa hal yang akan digali:",
    previewPoints: [
      "Pola pengeluaran yang sering tidak disadari",
      "Kebiasaan finansial yang menahan progresmu",
      "Kesiapan menghadapi kondisi keuangan darurat",
    ],
    outcomeTitle: "Setelah selesai, kamu akan tau:",
    outcome: "Di mana sebenarnya \"kebocoran\" keuanganmu, dan langkah apa yang perlu diambil dulu.",
    meta: { questions: 22, duration: "8 menit", format: "Skor + Insight" },
  },

  doi: {
    title: "Cek Doi Dulu",
    subtitle: "Untuk cewek — menilai kesiapan doi",
    tagline: "Doi udah niat serius, tapi dia beneran siap jadi imam?",
    aboutTitle: "Apa yang akan kamu temukan?",
    about: "Diisi oleh kamu, berdasarkan pengalamanmu selama menjalani hubungan dengan dia. Cek Doi Dulu membantu menilai kesiapan doi secara lebih objektif — bukan cuma dari romantisnya, tapi dari kesiapan nyata membangun rumah tangga.",
    previewTitle: "Beberapa hal yang akan digali:",
    previewPoints: [
      "Konsistensi sikap doi dalam situasi sulit",
      "Kesiapan doi secara emosional dan finansial",
      "Tanda-tanda kecocokan visi ke depan",
    ],
    outcomeTitle: "Setelah selesai, kamu akan tau:",
    outcome: "Apakah doi benar-benar siap, atau masih perlu waktu sebelum melangkah lebih jauh.",
    meta: { questions: 24, duration: "8 menit", format: "Skor + Insight" },
  },

  dia: {
    title: "Cek Dia Dulu",
    subtitle: "Untuk cowok — menilai kecocokan dia",
    tagline: "Doi emang cakep, tapi seideal itu gak sih buat lo?",
    aboutTitle: "Apa yang akan kamu temukan?",
    about: "Diisi oleh kamu, berdasarkan pengalamanmu selama dekat dengan dia. Cek Dia Dulu membantu kamu menilai kecocokan yang sebenarnya — bukan cuma dari kesan awal, tapi dari kesiapan menjalani hidup bersama dalam jangka panjang.",
    previewTitle: "Beberapa hal yang akan digali:",
    previewPoints: [
      "Kecocokan nilai dan visi hidup ke depan",
      "Cara dia menghadapi konflik dan tekanan",
      "Kesiapan dia menerima peran sebagai pasangan",
    ],
    outcomeTitle: "Setelah selesai, kamu akan tau:",
    outcome: "Apakah dia memang yang tepat, atau kamu cuma terlanjur nyaman.",
    meta: { questions: 24, duration: "8 menit", format: "Skor + Insight" },
  },

  doski: {
    title: "Cek Doski Dulu",
    tagline: "Temenan udah lama, tapi lo yakin dia se-supportive itu?",
    aboutTitle: "Apa yang akan kamu temukan?",
    about: "Cek Doski Dulu membantu kamu melihat lebih jernih siapa saja di circle-mu yang benar-benar mendukung, dan siapa yang diam-diam menahan kemajuanmu tanpa kamu sadari.",
    previewTitle: "Beberapa hal yang akan digali:",
    previewPoints: [
      "Pola dukungan dalam pertemanan sehari-hari",
      "Pengaruh circle terhadap keputusan hidupmu",
      "Tanda-tanda hubungan yang perlu dievaluasi",
    ],
    outcomeTitle: "Setelah selesai, kamu akan tau:",
    outcome: "Siapa yang benar-benar ada di sisimu, dan circle mana yang perlu kamu pertimbangkan ulang.",
    meta: { questions: 18, duration: "6 menit", format: "Skor + Insight" },
  },

};

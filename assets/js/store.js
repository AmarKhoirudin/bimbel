/* ==========================================================================
   Bimbel Indonesia - Data Store & State Management (localStorage)
   ========================================================================== */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'bimbel_indonesia_state_v1';

  const DEFAULT_STATE = {
    currentUserId: null, // null = guest, or user id
    settings: {
      site_name: 'Bimbel Indonesia',
      site_tagline: 'Bimbel online Indonesia',
      site_description: 'Bimbingan belajar online untuk siswa SD, SMP, dan SMA dengan tutor berpengalaman, materi lengkap, dan try out online.',
      site_keywords: 'bimbel online, les privat, try out, UTBK, matematika, bahasa inggris',
      email: 'halo@bimbelindonesia.test',
      phone: '6281234567890',
      address: 'Jl. Pendidikan No. 25, Jakarta Selatan',
      instagram: 'https://instagram.com/bimbelindonesia',
      youtube: 'https://youtube.com/@bimbelindonesia',
      whatsapp: 'https://wa.me/6281234567890',
      cta_title: 'Siap meraih prestasi lebih tinggi?',
      cta_subtitle: 'Daftar gratis hari ini dan temukan cara belajar yang lebih mudah bersama Bimbel Indonesia.',
      default_tutor_rate: 100000,
      currency: 'IDR',
      max_upload_mb: 5,
      auto_verify_notification: true,
      maintenance_mode: false
    },
    sliders: [
      {
        id: 1,
        title: 'Banner Bimbel Indonesia 1 - Belajar Lebih Mudah',
        image: 'uploads/sliders/banner-1.jpg',
        urutan: 1,
        status: 'aktif',
        created_at: '2026-11-03'
      },
      {
        id: 2,
        title: 'Banner Bimbel Indonesia 2 - Persiapan UTBK & Try Out',
        image: 'uploads/sliders/banner-2.jpg',
        urutan: 2,
        status: 'aktif',
        created_at: '2026-11-03'
      },
      {
        id: 3,
        title: 'Banner Bimbel Indonesia 3 - Tutor Berpengalaman',
        image: 'uploads/sliders/banner-3.jpg',
        urutan: 3,
        status: 'aktif',
        created_at: '2026-11-03'
      }
    ],
    paymentMethods: [
      {
        id: 1,
        nama: 'BCA',
        tipe: 'bank_transfer',
        nomor: '1234567890',
        atas_nama: 'PT BIMBEL INDONESIA EDUKASI',
        catatan: 'Cantumkan nomor invoice pada berita transfer.',
        qr_image: '',
        status: 'aktif'
      },
      {
        id: 2,
        nama: 'Bank Mandiri',
        tipe: 'bank_transfer',
        nomor: '1370012938475',
        atas_nama: 'PT BIMBEL INDONESIA EDUKASI',
        catatan: 'Verifikasi manual 5-15 menit pada jam operasional.',
        qr_image: '',
        status: 'aktif'
      },
      {
        id: 3,
        nama: 'GoPay / DANA / OVO',
        tipe: 'ewallet',
        nomor: '081234567890',
        atas_nama: 'Bimbel Indonesia Official',
        catatan: 'Simpan tangkapan layar bukti pembayaran e-wallet Anda.',
        qr_image: '',
        status: 'aktif'
      },
      {
        id: 4,
        nama: 'QRIS Bimbel Indonesia',
        tipe: 'qris',
        nomor: 'ID102003004005',
        atas_nama: 'BIMBEL INDONESIA',
        catatan: 'Scan kode QR menggunakan aplikasi mobile banking atau e-wallet.',
        qr_image: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><rect width="220" height="220" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/><rect x="24" y="24" width="52" height="52" rx="6" fill="none" stroke="#0f172a" stroke-width="8"/><rect x="38" y="38" width="24" height="24" fill="#0f172a"/><rect x="144" y="24" width="52" height="52" rx="6" fill="none" stroke="#0f172a" stroke-width="8"/><rect x="158" y="38" width="24" height="24" fill="#0f172a"/><rect x="24" y="144" width="52" height="52" rx="6" fill="none" stroke="#0f172a" stroke-width="8"/><rect x="38" y="158" width="24" height="24" fill="#0f172a"/><rect x="92" y="24" width="12" height="12" fill="#0f172a"/><rect x="112" y="36" width="12" height="24" fill="#0f172a"/><rect x="92" y="64" width="20" height="12" fill="#0f172a"/><rect x="24" y="92" width="24" height="12" fill="#0f172a"/><rect x="60" y="92" width="36" height="12" fill="#0f172a"/><rect x="108" y="92" width="24" height="24" fill="#176b59"/><rect x="144" y="92" width="16" height="28" fill="#0f172a"/><rect x="172" y="104" width="24" height="16" fill="#0f172a"/><rect x="92" y="128" width="28" height="16" fill="#0f172a"/><rect x="132" y="132" width="28" height="28" fill="#0f172a"/><rect x="172" y="136" width="24" height="24" fill="#0f172a"/><rect x="92" y="160" width="16" height="36" fill="#0f172a"/><rect x="120" y="172" width="36" height="24" fill="#0f172a"/><rect x="168" y="172" width="28" height="24" fill="#0f172a"/></svg>'),
        status: 'aktif'
      }
    ],
    users: [
      {
        id: 1,
        role: 'admin',
        nama: 'Administrator Utama',
        email: 'admin@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281234567890',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-01'
      },
      {
        id: 2,
        role: 'tutor',
        nama: 'Arif Wicaksono',
        email: 'demo.tutor@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281234567899',
        spesialisasi: 'Matematika SMP & SMA',
        pendidikan: 'S1 Pendidikan Matematika',
        honor_per_jam: 100000,
        bio: 'Tutor berpengalaman dalam aljabar, geometri, dan kalkulus dasar dengan pendekatan konsep visual yang mudah dipahami siswa.',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-05'
      },
      {
        id: 3,
        role: 'tutor',
        nama: 'Rina Kartika, S.Pd.',
        email: 'rina.kartika@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281234567801',
        spesialisasi: 'Matematika SMP & SMA / UTBK',
        pendidikan: 'S1 Pendidikan Matematika UNY',
        honor_per_jam: 120000,
        bio: 'Alumni Pendidikan Matematika UNY dengan pengalaman 7 tahun mengajar. Fokus pada pendekatan konsep dan strategi cepat UTBK.',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-08'
      },
      {
        id: 4,
        role: 'tutor',
        nama: 'Budi Santoso, M.Pd.',
        email: 'budi.santoso@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281234567802',
        spesialisasi: 'Bahasa Inggris & TOEFL',
        pendidikan: 'S2 Pendidikan Bahasa Inggris',
        honor_per_jam: 115000,
        bio: 'Pengajar bahasa Inggris dengan sertifikasi TEFL dan pengalaman mengajar conversation untuk pelajar SMP, SMA, dan persiapan ujian.',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-10'
      },
      {
        id: 9,
        role: 'siswa',
        nama: 'Dina Prameswari',
        email: 'demo.siswa@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281234567898',
        tanggal_lahir: '2011-05-12',
        kelas: 'Kelas 9',
        sekolah: 'SMP Demo Indonesia',
        kota: 'Jakarta',
        alamat: 'Jl. Melati Indah No. 14, Jakarta Selatan',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-11-03'
      },
      {
        id: 10,
        role: 'siswa',
        nama: 'Nadia Maharani',
        email: 'nadia.maharani@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281298765401',
        tanggal_lahir: '2010-03-19',
        kelas: 'Kelas 10',
        sekolah: 'SMAN 8 Jakarta',
        kota: 'Jakarta',
        alamat: 'Tebet Timur, Jakarta Selatan',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-15'
      },
      {
        id: 11,
        role: 'siswa',
        nama: 'Salsabila Putri',
        email: 'salsabila.putri@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281298765402',
        tanggal_lahir: '2008-08-24',
        kelas: 'Kelas 12',
        sekolah: 'SMAN 3 Bandung',
        kota: 'Bandung',
        alamat: 'Jl. Dago No. 88, Bandung',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-18'
      },
      {
        id: 12,
        role: 'siswa',
        nama: 'Aditya Pratama',
        email: 'aditya.pratama@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281298765403',
        tanggal_lahir: '2011-11-02',
        kelas: 'Kelas 9',
        sekolah: 'SMPN 5 Yogyakarta',
        kota: 'Yogyakarta',
        alamat: 'Kotabaru, Yogyakarta',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-20'
      },
      {
        id: 13,
        role: 'siswa',
        nama: 'Rizky Ramadhan',
        email: 'rizky.ramadhan@bimbelindonesia.test',
        password: 'password123',
        no_hp: '6281298765404',
        tanggal_lahir: '2008-12-10',
        kelas: 'Kelas 12',
        sekolah: 'SMAN 1 Surabaya',
        kota: 'Surabaya',
        alamat: 'Gubeng, Surabaya',
        status: 'aktif',
        avatar: 'assets/img/avatar.svg',
        created_at: '2026-10-22'
      }
    ],
    programs: [
      {
        id: 1,
        nama: 'Matematika',
        kategori: 'Sains',
        deskripsi: 'Kuasai konsep matematika dari dasar hingga tingkat lanjut bersama tutor berpengalaman. Materi disusun bertahap dan mudah dipahami.',
        harga_mulai: 450000,
        thumbnail: 'uploads/programs/program-matematika.svg',
        status: 'aktif'
      },
      {
        id: 2,
        nama: 'Bahasa Inggris',
        kategori: 'Bahasa',
        deskripsi: 'Tingkatkan kemampuan speaking, listening, reading, dan writing dengan metode praktik percakapan yang aktif dan menyenangkan.',
        harga_mulai: 350000,
        thumbnail: 'uploads/programs/program-bahasa-inggris.svg',
        status: 'aktif'
      },
      {
        id: 3,
        nama: 'IPA Terpadu',
        kategori: 'Sains',
        deskripsi: 'Belajar Fisika, Kimia, dan Biologi dengan pendekatan eksperimen sederhana dan pemahaman konsep yang mendalam.',
        harga_mulai: 400000,
        thumbnail: 'uploads/programs/program-ipa.svg',
        status: 'aktif'
      },
      {
        id: 4,
        nama: 'Persiapan UTBK',
        kategori: 'Ujian',
        deskripsi: 'Program intensif persiapan UTBK dengan try out rutin, pembahasan soal, dan strategi pengerjaan yang efektif.',
        harga_mulai: 700000,
        thumbnail: 'uploads/programs/program-utbk.svg',
        status: 'aktif'
      }
    ],
    packages: [
      {
        id: 1,
        program_id: 1,
        nama: 'Matematika Intensif',
        harga: 450000,
        durasi_bulan: 3,
        jumlah_pertemuan: 12,
        deskripsi: '12 pertemuan live class, modul digital, latihan soal mingguan, dan akses rekaman.',
        fitur: ['3 bulan belajar', '12 pertemuan live', 'Materi & latihan soal', 'Try out dan pembahasan'],
        is_popular: false,
        status: 'aktif'
      },
      {
        id: 2,
        program_id: 2,
        nama: 'English Conversation Club',
        harga: 350000,
        durasi_bulan: 2,
        jumlah_pertemuan: 8,
        deskripsi: '8 sesi conversation, koreksi pronunciation, dan materi digital.',
        fitur: ['2 bulan belajar', '8 pertemuan live', 'Materi & latihan soal', 'Try out dan pembahasan'],
        is_popular: false,
        status: 'aktif'
      },
      {
        id: 3,
        program_id: 3,
        nama: 'Sains Ceria',
        harga: 400000,
        durasi_bulan: 3,
        jumlah_pertemuan: 12,
        deskripsi: 'Pemahaman konsep IPA dengan visual interaktif dan kuis seru.',
        fitur: ['3 bulan belajar', '12 pertemuan live', 'Materi & latihan soal', 'Try out dan pembahasan'],
        is_popular: false,
        status: 'aktif'
      },
      {
        id: 4,
        program_id: 4,
        nama: 'UTBK Saintek',
        harga: 750000,
        durasi_bulan: 4,
        jumlah_pertemuan: 16,
        deskripsi: '16 sesi intensif, 4 try out, pembahasan lengkap, dan konsultasi jurusan.',
        fitur: ['4 bulan belajar', '16 pertemuan live', 'Materi & latihan soal', 'Try out dan pembahasan'],
        is_popular: true,
        status: 'aktif'
      },
      {
        id: 5,
        program_id: 4,
        nama: 'UTBK Soshum',
        harga: 700000,
        durasi_bulan: 4,
        jumlah_pertemuan: 16,
        deskripsi: 'Persiapan UTBK Soshum dengan latihan soal terbaru dan strategi belajar.',
        fitur: ['4 bulan belajar', '16 pertemuan live', 'Materi & latihan soal', 'Try out dan pembahasan'],
        is_popular: false,
        status: 'aktif'
      }
    ],
    classes: [
      {
        id: 1,
        package_id: 1,
        program_id: 1,
        tutor_id: 3,
        nama: 'Matematika Prestasi SMP Kelas 9',
        jenjang: 'SMP',
        kapasitas: 20,
        deskripsi: 'Kelas reguler penguatan materi Matematika SMP Kelas 9 dan persiapan ujian akhir.',
        status: 'aktif'
      },
      {
        id: 2,
        package_id: 2,
        program_id: 2,
        tutor_id: 4,
        nama: 'Active English Speaking Batch 4',
        jenjang: 'SMA',
        kapasitas: 15,
        deskripsi: 'Kelas aktif percakapan Bahasa Inggris, grammar praktis, dan listening.',
        status: 'aktif'
      },
      {
        id: 3,
        package_id: 4,
        program_id: 4,
        tutor_id: 3,
        nama: 'Intensif UTBK Saintek',
        jenjang: 'SMA',
        kapasitas: 25,
        deskripsi: 'Kelas intensif penalaran matematika, pengetahuan kuantitatif, dan literasi UTBK.',
        status: 'aktif'
      },
      {
        id: 4,
        package_id: 1,
        program_id: 1,
        tutor_id: 2,
        nama: 'Kelas Reguler - Matematika SMP',
        jenjang: 'SMP',
        kapasitas: 20,
        deskripsi: 'Kelas bimbingan belajar Matematika terstruktur bersama Kak Arif Wicaksono.',
        status: 'aktif'
      },
      {
        id: 5,
        package_id: 3,
        program_id: 3,
        tutor_id: 2,
        nama: 'IPA Terpadu Eksplorasi SMP',
        jenjang: 'SMP',
        kapasitas: 20,
        deskripsi: 'Kelas Fisika & Biologi terpadu dengan simulasi soal kontekstual.',
        status: 'aktif'
      }
    ],
    enrollments: [
      { id: 1, siswa_id: 9, class_id: 4, package_id: 1, status: 'aktif', created_at: '2026-11-03' },
      { id: 2, siswa_id: 10, class_id: 2, package_id: 2, status: 'aktif', created_at: '2026-10-16' },
      { id: 3, siswa_id: 11, class_id: 3, package_id: 4, status: 'aktif', created_at: '2026-10-19' },
      { id: 4, siswa_id: 12, class_id: 4, package_id: 1, status: 'aktif', created_at: '2026-10-21' },
      { id: 5, siswa_id: 13, class_id: 3, package_id: 4, status: 'aktif', created_at: '2026-10-23' }
    ],
    schedules: [
      {
        id: 6,
        class_id: 4,
        tutor_id: 2,
        tanggal: '2026-11-18',
        jam_mulai: '16:00',
        jam_selesai: '17:30',
        topik: 'Persamaan & Pertidaksamaan Linear Satu Variabel',
        meeting_link: 'https://meet.google.com/bimbel-matematika-smp',
        status: 'terjadwal'
      },
      {
        id: 7,
        class_id: 4,
        tutor_id: 2,
        tanggal: '2026-11-05',
        jam_mulai: '16:00',
        jam_selesai: '17:30',
        topik: 'Pengantar Aljabar & Operasi Bentuk Aljabar',
        meeting_link: 'https://meet.google.com/bimbel-matematika-smp',
        status: 'selesai'
      },
      {
        id: 8,
        class_id: 4,
        tutor_id: 2,
        tanggal: '2026-11-10',
        jam_mulai: '16:00',
        jam_selesai: '17:30',
        topik: 'Fungsi Linear dan Grafik Persamaan Garis Lurus',
        meeting_link: 'https://meet.google.com/bimbel-matematika-smp',
        status: 'selesai'
      },
      {
        id: 9,
        class_id: 3,
        tutor_id: 3,
        tanggal: '2026-11-19',
        jam_mulai: '18:30',
        jam_selesai: '20:30',
        topik: 'Penalaran Matematika UTBK: Barisan & Deret Kontekstual',
        meeting_link: 'https://meet.google.com/bimbel-utbk-saintek',
        status: 'terjadwal'
      },
      {
        id: 10,
        class_id: 2,
        tutor_id: 4,
        tanggal: '2026-11-12',
        jam_mulai: '15:30',
        jam_selesai: '17:00',
        topik: 'Daily Conversation: Expressing Opinions & Agreeing',
        meeting_link: 'https://meet.google.com/bimbel-english-club',
        status: 'selesai'
      }
    ],
    attendance: [
      { id: 1, schedule_id: 7, siswa_id: 9, status: 'hadir', catatan: 'Aktif bertanya dan menjawab latihan' },
      { id: 2, schedule_id: 7, siswa_id: 12, status: 'hadir', catatan: 'Hadir tepat waktu' },
      { id: 3, schedule_id: 8, siswa_id: 9, status: 'hadir', catatan: 'Mengerjakan semua kuis' },
      { id: 4, schedule_id: 8, siswa_id: 12, status: 'izin', catatan: 'Kegiatan ekstrakurikuler sekolah' },
      { id: 5, schedule_id: 10, siswa_id: 10, status: 'hadir', catatan: 'Pronunciation sangat baik' }
    ],
    materials: [
      {
        id: 4,
        class_id: 4,
        tutor_id: 2,
        judul: 'Modul Persamaan Linear & Latihan Soal Terpadu',
        deskripsi: 'Ringkasan rumus persamaan linear satu variabel beserta 25 contoh soal dan pembahasan langkah demi langkah.',
        tipe: 'link',
        url: 'https://example.com/modul-persamaan-linear.pdf',
        file_name: '',
        created_at: '2026-11-03'
      },
      {
        id: 5,
        class_id: 4,
        tutor_id: 2,
        judul: 'Video Rekaman: Grafik Persamaan Garis Lurus',
        deskripsi: 'Video penjelasan cara menentukan gradien dan menyusun persamaan garis lurus dengan cepat.',
        tipe: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        file_name: '',
        created_at: '2026-11-10'
      },
      {
        id: 6,
        class_id: 3,
        tutor_id: 3,
        judul: 'Paket Modul Penalaran Matematika UTBK 2026',
        deskripsi: 'Kumpulan soal asli tipe UTBK SNBT beserta trik pengerjaan hemat waktu.',
        tipe: 'file',
        url: '#download-modul-utbk',
        file_name: 'Modul-Penalaran-Matematika-UTBK.pdf',
        created_at: '2026-11-08'
      },
      {
        id: 7,
        class_id: 2,
        tutor_id: 4,
        judul: '50 Everyday English Idioms & Conversation Prompts',
        deskripsi: 'Panduan idiom bahasa Inggris sehari-hari untuk memperlancar speaking.',
        tipe: 'link',
        url: 'https://example.com/english-idioms-guide',
        file_name: '',
        created_at: '2026-11-06'
      }
    ],
    questions: [
      {
        id: 6,
        class_id: 4,
        tutor_id: 2,
        pertanyaan: 'Jika 3x + 2 = 14, berapakah nilai x?',
        opsi_a: '2',
        opsi_b: '3',
        opsi_c: '4',
        opsi_d: '5',
        jawaban_benar: 'C',
        pembahasan: '3x + 2 = 14 → 3x = 12, sehingga x = 12 / 3 = 4.',
        status: 'aktif',
        created_at: '2026-11-03'
      },
      {
        id: 7,
        class_id: 4,
        tutor_id: 2,
        pertanyaan: 'Gradien garis yang memiliki persamaan y = 4x - 7 adalah...',
        opsi_a: '-7',
        opsi_b: '-4',
        opsi_c: '4',
        opsi_d: '7',
        jawaban_benar: 'C',
        pembahasan: 'Pada bentuk eksplisit y = mx + c, koefisien x adalah gradien (m). Maka m = 4.',
        status: 'aktif',
        created_at: '2026-11-06'
      },
      {
        id: 8,
        class_id: 4,
        tutor_id: 2,
        pertanyaan: 'Himpunan penyelesaian dari 2(x - 3) = x + 1 adalah...',
        opsi_a: 'x = 5',
        opsi_b: 'x = 7',
        opsi_c: 'x = -5',
        opsi_d: 'x = 4',
        jawaban_benar: 'B',
        pembahasan: '2x - 6 = x + 1 → 2x - x = 1 + 6 → x = 7.',
        status: 'aktif',
        created_at: '2026-11-08'
      },
      {
        id: 9,
        class_id: 3,
        tutor_id: 3,
        pertanyaan: 'Suatu barisan aritmetika memiliki suku pertama 5 dan beda 3. Suku ke-10 barisan tersebut adalah...',
        opsi_a: '29',
        opsi_b: '32',
        opsi_c: '35',
        opsi_d: '38',
        jawaban_benar: 'B',
        pembahasan: 'Un = a + (n-1)b → U10 = 5 + 9(3) = 5 + 27 = 32.',
        status: 'aktif',
        created_at: '2026-11-09'
      }
    ],
    exams: [
      {
        id: 2,
        class_id: 4,
        tutor_id: 2,
        judul: 'Latihan Persamaan Linear & Aljabar',
        deskripsi: 'Evaluasi pemahaman konsep persamaan linear satu variabel dan gradien garis.',
        durasi_menit: 20,
        jumlah_soal: 3,
        status: 'aktif',
        created_at: '2026-11-03'
      },
      {
        id: 3,
        class_id: 3,
        tutor_id: 3,
        judul: 'Try Out UTBK Penalaran Matematika #1',
        deskripsi: 'Simulasi berbatas waktu untuk mengukur kesiapan menghadapi SNBT.',
        durasi_menit: 45,
        jumlah_soal: 20,
        status: 'aktif',
        created_at: '2026-11-10'
      }
    ],
    examResults: [
      {
        id: 1,
        exam_id: 2,
        siswa_id: 9,
        nilai: 100.0,
        tanggal: '2026-11-04'
      },
      {
        id: 2,
        exam_id: 2,
        siswa_id: 12,
        nilai: 88.5,
        tanggal: '2026-11-05'
      },
      {
        id: 3,
        exam_id: 3,
        siswa_id: 11,
        nilai: 92.0,
        tanggal: '2026-11-11'
      }
    ],
    coupons: [
      {
        id: 1,
        kode: 'HEMAT50K',
        tipe: 'nominal',
        nilai: 50000,
        kuota: 50,
        terpakai: 4,
        berlaku_sampai: '2026-12-31',
        status: 'aktif'
      },
      {
        id: 2,
        kode: 'UTBK10',
        tipe: 'persen',
        nilai: 10,
        kuota: 30,
        terpakai: 2,
        berlaku_sampai: '2026-12-31',
        status: 'aktif'
      },
      {
        id: 3,
        kode: 'JUARA2026',
        tipe: 'nominal',
        nilai: 75000,
        kuota: 25,
        terpakai: 1,
        berlaku_sampai: '2026-12-15',
        status: 'aktif'
      }
    ],
    payments: [
      {
        id: 8,
        invoice: 'INV-20261103-88C102',
        siswa_id: 9,
        package_id: 1,
        class_id: 4,
        harga_awal: 450000,
        diskon: 0,
        kupon: '',
        nominal: 450000,
        metode: 'bank_transfer',
        status: 'lunas',
        tanggal: '2026-11-03',
        paid_at: '3 November 2026',
        bukti: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520"><rect width="400" height="520" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><rect x="28" y="28" width="344" height="70" rx="12" fill="#1d4ed8"/><text x="50" y="62" fill="#fff" font-family="Arial" font-weight="bold" font-size="18">BUKTI TRANSFER BCA</text><text x="50" y="84" fill="#dbeafe" font-family="Arial" font-size="12">BERHASIL · 03/11/2026 14:22 WIB</text><text x="40" y="140" fill="#64748b" font-family="Arial" font-size="12">TUJUAN TRANSFER</text><text x="40" y="162" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="15">PT BIMBEL INDONESIA EDUKASI</text><text x="40" y="182" fill="#475569" font-family="Arial" font-size="13">BCA · 1234567890</text><line x1="40" y1="205" x2="360" y2="205" stroke="#e2e8f0" stroke-width="2"/><text x="40" y="240" fill="#64748b" font-family="Arial" font-size="12">NOMINAL TRANSFER</text><text x="40" y="272" fill="#047857" font-family="Arial" font-weight="bold" font-size="26">Rp 450.000</text><text x="40" y="320" fill="#64748b" font-family="Arial" font-size="12">BERITA / KETERANGAN</text><text x="40" y="344" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="14">INV-20261103-88C102</text><rect x="40" y="410" width="320" height="60" rx="10" fill="#ecfdf5" stroke="#a7f3d0"/><text x="70" y="445" fill="#065f46" font-family="Arial" font-weight="bold" font-size="14">TRANSAKSI BERHASIL</text></svg>'),
        catatan_admin: 'Pembayaran telah diterima dan diverifikasi.'
      },
      {
        id: 7,
        invoice: 'INV-20261105-A9BB34',
        siswa_id: 9,
        package_id: 2,
        class_id: 2,
        harga_awal: 350000,
        diskon: 0,
        kupon: '',
        nominal: 350000,
        metode: 'bank_transfer',
        status: 'pending',
        tanggal: '2026-11-05',
        paid_at: '',
        bukti: '',
        catatan_admin: ''
      },
      {
        id: 6,
        invoice: 'INV-20261112-7F21B9',
        siswa_id: 11,
        package_id: 4,
        class_id: 3,
        harga_awal: 750000,
        diskon: 50000,
        kupon: 'HEMAT50K',
        nominal: 700000,
        metode: 'qris',
        status: 'lunas',
        tanggal: '2026-11-12',
        paid_at: '12 November 2026',
        bukti: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520"><rect width="400" height="520" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><rect x="28" y="28" width="344" height="70" rx="12" fill="#0d9488"/><text x="50" y="62" fill="#fff" font-family="Arial" font-weight="bold" font-size="18">BUKTI PEMBAYARAN QRIS</text><text x="50" y="84" fill="#ccfbf1" font-family="Arial" font-size="12">BERHASIL · 12/11/2026 09:15 WIB</text><text x="40" y="140" fill="#64748b" font-family="Arial" font-size="12">MERCHANT</text><text x="40" y="162" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="15">BIMBEL INDONESIA</text><line x1="40" y1="205" x2="360" y2="205" stroke="#e2e8f0" stroke-width="2"/><text x="40" y="240" fill="#64748b" font-family="Arial" font-size="12">TOTAL BAYAR</text><text x="40" y="272" fill="#047857" font-family="Arial" font-weight="bold" font-size="26">Rp 700.000</text><text x="40" y="320" fill="#64748b" font-family="Arial" font-size="12">INVOICE</text><text x="40" y="344" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="14">INV-20261112-7F21B9</text></svg>'),
        catatan_admin: 'Lunas via QRIS'
      },
      {
        id: 5,
        invoice: 'INV-20261114-C402E1',
        siswa_id: 10,
        package_id: 3,
        class_id: 5,
        harga_awal: 400000,
        diskon: 0,
        kupon: '',
        nominal: 400000,
        metode: 'bank_transfer',
        status: 'menunggu_verifikasi',
        tanggal: '2026-11-14',
        paid_at: '',
        bukti: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520"><rect width="400" height="520" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><rect x="28" y="28" width="344" height="70" rx="12" fill="#2563eb"/><text x="50" y="62" fill="#fff" font-family="Arial" font-weight="bold" font-size="18">BUKTI TRANSFER MANDIRI</text><text x="50" y="84" fill="#dbeafe" font-family="Arial" font-size="12">14/11/2026 19:40 WIB</text><text x="40" y="140" fill="#64748b" font-family="Arial" font-size="12">PENGIRIM</text><text x="40" y="162" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="15">NADIA MAHARANI</text><text x="40" y="240" fill="#64748b" font-family="Arial" font-size="12">NOMINAL</text><text x="40" y="272" fill="#1d4ed8" font-family="Arial" font-weight="bold" font-size="26">Rp 400.000</text><text x="40" y="344" fill="#0f172a" font-family="Arial" font-weight="bold" font-size="14">INV-20261114-C402E1</text></svg>'),
        catatan_admin: ''
      }
    ],
    notifications: [
      {
        id: 1,
        user_id: 9,
        judul: 'Pembayaran Diverifikasi',
        pesan: 'Invoice INV-20261103-88C102 untuk paket Matematika Intensif telah diverifikasi. Selamat belajar!',
         dibaca: false,
        tanggal: '3 November 2026'
      },
      {
        id: 2,
        user_id: 9,
        judul: 'Jadwal Kelas Berikutnya',
        pesan: 'Jangan lewatkan sesi Persamaan & Pertidaksamaan Linear pada Rabu, 18 November 2026 pukul 16:00 WIB.',
        dibaca: false,
        tanggal: '14 November 2026'
      }
    ],
    blogs: [
      {
        id: 1,
        judul: '5 Strategi Belajar Efektif untuk Menghadapi Ujian',
        slug: '5-strategi-belajar-efektif',
        penulis: 'Tim Bimbel Indonesia',
        tanggal: '3 November 2026',
        thumbnail: 'uploads/blog/blog-belajar.svg',
        ringkasan: 'Belajar lama belum tentu efektif. Coba lima strategi ini agar waktu belajarmu lebih berkualitas.',
        konten: '<p>Belajar efektif bukan tentang berapa lama kamu duduk di depan buku, tetapi seberapa fokus dan terstruktur prosesnya.</p><h3>1. Buat target kecil</h3><p>Pecah materi menjadi bagian kecil yang bisa diselesaikan setiap hari.</p><h3>2. Gunakan teknik Pomodoro</h3><p>Belajar 25 menit, istirahat 5 menit, lalu ulangi.</p><h3>3. Latihan soal aktif</h3><p>Uji pemahaman dengan soal, bukan hanya membaca ulang.</p><h3>4. Ajarkan kembali</h3><p>Jelaskan materi dengan bahasa sendiri untuk memperkuat pemahaman.</p><h3>5. Evaluasi rutin</h3><p>Catat kemajuan dan perbaiki bagian yang masih lemah.</p>',
        status: 'publish'
      },
      {
        id: 2,
        judul: 'Cara Menjaga Motivasi Belajar di Rumah',
        slug: 'cara-menjaga-motivasi-belajar',
        penulis: 'Rina Kartika',
        tanggal: '3 November 2026',
        thumbnail: 'uploads/blog/blog-motivasi.svg',
        ringkasan: 'Motivasi naik-turun itu normal. Simak cara sederhana untuk tetap konsisten belajar setiap hari.',
        konten: '<p>Belajar mandiri di rumah sering kali penuh tantangan, mulai dari distraksi gawai hingga rasa jenuh. Berikut langkah praktis untuk menjaga semangat belajarmu tetap menyala.</p><h3>1. Siapkan sudut belajar khusus</h3><p>Pastikan meja belajarmu rapi, terang, dan bebas dari gangguan.</p><h3>2. Buat jadwal rutin</h3><p>Konsistensi 45 menit setiap hari jauh lebih berdampak dibandingkan belajar 5 jam sekaligus hanya menjelang ujian.</p><h3>3. Beri apresiasi pada diri sendiri</h3><p>Rayakan setiap pencapaian kecil setelah menyelesaikan modul atau try out.</p>',
        status: 'publish'
      },
      {
        id: 3,
        judul: 'Mengenal Try Out UTBK dan Manfaatnya',
        slug: 'mengenal-try-out-utbk',
        penulis: 'Budi Santoso',
        tanggal: '3 November 2026',
        thumbnail: 'uploads/blog/blog-utbk.svg',
        ringkasan: 'Try out bukan sekadar nilai. Ini cara melatih strategi dan manajemen waktu sebelum ujian sebenarnya.',
        konten: '<p>Mengikuti try out UTBK secara berkala membantu siswa memetakan kesiapan akademik sekaligus mental.</p><h3>1. Membiasakan manajemen waktu</h3><p>Soal UTBK menuntut ketepatan dan kecepatan berpikir di bawah batas waktu ketat.</p><h3>2. Mengenali pola soal penalaran</h3><p>Dengan rutin berlatih, kamu akan terbiasa membaca soal literasi dan penalaran matematika secara efektif.</p><h3>3. Evaluasi kelemahan sejak dini</h3><p>Gunakan hasil pembahasan try out untuk fokus memperbaiki topik yang belum dikuasai.</p>',
        status: 'publish'
      }
    ],
    testimonials: [
      {
        id: 1,
        nama: 'Nadia Maharani',
        info: 'Siswa Kelas 10',
        pesan: 'Belajar bahasa Inggris jadi tidak membosankan. Banyak praktik conversation yang seru.',
        rating: 5,
        avatar: 'assets/img/avatar.svg',
        status: 'aktif'
      },
      {
        id: 2,
        nama: 'Salsabila Putri',
        info: 'Siswa Kelas 12',
        pesan: 'Program UTBK di sini sangat terstruktur. Try out dan pembahasannya membantu banget.',
        rating: 5,
        avatar: 'assets/img/avatar.svg',
        status: 'aktif'
      },
      {
        id: 3,
        nama: 'Aditya Pratama',
        info: 'Siswa Kelas 9',
        pesan: 'Tutornya sabar dan penjelasannya mudah dipahami. Nilai matematikaku naik dari 70 menjadi 88!',
        rating: 5,
        avatar: 'assets/img/avatar.svg',
        status: 'aktif'
      }
    ],
    faqs: [
      {
        id: 1,
        pertanyaan: 'Bagaimana cara mendaftar?',
        jawaban: 'Klik tombol Daftar Siswa, isi formulir, lalu login menggunakan email dan password yang telah dibuat.'
      },
      {
        id: 2,
        pertanyaan: 'Apakah kelas dilakukan secara online?',
        jawaban: 'Ya, seluruh kelas berlangsung online melalui meeting link yang tersedia di jadwal. Materi juga dapat diakses dari dashboard.'
      },
      {
        id: 3,
        pertanyaan: 'Apakah ada try out?',
        jawaban: 'Tersedia try out berbatas waktu untuk melatih pemahaman dan manajemen waktu. Nilai akan muncul di riwayat siswa.'
      },
      {
        id: 4,
        pertanyaan: 'Bagaimana cara pembayaran?',
        jawaban: 'Transfer ke rekening atau e-wallet yang tersedia, lalu unggah bukti pembayaran untuk diverifikasi admin.'
      },
      {
        id: 5,
        pertanyaan: 'Apakah tutor bisa mendaftar sendiri?',
        jawaban: 'Tidak. Akun tutor dibuat dan dikelola oleh administrator melalui panel pengguna.'
      }
    ],
    waLogs: [
      {
        id: 1,
        penerima_nama: 'Dina Prameswari',
        no_hp: '6281234567898',
        pesan: 'Halo Dina Prameswari, mengingatkan jadwal kelas Matematika besok pukul 16:00 WIB.',
        pengirim: 'Arif Wicaksono (Tutor)',
        tanggal: '14 November 2026 10:15'
      }
    ]
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = clone(DEFAULT_STATE);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(raw);
      return Object.assign(clone(DEFAULT_STATE), parsed);
    } catch (e) {
      return clone(DEFAULT_STATE);
    }
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage:', e);
    }
  }

  function resetState() {
    state = clone(DEFAULT_STATE);
    saveState();
    return state;
  }

  function nextId(collection) {
    const arr = state[collection] || [];
    return arr.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  }

  function formatRupiah(amount) {
    const num = Number(amount) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function formatDateId(dateStr, withDay) {
    if (!dateStr) return '-';
    if (/[A-Za-z]/.test(dateStr) && !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr;
    const parts = String(dateStr).slice(0, 10).split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return dateStr;
    const base = d.getDate() + ' ' + MONTHS_ID[d.getMonth()] + ' ' + d.getFullYear();
    return withDay ? DAYS_ID[d.getDay()] + ', ' + base : base;
  }

  function getCurrentUser() {
    if (!state.currentUserId) return null;
    return state.users.find(u => u.id === Number(state.currentUserId)) || null;
  }

  function setCurrentUser(userId) {
    state.currentUserId = userId ? Number(userId) : null;
    saveState();
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(file);
    });
  }

  // Invoice PNG Generator (exact 1200x1500 layout matching Bimbel Indonesia)
  function downloadInvoicePng(payment) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Browser tidak mendukung pembuatan gambar.');
        canvas.width = 1200;
        canvas.height = 1500;

        const pkg = state.packages.find(p => p.id === Number(payment.package_id));
        const student = state.users.find(u => u.id === Number(payment.siswa_id));

        const invoice = payment.invoice || '';
        const packageName = pkg ? pkg.nama : (payment.package_name || 'Paket Belajar');
        const studentName = student ? student.nama : (payment.student_name || 'Siswa');
        const paidAt = payment.paid_at || formatDateId(payment.tanggal);
        const paymentMethod = payment.metode || 'manual';
        const methodLabels = {
          manual: 'Transfer manual',
          bank_transfer: 'Transfer bank',
          qris: 'QRIS',
          ewallet: 'E-wallet'
        };
        const methodLabel = methodLabels[String(paymentMethod).toLowerCase()] || String(paymentMethod).replace(/_/g, ' ');
        const amount = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(Number(payment.nominal) || 0);

        function roundedRect(x, y, width, height, radius, color) {
          context.fillStyle = color;
          context.beginPath();
          context.roundRect(x, y, width, height, radius);
          context.fill();
        }

        function write(text, x, y, font, color, maxWidth) {
          context.font = font;
          context.fillStyle = color;
          let value = String(text);
          if (maxWidth && context.measureText(value).width > maxWidth) {
            while (value.length > 1 && context.measureText(value + '…').width > maxWidth) {
              value = value.slice(0, -1);
            }
            value += '…';
          }
          context.fillText(value, x, y);
        }

        function separator(y, x1 = 112, x2 = 1088) {
          context.strokeStyle = '#e8eeea';
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(x1, y);
          context.lineTo(x2, y);
          context.stroke();
        }

        function checkMark(x, y, radius, fill) {
          context.fillStyle = fill;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
          context.strokeStyle = '#ffffff';
          context.lineWidth = Math.max(3, radius * 0.18);
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.beginPath();
          context.moveTo(x - radius * 0.42, y);
          context.lineTo(x - radius * 0.1, y + radius * 0.32);
          context.lineTo(x + radius * 0.46, y - radius * 0.34);
          context.stroke();
        }

        context.fillStyle = '#edf3ef';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(20, 107, 86, .055)';
        context.beginPath();
        context.arc(1120, 80, 190, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(40, 1410, 160, 0, Math.PI * 2);
        context.fill();

        context.shadowColor = 'rgba(18, 55, 45, .12)';
        context.shadowBlur = 42;
        context.shadowOffsetY = 16;
        roundedRect(58, 48, 1084, 1404, 32, '#ffffff');
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;

        context.save();
        context.beginPath();
        context.roundRect(58, 48, 1084, 1404, 32);
        context.clip();
        const headerGradient = context.createLinearGradient(58, 48, 1142, 428);
        headerGradient.addColorStop(0, '#0e6b59');
        headerGradient.addColorStop(0.55, '#105d50');
        headerGradient.addColorStop(1, '#123f3b');
        context.fillStyle = headerGradient;
        context.fillRect(58, 48, 1084, 380);

        context.fillStyle = 'rgba(255,255,255,.045)';
        context.beginPath();
        context.arc(1060, 100, 210, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(1010, 70, 145, 0, Math.PI * 2);
        context.fill();
        context.restore();

        roundedRect(112, 92, 64, 64, 19, 'rgba(255,255,255,.15)');
        write('BI', 126, 134, '800 25px Arial, sans-serif', '#ffffff');
        write((state.settings.site_name || 'BIMBEL INDONESIA').toUpperCase(), 198, 117, '700 22px Arial, sans-serif', '#ffffff');
        write('RUANG BELAJAR, LANGKAH MENUJU PRESTASI', 198, 145, '500 12px Arial, sans-serif', 'rgba(255,255,255,.7)');

        write('INVOICE', 112, 255, '800 51px Arial, sans-serif', '#ffffff');
        write('PEMBAYARAN BERHASIL', 116, 292, '600 16px Arial, sans-serif', 'rgba(255,255,255,.76)');
        roundedRect(904, 220, 184, 58, 29, '#d9f6e5');
        checkMark(933, 249, 13, '#198754');
        write('LUNAS', 960, 256, '800 18px Arial, sans-serif', '#17623f');

        roundedRect(100, 376, 1000, 150, 22, '#ffffff');
        write('NOMOR INVOICE', 136, 420, '700 12px Arial, sans-serif', '#7b8b83');
        write(invoice, 136, 467, '700 23px Arial, sans-serif', '#1d3029', 560);
        context.fillStyle = '#dfe9e3';
        context.fillRect(620, 399, 2, 82);
        write('TANGGAL PEMBAYARAN', 662, 420, '700 12px Arial, sans-serif', '#7b8b83');
        write(paidAt, 662, 467, '700 21px Arial, sans-serif', '#1d3029', 390);

        roundedRect(112, 568, 976, 220, 24, '#f1f8f3');
        roundedRect(112, 568, 10, 220, 5, '#218568');
        write('TOTAL DIBAYARKAN', 158, 620, '700 14px Arial, sans-serif', '#63766b');
        write(amount, 154, 696, '800 53px Arial, sans-serif', '#116b55', 880);
        write('Pembayaran telah diterima dan diverifikasi oleh admin.', 158, 746, '400 16px Arial, sans-serif', '#63766b', 860);

        write('RINCIAN TRANSAKSI', 112, 860, '800 15px Arial, sans-serif', '#64766c');
        separator(884);

        const details = [
          ['DIBAYARKAN OLEH', studentName],
          ['PAKET BELAJAR', packageName],
          ['METODE PEMBAYARAN', methodLabel]
        ];
        details.forEach(function (item, index) {
          const rowTop = 908 + index * 84;
          write(item[0], 114, rowTop + 29, '700 11px Arial, sans-serif', '#84938b');
          write(item[1], 500, rowTop + 31, '700 19px Arial, sans-serif', '#24372e', 570);
          if (index < details.length - 1) separator(rowTop + 54);
        });

        roundedRect(112, 1196, 976, 104, 18, '#f7faf8');
        checkMark(158, 1248, 20, '#16845f');
        write('Transaksi terkonfirmasi', 198, 1243, '700 18px Arial, sans-serif', '#1d3029');
        write('Invoice ini adalah bukti pembayaran elektronik Anda.', 198, 1272, '400 14px Arial, sans-serif', '#718078', 820);

        separator(1340);
        write('Terima kasih telah mempercayakan perjalanan belajarmu kepada kami.', 112, 1382, '600 15px Arial, sans-serif', '#52665b', 970);
        write('BIMBEL INDONESIA  ·  BELAJAR LEBIH MUDAH, RAIH PRESTASI LEBIH TINGGI', 112, 1414, '700 11px Arial, sans-serif', '#91a097', 970);

        canvas.toBlob(function (blob) {
          if (!blob) return reject(new Error('Gambar invoice gagal dibuat.'));
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = 'invoice-' + invoice.replace(/[^a-zA-Z0-9_-]/g, '-') + '.png';
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
          resolve();
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    });
  }

  window.BimbelStore = {
    get state() { return state; },
    save: saveState,
    reset: resetState,
    nextId,
    formatRupiah,
    formatDateId,
    getCurrentUser,
    setCurrentUser,
    readFileAsDataURL,
    downloadInvoicePng
  };
})(window);

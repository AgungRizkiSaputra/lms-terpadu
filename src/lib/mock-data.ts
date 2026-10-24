import {
  Profile,
  School,
  AcademicYear,
  ClassRoom,
  Subject,
  LearningMaterial,
  Assignment,
  Submission,
  Exam,
  ExamQuestion,
  Announcement,
  NotificationItem,
  SchoolEvent,
  ClassSchedule,
} from "@/types/database";

export const initialSchool: School = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "SMA Cendekia Nusantara",
  npsn: "99281726",
  level: "SMA",
  logo_url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80",
  address: "Jl. Cendekia Terpadu No. 101, Kompleks Pendidikan Mandiri, Nusantara",
  phone: "(021) 789-0123",
  email: "info@cendekianusantara.sch.id",
  website: "https://cendekianusantara.sch.id",
};

export const initialAcademicYear: AcademicYear = {
  id: "22222222-2222-2222-2222-222222222222",
  school_id: initialSchool.id,
  name: "2026/2027",
  semester: "Ganjil",
  start_date: "2026-07-15",
  end_date: "2026-12-22",
  is_active: true,
};

export const initialProfiles: Profile[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "admin@sekolah.id",
    full_name: "Dr. H. Raden Permadi, M.Pd.",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    role: "admin",
    school_id: initialSchool.id,
    nip_nisn: "197805122002121001",
    phone: "081234567890",
    bio: "Kepala Bagian Akademik & Administrator Sistem LMS Terpadu SMA Cendekia Nusantara.",
    is_active: true,
  },
  {
    id: "b0000000-0000-0000-0000-000000000001",
    email: "budi.santoso@sekolah.id",
    full_name: "Budi Santoso, S.Pd., M.Mat.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "guru",
    school_id: initialSchool.id,
    nip_nisn: "198503142009031004",
    phone: "081398765432",
    bio: "Guru Pengampu Matematika Wajib & Peminatan. Wali Kelas X-1.",
    is_active: true,
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    email: "siti.rahma@sekolah.id",
    full_name: "Dra. Hj. Siti Rahmawati, M.Pd.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "guru",
    school_id: initialSchool.id,
    nip_nisn: "198207182006042008",
    phone: "081512349876",
    bio: "Guru Bahasa dan Sastra Indonesia. Pembina Kegiatan Jurnalistik dan Literasi Sekolah.",
    is_active: true,
  },
  {
    id: "b0000000-0000-0000-0000-000000000003",
    email: "hendra.wijaya@sekolah.id",
    full_name: "Hendra Wijaya, S.Kom., M.T.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "guru",
    school_id: initialSchool.id,
    nip_nisn: "199104252018021003",
    phone: "081809876543",
    bio: "Guru Informatika dan Rekayasa Perangkat Lunak. Pembimbing Tim Olimpiade Komputer.",
    is_active: true,
  },
  {
    id: "c0000000-0000-0000-0000-000000000001",
    email: "ahmad.fauzi@siswa.belajar.id",
    full_name: "Ahmad Fauzi Ramadhan",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    role: "siswa",
    school_id: initialSchool.id,
    nip_nisn: "0078129481",
    phone: "082155566677",
    bio: "Siswa Kelas X-1. Ketua Kelompok Sains dan Penggemar Coding Web.",
    is_active: true,
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    email: "nadia.safira@siswa.belajar.id",
    full_name: "Nadia Safira Azzahra",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "siswa",
    school_id: initialSchool.id,
    nip_nisn: "0078432190",
    phone: "082177788899",
    bio: "Siswa Kelas X-1. Anggota OSIS Seksi Pendidikan & Bahasa.",
    is_active: true,
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    email: "rizky.pratama@siswa.belajar.id",
    full_name: "Rizky Pratama Kusuma",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    role: "siswa",
    school_id: initialSchool.id,
    nip_nisn: "0078901234",
    phone: "082199900011",
    bio: "Siswa Kelas X-2. Atlet Basket Sekolah & Pencinta Literasi Digital.",
    is_active: true,
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    email: "siti.anisa@siswa.belajar.id",
    full_name: "Siti Anisa Maharani",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "siswa",
    school_id: initialSchool.id,
    nip_nisn: "0078905678",
    phone: "082199900022",
    bio: "Siswa Kelas X-2. Juara Lomba Puisi & Anggota PMR.",
    is_active: true,
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    email: "dimas.saputra@siswa.belajar.id",
    full_name: "Dimas Saputra",
    avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    role: "siswa",
    school_id: initialSchool.id,
    nip_nisn: "0078909876",
    phone: "082199900033",
    bio: "Siswa Kelas X-2. Wakil Ketua Kelas X-2 & Penggemar Robotika.",
    is_active: true,
  },
];

export const initialClasses: ClassRoom[] = [
  {
    id: "33333333-3333-3333-3333-333333333301",
    school_id: initialSchool.id,
    academic_year_id: initialAcademicYear.id,
    grade_level: "X",
    name: "X-1 (MIPA Unggulan)",
    homeroom_teacher_id: "b0000000-0000-0000-0000-000000000001",
    capacity: 36,
    total_students: 34,
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    school_id: initialSchool.id,
    academic_year_id: initialAcademicYear.id,
    grade_level: "X",
    name: "X-2 (Reguler)",
    homeroom_teacher_id: "b0000000-0000-0000-0000-000000000002",
    capacity: 36,
    total_students: 35,
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    school_id: initialSchool.id,
    academic_year_id: initialAcademicYear.id,
    grade_level: "XI",
    name: "XI-1 (MIPA)",
    homeroom_teacher_id: "b0000000-0000-0000-0000-000000000003",
    capacity: 36,
    total_students: 32,
  },
];

export const initialSubjects: Subject[] = [
  {
    id: "44444444-4444-4444-4444-444444444401",
    school_id: initialSchool.id,
    code: "MAT-X",
    name: "Matematika Terpadu",
    description: "Materi Aljabar, Eksponen, Logaritma, dan Matriks tingkat SMA",
    category: "Wajib",
    passing_grade: 75,
  },
  {
    id: "44444444-4444-4444-4444-444444444402",
    school_id: initialSchool.id,
    code: "BIN-X",
    name: "Bahasa dan Sastra Indonesia",
    description: "Teks LHO, Eksposisi, Anekdot, dan Karya Sastra Klasik",
    category: "Wajib",
    passing_grade: 75,
  },
  {
    id: "44444444-4444-4444-4444-444444444403",
    school_id: initialSchool.id,
    code: "INF-X",
    name: "Informatika & Logika Algoritma",
    description: "Algoritma, Pemrograman Web, dan Etika Digital",
    category: "Peminatan",
    passing_grade: 78,
  },
  {
    id: "44444444-4444-4444-4444-444444444404",
    school_id: initialSchool.id,
    code: "BIG-X",
    name: "Bahasa Inggris Kontekstual",
    description: "Descriptive Text, Recount, and Academic Communication",
    category: "Wajib",
    passing_grade: 75,
  },
];

export const initialMaterials: LearningMaterial[] = [
  {
    id: "66666666-6666-6666-6666-666666666601",
    class_id: "33333333-3333-3333-3333-333333333301",
    subject_id: "44444444-4444-4444-4444-444444444401",
    author_id: "b0000000-0000-0000-0000-000000000001",
    title: "Modul 1: Konsep Dasar Matriks & Operasi Aljabar Linear",
    description: "Pemahaman mendalam mengenai definisi ordo matriks, transpose, penjumlahan, dan perkalian matriks skalar.",
    content: "<h3>Tujuan Pembelajaran</h3><p>Setelah mempelajari modul ini, siswa diharapkan mampu memahami definisi ordo, transpose, dan operasi aljabar matriks secara matematis.</p><h4>1. Pengertian Matriks</h4><p>Matriks adalah susunan bilangan beraturan dalam baris dan kolom yang dibatasi tanda kurung siku.</p><h4>2. Perkalian Matriks</h4><p>Syarat dua matriks dapat dikalikan adalah jumlah kolom matriks pertama harus sama dengan jumlah baris matriks kedua.</p>",
    order_index: 1,
    video_url: "https://www.youtube.com/watch?v=kYB8IZa5AuE",
    status: "published",
    created_at: "2026-10-18T08:00:00Z",
    updated_at: "2026-10-18T08:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666602",
    class_id: "33333333-3333-3333-3333-333333333301",
    subject_id: "44444444-4444-4444-4444-444444444402",
    author_id: "b0000000-0000-0000-0000-000000000002",
    title: "Modul 1: Menulis Teks Laporan Hasil Observasi Objektif",
    description: "Struktur teks laporan, ciri kebahasaan, kalimat definisi, dan verba relasional.",
    content: "<h3>Karakteristik Teks LHO</h3><p>Teks laporan hasil observasi harus bersifat faktual, objektif, dan tidak memuat prasangka subjektif penulis.</p><ol><li>Pernyataan umum / klasifikasi</li><li>Deskripsi bagian</li><li>Deskripsi manfaat / simpulan</li></ol>",
    order_index: 1,
    video_url: null,
    status: "published",
    created_at: "2026-10-19T09:00:00Z",
    updated_at: "2026-10-19T09:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666603",
    class_id: "33333333-3333-3333-3333-333333333301",
    subject_id: "44444444-4444-4444-4444-444444444403",
    author_id: "b0000000-0000-0000-0000-000000000003",
    title: "Modul 1: Fondasi Berpikir Komputasional & Flowchart Logika",
    description: "Konsep 4 pilar Computational Thinking: Dekomposisi, Pengenalan Pola, Abstraksi, dan Desain Algoritma.",
    content: "<h3>4 Fondasi Berpikir Komputasional</h3><p>Berpikir komputasional adalah metode pemecahan masalah sistematis.</p><ul><li><b>Dekomposisi:</b> Memecah persoalan besar menjadi bagian-bagian terkelola.</li><li><b>Abstraksi:</b> Memusatkan perhatian pada informasi yang paling relevan.</li></ul>",
    order_index: 1,
    video_url: "https://www.youtube.com/watch?v=mUXo-S8gkds",
    status: "published",
    created_at: "2026-10-20T10:00:00Z",
    updated_at: "2026-10-20T10:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666604",
    class_id: "33333333-3333-3333-3333-333333333302", // X-2
    subject_id: "44444444-4444-4444-4444-444444444401", // Matematika Terpadu
    author_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    title: "Modul 1: Sistem Persamaan Linear Tiga Variabel (SPLTV)",
    description: "Pemahaman konsep SPLTV, pemodelan masalah kontekstual ke dalam persamaan aljabar matematika, dan metode penyelesaian eliminasi-substitusi.",
    content: "<h3>Tujuan Pembelajaran</h3><p>Mampu merumuskan model matematika dari permasalahan kontekstual dan menyelesaikan sistem persamaan linear tiga variabel secara runtut.</p><h4>1. Bentuk Umum SPLTV</h4><p>ax + by + cz = d</p><h4>2. Metode Penyelesaian</h4><ol><li>Metode Eliminasi</li><li>Metode Substitusi</li><li>Metode Gabungan (Eliminasi-Substitusi)</li></ol>",
    order_index: 1,
    video_url: "https://www.youtube.com/watch?v=kYB8IZa5AuE",
    status: "published",
    created_at: "2026-10-21T08:00:00Z",
    updated_at: "2026-10-21T08:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666605",
    class_id: "33333333-3333-3333-3333-333333333302", // X-2
    subject_id: "44444444-4444-4444-4444-444444444403", // Informatika & Logika Algoritma (Mapel ke-2 yang diampu Budi)
    author_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    title: "Modul 1: Dasar Pemrograman Web & Struktur HTML5 Semantik",
    description: "Pengenalan tag HTML5, elemen dokumen, formulir interaktif, dan standar semantik web modern.",
    content: "<h3>Pengantar HTML5</h3><p>HTML (HyperText Markup Language) adalah bahasa markup standar untuk dokumen yang dirancang untuk ditampilkan di peramban internet.</p><h4>Struktur Dasar Dokumen:</h4><p>&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;...&lt;/head&gt;&lt;body&gt;...&lt;/body&gt;&lt;/html&gt;</p>",
    order_index: 1,
    video_url: "https://www.youtube.com/watch?v=mUXo-S8gkds",
    status: "published",
    created_at: "2026-10-21T09:00:00Z",
    updated_at: "2026-10-21T09:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666606",
    class_id: "33333333-3333-3333-3333-333333333301", // X-1
    subject_id: "44444444-4444-4444-4444-444444444403", // Informatika & Logika Algoritma
    author_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    title: "Modul 2: Praktikum Struktur Data & Logika Percabangan",
    description: "Implementasi logika boolean, percabangan IF-ELSE majemuk, dan struktur data array sederhana dalam pemecahan masalah algoritma.",
    content: "<h3>Struktur Kendali Percabangan</h3><p>Percabangan memungkinkan program mengambil keputusan berdasarkan evaluasi kondisi boolean (True / False).</p><ul><li><b>If Tunggal:</b> Mengeksekusi blok kode hanya jika kondisi terpenuhi.</li><li><b>If-Else Majemuk:</b> Menangani berbagai alternatif kondisi berjenjang.</li></ul>",
    order_index: 2,
    video_url: "https://www.youtube.com/watch?v=mUXo-S8gkds",
    status: "published",
    created_at: "2026-10-21T11:00:00Z",
    updated_at: "2026-10-21T11:00:00Z",
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: "77777777-7777-7777-7777-777777777701",
    class_id: "33333333-3333-3333-3333-333333333301",
    subject_id: "44444444-4444-4444-4444-444444444401",
    author_id: "b0000000-0000-0000-0000-000000000001",
    title: "Tugas 1: Latihan Perkalian & Invers Matriks Ordo 2x2",
    instructions: "Kerjakan 5 soal perhitungan matriks pada buku tugas atau ketik langsung dalam lembar jawaban. Sertakan langkah sistematis dan rumus determinan yang digunakan.",
    start_date: "2026-10-19T00:00:00Z",
    due_date: "2026-10-26T23:59:00Z",
    max_score: 100,
    allow_late_submission: true,
    submission_type: "all",
    status: "published",
    created_at: "2026-10-19T08:00:00Z",
    submissions_count: 2,
  },
  {
    id: "77777777-7777-7777-7777-777777777702",
    class_id: "33333333-3333-3333-3333-333333333301",
    subject_id: "44444444-4444-4444-4444-444444444403",
    author_id: "b0000000-0000-0000-0000-000000000003",
    title: "Proyek Mini: Flowchart Algoritma Penentuan Kelulusan",
    instructions: "Buatlah diagram alir (Flowchart) yang menerima input nilai tugas, UTS, dan UAS lalu menghasilkan output predikat (A, B, C, D) dan keterangan kelulusan.",
    start_date: "2026-10-21T00:00:00Z",
    due_date: "2026-10-28T23:59:00Z",
    max_score: 100,
    allow_late_submission: false,
    submission_type: "all",
    status: "published",
    created_at: "2026-10-21T09:00:00Z",
    submissions_count: 0,
  },
];

export const initialSubmissions: Submission[] = [
  {
    id: "88888888-8888-8888-8888-888888888801",
    assignment_id: "77777777-7777-7777-7777-777777777701",
    student_id: "c0000000-0000-0000-0000-000000000001",
    submitted_at: "2026-10-21T14:20:00Z",
    text_answer: "Berikut penyelesaian Tugas 1 Matriks:\n1. Determinan Matriks A = (4*3) - (2*1) = 12 - 2 = 10\n2. Invers Matriks A = 1/10 * [3, -2; -1, 4]\n3. Hasil perkalian A x B menghasilkan matriks ordo 2x2: [14, 8; 7, 5].\nTerima kasih Pak Budi.",
    status: "graded",
    score: 92,
    feedback: "Luar biasa Ahmad! Perhitungan determinan dan invers sudah sangat tepat dan runtut. Pertahankan kerapian langkahnya.",
    graded_by: "b0000000-0000-0000-0000-000000000001",
    graded_at: "2026-10-21T18:00:00Z",
  },
  {
    id: "88888888-8888-8888-8888-888888888802",
    assignment_id: "77777777-7777-7777-7777-777777777701",
    student_id: "c0000000-0000-0000-0000-000000000002",
    submitted_at: "2026-10-21T16:45:00Z",
    text_answer: "Selamat pagi Pak Budi. Saya sudah menyelesaikan latihan perkalian dan determinan matriks sesuai instruksi di modul 1.",
    status: "graded",
    score: 96,
    feedback: "Sangat teliti Nadia. Penjelasan sifat perkalian komutatif yang kamu cantumkan bernilai plus!",
    graded_by: "b0000000-0000-0000-0000-000000000001",
    graded_at: "2026-10-21T19:30:00Z",
  },
];

export const initialExams: Exam[] = [
  {
    id: "99999999-9999-9999-9999-999999999901",
    class_id: "33333333-3333-3333-3333-333333333301",
    subject_id: "44444444-4444-4444-4444-444444444401",
    author_id: "b0000000-0000-0000-0000-000000000001",
    title: "Penilaian Tengah Semester (PTS) Matematika Terpadu",
    description: "Ujian ini terdiri dari butir soal pilihan ganda, benar/salah, dan esai analisis konsep.",
    start_time: "2026-10-20T08:00:00Z",
    end_time: "2026-10-28T17:00:00Z",
    duration_minutes: 60,
    is_published: true,
    show_result_immediately: true,
    passing_score: 75,
    created_at: "2026-10-18T10:00:00Z",
    attempts_count: 1,
  },
];

export const initialExamQuestions: ExamQuestion[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01",
    exam_id: "99999999-9999-9999-9999-999999999901",
    question_text: "Jika matriks A berordo 2x3 dan matriks B berordo 3x4, maka ordo dari hasil perkalian matriks (A x B) adalah...",
    question_type: "multiple_choice",
    points: 20,
    order_index: 1,
    options: [
      { id: "opt-1", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01", option_text: "2 x 4", is_correct: true, order_index: 1 },
      { id: "opt-2", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01", option_text: "3 x 3", is_correct: false, order_index: 2 },
      { id: "opt-3", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01", option_text: "2 x 3", is_correct: false, order_index: 3 },
      { id: "opt-4", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01", option_text: "4 x 2", is_correct: false, order_index: 4 },
    ],
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02",
    exam_id: "99999999-9999-9999-9999-999999999901",
    question_text: "Nilai determinan dari matriks [4, 2; 1, 3] adalah...",
    question_type: "multiple_choice",
    points: 20,
    order_index: 2,
    options: [
      { id: "opt-5", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02", option_text: "10", is_correct: true, order_index: 1 },
      { id: "opt-6", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02", option_text: "14", is_correct: false, order_index: 2 },
      { id: "opt-7", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02", option_text: "12", is_correct: false, order_index: 3 },
      { id: "opt-8", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02", option_text: "8", is_correct: false, order_index: 4 },
    ],
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03",
    exam_id: "99999999-9999-9999-9999-999999999901",
    question_text: "Operasi perkalian matriks selalu bersifat komutatif, yaitu A x B = B x A.",
    question_type: "true_false",
    points: 20,
    order_index: 3,
    options: [
      { id: "opt-9", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03", option_text: "Benar", is_correct: false, order_index: 1 },
      { id: "opt-10", question_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03", option_text: "Salah", is_correct: true, order_index: 2 },
    ],
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04",
    exam_id: "99999999-9999-9999-9999-999999999901",
    question_text: "Jelaskan syarat suatu matriks persegi memiliki invers, dan sebutkan arti dari matriks singular!",
    question_type: "essay",
    points: 40,
    order_index: 4,
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccc01",
    school_id: initialSchool.id,
    author_id: "a0000000-0000-0000-0000-000000000001",
    title: "Pelaksanaan Penilaian Tengah Semester Gasal 2026/2027 Berbasis LMS",
    content: "Diberitahukan kepada seluruh dewan guru dan peserta didik kelas X, XI, dan XII bahwa pelaksanaan PTS Gasal akan dimulai serentak melalui platform LMS Sekolah terhitung mulai pekan depan. Pastikan perangkat dan koneksi internet siap.",
    target_role: "all",
    is_published: true,
    priority: "high",
    published_at: "2026-10-20T08:00:00Z",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccc02",
    school_id: initialSchool.id,
    author_id: "a0000000-0000-0000-0000-000000000001",
    title: "Batas Akhir Sinkronisasi Perangkat Pembelajaran Guru",
    content: "Dimohon kepada seluruh Dewan Guru untuk melengkapi modul bahan ajar, rubrik penilaian, dan bank soal ujian sebelum akhir pekan ini untuk diverifikasi oleh tim kurikulum.",
    target_role: "guru",
    is_published: true,
    priority: "urgent",
    published_at: "2026-10-21T09:00:00Z",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    user_id: "c0000000-0000-0000-0000-000000000001",
    title: "Tugas Baru: Proyek Mini Algoritma",
    content: "Pak Hendra Wijaya telah menerbitkan tugas baru untuk mata pelajaran Informatika.",
    type: "tugas",
    link: "/siswa/tugas",
    is_read: false,
    created_at: "2026-10-21T10:00:00Z",
  },
  {
    id: "notif-2",
    user_id: "c0000000-0000-0000-0000-000000000001",
    title: "Nilai Tugas 1 Diterbitkan",
    content: "Pak Budi Santoso telah menilai Tugas 1 Matematika Anda dengan nilai 92.",
    type: "nilai",
    link: "/siswa/nilai",
    is_read: true,
    created_at: "2026-10-21T18:05:00Z",
  },
  {
    id: "notif-3",
    user_id: "b0000000-0000-0000-0000-000000000001",
    title: "Pengumpulan Tugas Baru Masuk",
    content: "Nadia Safira telah mengumpulkan Tugas 1 Matematika.",
    type: "tugas",
    link: "/guru/tugas",
    is_read: false,
    created_at: "2026-10-21T16:46:00Z",
  },
];

export const initialEvents: SchoolEvent[] = [
  {
    id: "event-1",
    school_id: initialSchool.id,
    title: "Pekan Penilaian Tengah Semester (PTS)",
    description: "Pelaksanaan ujian tengah semester ganjil tahun ajaran 2026/2027.",
    start_time: "2026-10-24T07:30:00Z",
    end_time: "2026-10-29T15:00:00Z",
    event_type: "ujian",
    is_public: true,
  },
  {
    id: "event-2",
    school_id: initialSchool.id,
    title: "Workshop Pembelajaran Digital & AI untuk Guru",
    description: "Pelatihan pemanfaatan teknologi AI dalam pembuatan instrumen asesmen.",
    start_time: "2026-11-01T08:00:00Z",
    end_time: "2026-11-01T12:00:00Z",
    event_type: "kegiatan",
    is_public: true,
  },
  {
    id: "event-3",
    school_id: initialSchool.id,
    title: "Batas Akhir Remedial & Pengumpulan Tugas",
    description: "Batas penyerahan perbaikan nilai semester ganjil.",
    start_time: "2026-11-10T07:00:00Z",
    end_time: "2026-11-10T17:00:00Z",
    event_type: "akademik",
    is_public: true,
  },
];

export const initialSchedules: ClassSchedule[] = [
  // Budi Santoso: Kelas X-1 (Matematika Terpadu)
  {
    id: "sched-1",
    class_id: "33333333-3333-3333-3333-333333333301", // X-1
    subject_id: "44444444-4444-4444-4444-444444444401", // Matematika Terpadu
    teacher_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    day_of_week: 1, // Senin
    start_time: "07:30",
    end_time: "09:00",
    room: "Ruang 101",
    status: "aktif",
  },
  {
    id: "sched-4",
    class_id: "33333333-3333-3333-3333-333333333301", // X-1
    subject_id: "44444444-4444-4444-4444-444444444401", // Matematika Terpadu
    teacher_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    day_of_week: 4, // Kamis
    start_time: "07:30",
    end_time: "09:00",
    room: "Ruang 101",
    status: "aktif",
  },
  // Budi Santoso: Kelas X-2 (Matematika Terpadu & Informatika)
  {
    id: "sched-5",
    class_id: "33333333-3333-3333-3333-333333333302", // X-2
    subject_id: "44444444-4444-4444-4444-444444444401", // Matematika Terpadu
    teacher_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    day_of_week: 2, // Selasa
    start_time: "07:30",
    end_time: "09:00",
    room: "Ruang 102",
    status: "aktif",
  },
  {
    id: "sched-6",
    class_id: "33333333-3333-3333-3333-333333333302", // X-2
    subject_id: "44444444-4444-4444-4444-444444444401", // Matematika Terpadu
    teacher_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    day_of_week: 5, // Jumat
    start_time: "07:30",
    end_time: "09:00",
    room: "Ruang 102",
    status: "aktif",
  },
  {
    id: "sched-7",
    class_id: "33333333-3333-3333-3333-333333333302", // X-2
    subject_id: "44444444-4444-4444-4444-444444444403", // Informatika & Logika Algoritma (Mapel ke-2)
    teacher_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    day_of_week: 3, // Rabu
    start_time: "09:15",
    end_time: "11:30",
    room: "Lab Komputer 1",
    status: "aktif",
  },
  {
    id: "sched-10",
    class_id: "33333333-3333-3333-3333-333333333301", // X-1
    subject_id: "44444444-4444-4444-4444-444444444403", // Informatika & Logika Algoritma
    teacher_id: "b0000000-0000-0000-0000-000000000001", // Budi Santoso
    day_of_week: 3, // Rabu
    start_time: "07:30",
    end_time: "09:00",
    room: "Lab Komputer 1",
    status: "aktif",
  },
  // Siti Rahmawati: Kelas X-1 & X-2 (Bahasa Indonesia)
  {
    id: "sched-2",
    class_id: "33333333-3333-3333-3333-333333333301", // X-1
    subject_id: "44444444-4444-4444-4444-444444444402", // Bahasa Indonesia
    teacher_id: "b0000000-0000-0000-0000-000000000002", // Siti Rahmawati
    day_of_week: 1, // Senin
    start_time: "09:15",
    end_time: "10:45",
    room: "Ruang 101",
    status: "aktif",
  },
  {
    id: "sched-8",
    class_id: "33333333-3333-3333-3333-333333333302", // X-2
    subject_id: "44444444-4444-4444-4444-444444444402", // Bahasa Indonesia
    teacher_id: "b0000000-0000-0000-0000-000000000002", // Siti Rahmawati
    day_of_week: 4, // Kamis
    start_time: "09:15",
    end_time: "10:45",
    room: "Ruang 102",
    status: "aktif",
  },
  // Hendra Wijaya: Kelas X-1 & XI-1 (Informatika)
  {
    id: "sched-3",
    class_id: "33333333-3333-3333-3333-333333333301", // X-1
    subject_id: "44444444-4444-4444-4444-444444444403", // Informatika
    teacher_id: "b0000000-0000-0000-0000-000000000003", // Hendra Wijaya
    day_of_week: 2, // Selasa
    start_time: "09:15",
    end_time: "11:30",
    room: "Lab Komputer 1",
    status: "aktif",
  },
  {
    id: "sched-9",
    class_id: "33333333-3333-3333-3333-333333333303", // XI-1
    subject_id: "44444444-4444-4444-4444-444444444403", // Informatika
    teacher_id: "b0000000-0000-0000-0000-000000000003", // Hendra Wijaya
    day_of_week: 5, // Jumat
    start_time: "09:15",
    end_time: "11:30",
    room: "Lab Komputer 1",
    status: "aktif",
  },
];

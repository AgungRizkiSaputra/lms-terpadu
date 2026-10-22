-- ============================================================================
-- SEED DATA: supabase/seed.sql
-- DESKRIPSI: Data Awal Realistis Pengembangan LMS Sekolah (SMP, SMA, SMK)
-- ============================================================================

-- 1. SEKOLAH
INSERT INTO public.schools (id, name, npsn, level, logo_url, address, phone, email, website)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'SMA Negeri 1 Harapan Bangsa',
    '20104567',
    'SMA',
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
    'Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan',
    '(021) 7890123',
    'info@sman1harapanbangsa.sch.id',
    'https://sman1harapanbangsa.sch.id'
) ON CONFLICT (id) DO NOTHING;

-- 2. TAHUN AJARAN AKTIF
INSERT INTO public.academic_years (id, school_id, name, semester, start_date, end_date, is_active)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    '2026/2027',
    'Ganjil',
    '2026-07-15',
    '2026-12-22',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 3. PROFIL PENGGUNA DEMO (UUID ini dapat dicocokkan dengan akun di auth.users)
-- Admin
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@sekolah.id',
    'Dr. H. Raden Permadi, M.Pd.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'admin',
    '11111111-1111-1111-1111-111111111111',
    '197805122002121001',
    '081234567890',
    'Kepala Bagian Akademik & Administrator Sistem LMS SMA Negeri 1 Harapan Bangsa.'
) ON CONFLICT (id) DO NOTHING;

-- Guru 1 (Matematika & Wali Kelas)
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'budi.santoso@sekolah.id',
    'Budi Santoso, S.Pd., M.Mat.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'guru',
    '11111111-1111-1111-1111-111111111111',
    '198503142009031004',
    '081398765432',
    'Guru Pengampu Matematika Wajib & Peminatan. Wali Kelas X-1.'
) ON CONFLICT (id) DO NOTHING;

-- Guru 2 (Bahasa Indonesia)
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'siti.rahma@sekolah.id',
    'Dra. Hj. Siti Rahmawati, M.Pd.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'guru',
    '11111111-1111-1111-1111-111111111111',
    '198207182006042008',
    '081512349876',
    'Guru Bahasa dan Sastra Indonesia. Pembina Kegiatan Jurnalistik dan Literasi Sekolah.'
) ON CONFLICT (id) DO NOTHING;

-- Guru 3 (Informatika & Pemrograman Web)
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'b0000000-0000-0000-0000-000000000003',
    'hendra.wijaya@sekolah.id',
    'Hendra Wijaya, S.Kom., M.T.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'guru',
    '11111111-1111-1111-1111-111111111111',
    '199104252018021003',
    '081809876543',
    'Guru Informatika dan Rekayasa Perangkat Lunak. Pembimbing Tim Olimpiade Komputer.'
) ON CONFLICT (id) DO NOTHING;

-- Siswa 1
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'ahmad.fauzi@siswa.belajar.id',
    'Ahmad Fauzi Ramadhan',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'siswa',
    '11111111-1111-1111-1111-111111111111',
    '0078129481',
    '082155566677',
    'Siswa Kelas X-1. Ketua Kelompok Sains dan Penggemar Coding Web.'
) ON CONFLICT (id) DO NOTHING;

-- Siswa 2
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'c0000000-0000-0000-0000-000000000002',
    'nadia.safira@siswa.belajar.id',
    'Nadia Safira Azzahra',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'siswa',
    '11111111-1111-1111-1111-111111111111',
    '0078432190',
    '082177788899',
    'Siswa Kelas X-1. Anggota OSIS Seksi Pendidikan & Bahasa.'
) ON CONFLICT (id) DO NOTHING;

-- Siswa 3
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, school_id, nip_nisn, phone, bio)
VALUES (
    'c0000000-0000-0000-0000-000000000003',
    'rizky.pratama@siswa.belajar.id',
    'Rizky Pratama Kusuma',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    'siswa',
    '11111111-1111-1111-1111-111111111111',
    '0078901234',
    '082199900011',
    'Siswa Kelas X-2. Atlet Basket Sekolah & Pencinta Literasi Digital.'
) ON CONFLICT (id) DO NOTHING;

-- 4. KELAS (ROMBEL)
INSERT INTO public.classes (id, school_id, academic_year_id, grade_level, name, homeroom_teacher_id, capacity)
VALUES 
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'X', 'X-1 (MIPA Unggulan)', 'b0000000-0000-0000-0000-000000000001', 36),
    ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'X', 'X-2 (Reguler)', 'b0000000-0000-0000-0000-000000000002', 36),
    ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'XI', 'XI-1 (MIPA)', 'b0000000-0000-0000-0000-000000000003', 36)
ON CONFLICT (id) DO NOTHING;

-- 5. MATA PELAJARAN
INSERT INTO public.subjects (id, school_id, code, name, description, category, passing_grade)
VALUES
    ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', 'MAT-X', 'Matematika Terpadu', 'Materi Aljabar, Eksponen, Logaritma, dan Matriks tingkat SMA', 'Wajib', 75.00),
    ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'BIN-X', 'Bahasa dan Sastra Indonesia', 'Teks LHO, Eksposisi, Anekdot, dan Karya Sastra Klasik', 'Wajib', 75.00),
    ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111111', 'INF-X', 'Informatika & Logika Algoritma', 'Algoritma, Pemrograman Web, dan Etika Digital', 'Peminatan', 78.00),
    ('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111111', 'BIG-X', 'Bahasa Inggris Kontekstual', 'Descriptive Text, Recount, and Academic Communication', 'Wajib', 75.00)
ON CONFLICT (id) DO NOTHING;

-- 6. PENDAFTARAN SISWA KE KELAS
INSERT INTO public.class_enrollments (class_id, student_id, status)
VALUES
    ('33333333-3333-3333-3333-333333333301', 'c0000000-0000-0000-0000-000000000001', 'active'),
    ('33333333-3333-3333-3333-333333333301', 'c0000000-0000-0000-0000-000000000002', 'active'),
    ('33333333-3333-3333-3333-333333333302', 'c0000000-0000-0000-0000-000000000003', 'active')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- 7. PENUGASAN MENGAJAR GURU (TEACHING ASSIGNMENTS)
INSERT INTO public.teaching_assignments (id, class_id, subject_id, teacher_id, academic_year_id)
VALUES
    ('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444401', 'b0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222'),
    ('55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444402', 'b0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
    ('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444403', 'b0000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222'),
    ('55555555-5555-5555-5555-555555555504', '33333333-3333-3333-3333-333333333302', '44444444-4444-4444-4444-444444444401', 'b0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- 8. MATERI PEMBELAJARAN
INSERT INTO public.learning_materials (id, class_id, subject_id, author_id, title, description, content, order_index, video_url, status)
VALUES
    (
        '66666666-6666-6666-6666-666666666601',
        '33333333-3333-3333-3333-333333333301',
        '44444444-4444-4444-4444-444444444401',
        'b0000000-0000-0000-0000-000000000001',
        'Modul 1: Konsep Dasar Matriks & Operasi Aljabar Linear',
        'Pemahaman mendalam mengenai definisi ordo matriks, transpose, penjumlahan, dan perkalian matriks skalar.',
        '<h3>Tujuan Pembelajaran</h3><p>Setelah mempelajari modul ini, siswa diharapkan mampu:</p><ul><li>Menjelaskan konsep matriks dan notasinya</li><li>Menentukan hasil operasi penjumlahan dan pengurangan dua matriks</li><li>Menghitung perkalian matriks dengan skalar dan perkalian antar matriks</li></ul><h3>1. Pengertian Matriks</h3><p>Matriks adalah susunan bilangan yang diatur menurut baris dan kolom yang ditempatkan dalam kurung biasa atau siku.</p>',
        1,
        'https://www.youtube.com/watch?v=kYB8IZa5AuE',
        'published'
    ),
    (
        '66666666-6666-6666-6666-666666666602',
        '33333333-3333-3333-3333-333333333301',
        '44444444-4444-4444-4444-444444444402',
        'b0000000-0000-0000-0000-000000000002',
        'Modul 1: Menulis Teks Laporan Hasil Observasi Objektif',
        'Struktur teks laporan, ciri kebahasaan, kalimat definisi, dan verba relasional.',
        '<h3>Karakteristik Teks LHO</h3><p>Teks laporan hasil observasi harus bersifat faktual, objektif, dan tidak memuat prasangka subjektif penulis.</p><ol><li>Pernyataan umum / klasifikasi</li><li>Deskripsi bagian</li><li>Deskripsi manfaat / simpulan</li></ol>',
        1,
        NULL,
        'published'
    ),
    (
        '66666666-6666-6666-6666-666666666603',
        '33333333-3333-3333-3333-333333333301',
        '44444444-4444-4444-4444-444444444403',
        'b0000000-0000-0000-0000-000000000003',
        'Modul 1: Fondasi Berpikir Komputasional & Flowchart Logika',
        'Konsep 4 pilar Computational Thinking: Dekomposisi, Pengenalan Pola, Abstraksi, dan Desain Algoritma.',
        '<h3>4 Fondasi Berpikir Komputasional</h3><p>Berpikir komputasional adalah metode penyelesaian masalah yang dirancang agar dapat dieksekusi oleh manusia atau komputer secara sistematis.</p>',
        1,
        'https://www.youtube.com/watch?v=mUXo-S8gkds',
        'published'
    )
ON CONFLICT (id) DO NOTHING;

-- 9. TUGAS SISWA
INSERT INTO public.assignments (id, class_id, subject_id, author_id, title, instructions, start_date, due_date, max_score, allow_late_submission, submission_type, status)
VALUES
    (
        '77777777-7777-7777-7777-777777777701',
        '33333333-3333-3333-3333-333333333301',
        '44444444-4444-4444-4444-444444444401',
        'b0000000-0000-0000-0000-000000000001',
        'Tugas 1: Latihan Perkalian & Invers Matriks Ordo 2x2',
        'Kerjakan 5 soal perhitungan matriks pada buku tugas atau ketik langsung dalam lembar jawaban. Sertakan langkah sistematis dan rumus determinan yang digunakan.',
        NOW() - INTERVAL '3 days',
        NOW() + INTERVAL '4 days',
        100.00,
        TRUE,
        'all',
        'published'
    ),
    (
        '77777777-7777-7777-7777-777777777702',
        '33333333-3333-3333-3333-333333333301',
        '44444444-4444-4444-4444-444444444403',
        'b0000000-0000-0000-0000-000000000003',
        'Proyek Mini: Flowchart Algoritma Penentuan Nilai Kelulusan',
        'Buatlah diagram alir (Flowchart) yang menerima input nilai tugas, UTS, dan UAS lalu menghasilkan output predikat (A, B, C, D) dan keterangan kelulusan.',
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '6 days',
        100.00,
        FALSE,
        'all',
        'published'
    )
ON CONFLICT (id) DO NOTHING;

-- 10. PENGUMPULAN TUGAS (SUBMISSIONS)
INSERT INTO public.submissions (id, assignment_id, student_id, submitted_at, text_answer, status, score, feedback, graded_by, graded_at)
VALUES
    (
        '88888888-8888-8888-8888-888888888801',
        '77777777-7777-7777-7777-777777777701',
        'c0000000-0000-0000-0000-000000000001',
        NOW() - INTERVAL '1 day',
        'Berikut rangkuman jawaban Tugas 1 Matematika:\n1. Determinan Matriks A = (4*3) - (2*1) = 12 - 2 = 10\n2. Invers Matriks A = 1/10 * [3, -2; -1, 4]\n3. Hasil perkalian A x B menghasilkan matriks ordo 2x2: [14, 8; 7, 5].\nTerima kasih Pak Budi.',
        'graded',
        92.00,
        'Luar biasa Ahmad! Perhitungan determinan dan invers sudah sangat tepat dan runtut. Pertahankan kerapian langkahnya.',
        'b0000000-0000-0000-0000-000000000001',
        NOW() - INTERVAL '6 hours'
    ),
    (
        '88888888-8888-8888-8888-888888888802',
        '77777777-7777-7777-7777-777777777701',
        'c0000000-0000-0000-0000-000000000002',
        NOW() - INTERVAL '12 hours',
        'Selamat pagi Pak Budi. Saya sudah menyelesaikan latihan perkalian dan determinan matriks sesuai instruksi di modul 1. Jawaban lengkap tertera pada teks dan lampiran.',
        'graded',
        96.00,
        'Sangat teliti Nadia. Penjelasan sifat perkalian komutatif yang kamu cantumkan bernilai plus!',
        'b0000000-0000-0000-0000-000000000001',
        NOW() - INTERVAL '3 hours'
    )
ON CONFLICT (id) DO NOTHING;

-- 11. UJIAN & ULANGAN HARIAN (EXAMS)
INSERT INTO public.exams (id, class_id, subject_id, author_id, title, description, start_time, end_time, duration_minutes, is_published, show_result_immediately, passing_score)
VALUES
    (
        '99999999-9999-9999-9999-999999999901',
        '33333333-3333-3333-3333-333333333301',
        '44444444-4444-4444-4444-444444444401',
        'b0000000-0000-0000-0000-000000000001',
        'Penilaian Tengah Semester (PTS) Matematika Terpadu',
        'Ujian ini terdiri dari 3 butir soal objektif pilihan ganda, 1 soal benar/salah, dan 1 soal esai pemecahan masalah.',
        NOW() - INTERVAL '2 days',
        NOW() + INTERVAL '5 days',
        60,
        TRUE,
        TRUE,
        75.00
    )
ON CONFLICT (id) DO NOTHING;

-- 12. SOAL-SOAL UJIAN (EXAM QUESTIONS)
-- Soal 1 (Pilihan Ganda)
INSERT INTO public.exam_questions (id, exam_id, question_text, question_type, points, order_index)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01',
    '99999999-9999-9999-9999-999999999901',
    'Jika matriks A berordo 2x3 dan matriks B berordo 3x4, maka ordo dari hasil perkalian matriks (A x B) adalah...',
    'multiple_choice',
    20.00,
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exam_question_options (question_id, option_text, is_correct, order_index)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '2 x 4', TRUE, 1),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '3 x 3', FALSE, 2),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '2 x 3', FALSE, 3),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '4 x 2', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Soal 2 (Pilihan Ganda)
INSERT INTO public.exam_questions (id, exam_id, question_text, question_type, points, order_index)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02',
    '99999999-9999-9999-9999-999999999901',
    'Nilai determinan dari matriks [4, 2; 1, 3] adalah...',
    'multiple_choice',
    20.00,
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exam_question_options (question_id, option_text, is_correct, order_index)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '10', TRUE, 1),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '14', FALSE, 2),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '12', FALSE, 3),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '8', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Soal 3 (Benar / Salah)
INSERT INTO public.exam_questions (id, exam_id, question_text, question_type, points, order_index)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03',
    '99999999-9999-9999-9999-999999999901',
    'Operasi perkalian matriks selalu bersifat komutatif, yaitu A x B = B x A.',
    'true_false',
    20.00,
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exam_question_options (question_id, option_text, is_correct, order_index)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'Benar', FALSE, 1),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'Salah', TRUE, 2)
ON CONFLICT DO NOTHING;

-- Soal 4 (Esai)
INSERT INTO public.exam_questions (id, exam_id, question_text, question_type, points, order_index)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04',
    '99999999-9999-9999-9999-999999999901',
    'Jelaskan syarat suatu matriks persegi memiliki invers, dan sebutkan arti dari matriks singular!',
    'essay',
    40.00,
    4
) ON CONFLICT (id) DO NOTHING;

-- 13. HASIL PENGERJAAN UJIAN SISWA (EXAM ATTEMPTS)
INSERT INTO public.exam_attempts (id, exam_id, student_id, started_at, submitted_at, total_score, is_graded, status)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
    '99999999-9999-9999-9999-999999999901',
    'c0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '1 day' - INTERVAL '50 minutes',
    NOW() - INTERVAL '1 day',
    95.00,
    TRUE,
    'graded'
) ON CONFLICT (id) DO NOTHING;

-- 14. PENGUMUMAN SEKOLAH (ANNOUNCEMENTS)
INSERT INTO public.announcements (id, school_id, author_id, title, content, target_role, is_published, priority, published_at)
VALUES
    (
        'cccccccc-cccc-cccc-cccc-cccccccccc01',
        '11111111-1111-1111-1111-111111111111',
        'a0000000-0000-0000-0000-000000000001',
        'Pelaksanaan Penilaian Tengah Semester Gasal 2026/2027 Berbasis LMS',
        'Diberitahukan kepada seluruh bapak/ibu guru dan peserta didik kelas X, XI, dan XII bahwa pelaksanaan PTS Gasal akan dimulai serentak melalui platform LMS Sekolah terhitung mulai pekan depan. Pastikan perangkat dan koneksi internet siap.',
        'all',
        TRUE,
        'high',
        NOW() - INTERVAL '2 days'
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccc02',
        '11111111-1111-1111-1111-111111111111',
        'a0000000-0000-0000-0000-000000000001',
        'Batas Akhir Sinkronisasi Perangkat Pembelajaran Guru',
        'Dimohon kepada seluruh Dewan Guru untuk melengkapi modul bahan ajar, rubrik penilaian, dan bank soal ujian sebelum akhir pekan ini untuk diverifikasi oleh tim kurikulum.',
        'guru',
        TRUE,
        'urgent',
        NOW() - INTERVAL '1 day'
    )
ON CONFLICT (id) DO NOTHING;

-- 15. NOTIFIKASI
INSERT INTO public.notifications (user_id, title, content, type, link, is_read)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'Tugas Baru: Proyek Mini Algoritma',
        'Pak Hendra Wijaya telah menerbitkan tugas baru untuk mata pelajaran Informatika.',
        'tugas',
        '/siswa/tugas',
        FALSE
    ),
    (
        'c0000000-0000-0000-0000-000000000001',
        'Nilai Tugas 1 Diterbitkan',
        'Pak Budi Santoso telah menilai Tugas 1 Matematika Anda dengan nilai 92.',
        'nilai',
        '/siswa/nilai',
        TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000001',
        'Pengumpulan Tugas Baru',
        'Nadia Safira telah mengumpulkan Tugas 1 Matematika.',
        'tugas',
        '/guru/tugas',
        FALSE
    )
ON CONFLICT DO NOTHING;

-- 16. AGENDA KALENDER & KEGIATAN SEKOLAH (SCHOOL EVENTS)
INSERT INTO public.school_events (school_id, title, description, start_time, end_time, event_type, is_public)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Pekan Penilaian Tengah Semester (PTS)',
        'Pelaksanaan ujian tengah semester ganjil tahun ajaran 2026/2027.',
        NOW() + INTERVAL '2 days',
        NOW() + INTERVAL '7 days',
        'ujian',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Workshop Pembelajaran Digital & AI untuk Guru',
        'Pelatihan pemanfaatan teknologi kecerdasan buatan dalam asesmen pembelajaran.',
        NOW() + INTERVAL '10 days',
        NOW() + INTERVAL '10 days' + INTERVAL '4 hours',
        'kegiatan',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Libur Nasional & Cuti Bersama',
        'Kegiatan belajar mengajar ditiadakan.',
        NOW() + INTERVAL '14 days',
        NOW() + INTERVAL '15 days',
        'libur',
        TRUE
    )
ON CONFLICT DO NOTHING;

-- 17. JADWAL PELAJARAN MINGGUAN (CLASS SCHEDULES)
INSERT INTO public.class_schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
VALUES
    ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444401', 'b0000000-0000-0000-0000-000000000001', 1, '07:30', '09:00', 'Ruang 101'),
    ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444402', 'b0000000-0000-0000-0000-000000000002', 1, '09:15', '10:45', 'Ruang 101'),
    ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444403', 'b0000000-0000-0000-0000-000000000003', 2, '08:00', '10:15', 'Lab Komputer 1'),
    ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444401', 'b0000000-0000-0000-0000-000000000001', 4, '07:30', '09:00', 'Ruang 101')
ON CONFLICT DO NOTHING;

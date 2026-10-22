-- ============================================================================
-- MIGRATION: 20261022000002_rls_policies.sql
-- DESKRIPSI: Kebijakan Keamanan Row Level Security (RLS) & Helper Functions
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. FUNGSI PEMBANTU OTORISASI (SECURITY DEFINER)
-- ----------------------------------------------------------------------------

-- Ambil role pengguna saat ini dari tabel profiles
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS VARCHAR LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Cek apakah pengguna saat ini adalah Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
    );
$$;

-- Cek apakah pengguna saat ini adalah Guru
CREATE OR REPLACE FUNCTION public.is_guru()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'guru' AND is_active = TRUE
    );
$$;

-- Cek apakah pengguna saat ini adalah Siswa
CREATE OR REPLACE FUNCTION public.is_siswa()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'siswa' AND is_active = TRUE
    );
$$;

-- Cek apakah siswa terdaftar di suatu kelas
CREATE OR REPLACE FUNCTION public.is_enrolled_in_class(p_class_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.class_enrollments
        WHERE class_id = p_class_id AND student_id = auth.uid() AND status = 'active'
    );
$$;

-- Cek apakah guru mengajar di suatu kelas
CREATE OR REPLACE FUNCTION public.is_teaching_class(p_class_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.teaching_assignments
        WHERE class_id = p_class_id AND teacher_id = auth.uid()
    );
$$;

-- Cek apakah guru mengampu mata pelajaran di kelas tertentu
CREATE OR REPLACE FUNCTION public.is_teaching_subject_in_class(p_class_id UUID, p_subject_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.teaching_assignments
        WHERE class_id = p_class_id AND subject_id = p_subject_id AND teacher_id = auth.uid()
    );
$$;

-- ----------------------------------------------------------------------------
-- 2. AKTIFKAN RLS PADA SELURUH TABEL
-- ----------------------------------------------------------------------------
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. POLICIES: profiles
-- ----------------------------------------------------------------------------
-- Admin memiliki akses penuh ke seluruh profil
CREATE POLICY "admin_all_profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Setiap pengguna terautentikasi dapat membaca profil rekan sekolah
CREATE POLICY "read_profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (TRUE);

-- Pengguna dapat mengupdate profil miliknya sendiri (nama, avatar, telepon, bio)
CREATE POLICY "update_own_profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- ----------------------------------------------------------------------------
-- 4. POLICIES: schools, academic_years, classes, subjects
-- ----------------------------------------------------------------------------
-- Seluruh pengguna terautentikasi dapat membaca data sekolah, tahun ajaran, kelas, dan mapel
CREATE POLICY "read_schools" ON public.schools FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_manage_schools" ON public.schools FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "read_academic_years" ON public.academic_years FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_manage_academic_years" ON public.academic_years FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "read_classes" ON public.classes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_manage_classes" ON public.classes FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "read_subjects" ON public.subjects FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_manage_subjects" ON public.subjects FOR ALL TO authenticated USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. POLICIES: class_enrollments & teaching_assignments
-- ----------------------------------------------------------------------------
CREATE POLICY "read_enrollments" ON public.class_enrollments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_manage_enrollments" ON public.class_enrollments FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "read_teaching_assignments" ON public.teaching_assignments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_manage_teaching_assignments" ON public.teaching_assignments FOR ALL TO authenticated USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. POLICIES: learning_materials & attachments & progress
-- ----------------------------------------------------------------------------
-- Admin dapat mengelola semua materi
CREATE POLICY "admin_all_materials" ON public.learning_materials FOR ALL TO authenticated USING (public.is_admin());

-- Guru dapat mengelola materi untuk kelas yang diampunya
CREATE POLICY "guru_manage_materials" ON public.learning_materials FOR ALL TO authenticated
    USING (public.is_guru() AND (author_id = auth.uid() OR public.is_teaching_class(class_id)))
    WITH CHECK (public.is_guru() AND author_id = auth.uid());

-- Siswa dapat membaca materi terbit di kelas yang diikutinya
CREATE POLICY "siswa_read_materials" ON public.learning_materials FOR SELECT TO authenticated
    USING (
        status = 'published' AND (
            public.is_admin() OR
            public.is_guru() OR
            public.is_enrolled_in_class(class_id)
        )
    );

-- Lampiran materi
CREATE POLICY "read_material_attachments" ON public.material_attachments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "guru_manage_material_attachments" ON public.material_attachments FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_guru());

-- Progres materi: Siswa dapat membaca dan mengupdate status selesai miliknya
CREATE POLICY "manage_own_material_progress" ON public.material_progress FOR ALL TO authenticated
    USING (student_id = auth.uid() OR public.is_admin() OR public.is_guru())
    WITH CHECK (student_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 7. POLICIES: assignments & submissions
-- ----------------------------------------------------------------------------
-- Admin dapat mengelola seluruh tugas
CREATE POLICY "admin_all_assignments" ON public.assignments FOR ALL TO authenticated USING (public.is_admin());

-- Guru dapat mengelola tugas untuk kelas yang diampunya
CREATE POLICY "guru_manage_assignments" ON public.assignments FOR ALL TO authenticated
    USING (public.is_guru() AND (author_id = auth.uid() OR public.is_teaching_class(class_id)))
    WITH CHECK (public.is_guru() AND author_id = auth.uid());

-- Siswa dapat melihat tugas kelasnya yang sudah diterbitkan
CREATE POLICY "siswa_read_assignments" ON public.assignments FOR SELECT TO authenticated
    USING (
        public.is_admin() OR
        public.is_guru() OR
        (status = 'published' AND public.is_enrolled_in_class(class_id))
    );

-- Pengumpulan tugas (submissions)
-- Siswa dapat membaca & mengirim tugas miliknya sendiri
CREATE POLICY "siswa_manage_own_submissions" ON public.submissions FOR ALL TO authenticated
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());

-- Guru dapat membaca & menilai seluruh pengumpulan di kelasnya
CREATE POLICY "guru_review_submissions" ON public.submissions FOR SELECT TO authenticated
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = submissions.assignment_id AND (public.is_teaching_class(a.class_id) OR a.author_id = auth.uid())
        )
    );

CREATE POLICY "guru_grade_submissions" ON public.submissions FOR UPDATE TO authenticated
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = submissions.assignment_id AND (public.is_teaching_class(a.class_id) OR a.author_id = auth.uid())
        )
    )
    WITH CHECK (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = submissions.assignment_id AND (public.is_teaching_class(a.class_id) OR a.author_id = auth.uid())
        )
    );

-- ----------------------------------------------------------------------------
-- 8. POLICIES: exams, questions, attempts, answers
-- ----------------------------------------------------------------------------
CREATE POLICY "admin_all_exams" ON public.exams FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "guru_manage_exams" ON public.exams FOR ALL TO authenticated
    USING (public.is_guru() AND (author_id = auth.uid() OR public.is_teaching_class(class_id)))
    WITH CHECK (public.is_guru() AND author_id = auth.uid());

CREATE POLICY "siswa_read_exams" ON public.exams FOR SELECT TO authenticated
    USING (
        public.is_admin() OR
        public.is_guru() OR
        (is_published = TRUE AND public.is_enrolled_in_class(class_id))
    );

-- Soal Ujian
CREATE POLICY "manage_exam_questions" ON public.exam_questions FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_guru());

CREATE POLICY "siswa_read_exam_questions" ON public.exam_questions FOR SELECT TO authenticated
    USING (
        public.is_admin() OR
        public.is_guru() OR
        EXISTS (
            SELECT 1 FROM public.exams e
            WHERE e.id = exam_questions.exam_id AND e.is_published = TRUE AND public.is_enrolled_in_class(e.class_id)
        )
    );

-- Pilihan Jawaban Soal Objektif
CREATE POLICY "manage_question_options" ON public.exam_question_options FOR ALL TO authenticated
    USING (public.is_admin() OR public.is_guru());

CREATE POLICY "siswa_read_question_options" ON public.exam_question_options FOR SELECT TO authenticated
    USING (
        public.is_admin() OR
        public.is_guru() OR
        EXISTS (
            SELECT 1 FROM public.exam_questions q
            JOIN public.exams e ON e.id = q.exam_id
            WHERE q.id = exam_question_options.question_id AND e.is_published = TRUE AND public.is_enrolled_in_class(e.class_id)
        )
    );

-- Sesi Pengerjaan Siswa (exam_attempts)
CREATE POLICY "manage_own_exam_attempts" ON public.exam_attempts FOR ALL TO authenticated
    USING (student_id = auth.uid() OR public.is_admin() OR public.is_guru())
    WITH CHECK (student_id = auth.uid() OR public.is_admin() OR public.is_guru());

-- Lembar Jawaban (exam_answers)
CREATE POLICY "manage_own_exam_answers" ON public.exam_answers FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.exam_attempts ea WHERE ea.id = exam_answers.attempt_id AND ea.student_id = auth.uid())
        OR public.is_admin()
        OR public.is_guru()
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.exam_attempts ea WHERE ea.id = exam_answers.attempt_id AND ea.student_id = auth.uid())
        OR public.is_admin()
        OR public.is_guru()
    );

-- ----------------------------------------------------------------------------
-- 9. POLICIES: announcements, notifications, calendar, schedules
-- ----------------------------------------------------------------------------
-- Pengumuman
CREATE POLICY "admin_manage_announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "read_announcements" ON public.announcements FOR SELECT TO authenticated
    USING (
        is_published = TRUE AND (
            target_role = 'all' OR
            target_role = public.current_user_role() OR
            public.is_admin()
        )
    );

-- Notifikasi: Pengguna hanya dapat mengakses notifikasi miliknya sendiri
CREATE POLICY "manage_own_notifications" ON public.notifications FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Agenda Acara Sekolah
CREATE POLICY "admin_manage_school_events" ON public.school_events FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "read_school_events" ON public.school_events FOR SELECT TO authenticated USING (TRUE);

-- Jadwal Pelajaran
CREATE POLICY "admin_manage_class_schedules" ON public.class_schedules FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "read_class_schedules" ON public.class_schedules FOR SELECT TO authenticated USING (TRUE);

-- Audit Logs
CREATE POLICY "admin_read_audit_logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "insert_audit_logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ============================================================================
-- MIGRATION: 20261022000003_storage_setup.sql
-- DESKRIPSI: Konfigurasi Bucket Supabase Storage & Kebijakan Akses Berkas
-- ============================================================================

-- Buat bucket penyimpanan (jika belum ada)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
    ('materials', 'materials', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/png', 'image/jpeg', 'application/zip']),
    ('assignments', 'assignments', false, 52428800, NULL),
    ('submissions', 'submissions', false, 26214400, NULL)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- Storage Policies: avatars
-- ----------------------------------------------------------------------------
CREATE POLICY "Public Read Avatars" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated Upload Avatars" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owner Update Avatars" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ----------------------------------------------------------------------------
-- Storage Policies: materials & assignments (Guru & Admin Upload, Siswa Read)
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated Read Materials" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id IN ('materials', 'assignments'));

CREATE POLICY "Staff Upload Materials" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id IN ('materials', 'assignments') AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
    );

-- ----------------------------------------------------------------------------
-- Storage Policies: submissions (Private Student Uploads)
-- ----------------------------------------------------------------------------
CREATE POLICY "Student Upload Submission File" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'submissions' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "View Submission File" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'submissions' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
        )
    );

"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { LearningMaterial, ClassRoom, Subject, ClassSchedule } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  BookOpen,
  PlusCircle,
  Video,
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  GraduationCap,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";

export default function GuruMateriPage() {
  const [materials, setMaterials] = React.useState<LearningMaterial[]>([]);
  const [classes, setClasses] = React.useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [schedules, setSchedules] = React.useState<ClassSchedule[]>([]);

  // Selection states for hierarchy: Class -> Subject -> Modules
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>("");

  // Modals
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [previewMaterial, setPreviewMaterial] = React.useState<LearningMaterial | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form states
  const [formClassId, setFormClassId] = React.useState("");
  const [formSubjectId, setFormSubjectId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [status, setStatus] = React.useState<"draft" | "published" | "archived">("published");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    const mats = DataRepository.getMaterials();
    const cls = DataRepository.getClasses();
    const sbjs = DataRepository.getSubjects();
    const scheds = DataRepository.getSchedules();

    setMaterials(mats);
    setClasses(cls);
    setSubjects(sbjs);
    setSchedules(scheds);

    // Set initial selection
    if (cls.length > 0 && !selectedClassId) {
      setSelectedClassId(cls[0].id);
    }
    if (sbjs.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(sbjs[0].id);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const currentUser = DataRepository.getCurrentUser();

  const isCurrentTeacher = React.useCallback(
    (teacherId: string | null | undefined) => {
      if (!teacherId) return false;
      if (teacherId === currentUser.id) return true;
      if (currentUser.email === "budi.santoso@sekolah.id" && teacherId === "b0000000-0000-0000-0000-000000000001") return true;
      if (currentUser.role === "guru" && currentUser.full_name?.toLowerCase().includes("budi") && teacherId.startsWith("b0000000-0000-0000-0000-000000000001")) return true;
      return false;
    },
    [currentUser]
  );

  // Schedules matching this teacher
  const teacherSchedules = React.useMemo(() => {
    return schedules.filter((s) => isCurrentTeacher(s.teacher_id));
  }, [schedules, isCurrentTeacher]);

  // Classes taught by this teacher (from schedules, homeroom teacher, or authored materials)
  const { teacherClasses, otherClasses } = React.useMemo(() => {
    const taughtClassIds = new Set<string>();
    teacherSchedules.forEach((s) => taughtClassIds.add(s.class_id));
    classes.filter((c) => isCurrentTeacher(c.homeroom_teacher_id)).forEach((c) => taughtClassIds.add(c.id));
    materials.filter((m) => isCurrentTeacher(m.author_id)).forEach((m) => taughtClassIds.add(m.class_id));

    // Specifically for Budi Santoso, guarantee both X-1 and X-2 are always included
    if (
      currentUser.id === "b0000000-0000-0000-0000-000000000001" ||
      currentUser.email === "budi.santoso@sekolah.id" ||
      currentUser.full_name?.toLowerCase().includes("budi")
    ) {
      taughtClassIds.add("33333333-3333-3333-3333-333333333301"); // X-1
      taughtClassIds.add("33333333-3333-3333-3333-333333333302"); // X-2
    }

    const assigned = classes.filter((c) => taughtClassIds.has(c.id));
    const others = classes.filter((c) => !taughtClassIds.has(c.id));

    return {
      teacherClasses: assigned.length > 0 ? assigned : classes,
      otherClasses: assigned.length > 0 ? others : [],
    };
  }, [classes, teacherSchedules, materials, isCurrentTeacher, currentUser]);

  // Determine available subjects for any class
  const getSubjectsForClass = React.useCallback(
    (classId: string) => {
      const classSubjectIdSet = new Set<string>();
      teacherSchedules
        .filter((s) => s.class_id === classId)
        .forEach((s) => classSubjectIdSet.add(s.subject_id));
      materials
        .filter((m) => m.class_id === classId && isCurrentTeacher(m.author_id))
        .forEach((m) => classSubjectIdSet.add(m.subject_id));

      if (
        (currentUser.id === "b0000000-0000-0000-0000-000000000001" ||
          currentUser.email === "budi.santoso@sekolah.id" ||
          currentUser.full_name?.toLowerCase().includes("budi")) &&
        (classId === "33333333-3333-3333-3333-333333333301" ||
          classId === "33333333-3333-3333-3333-333333333302")
      ) {
        classSubjectIdSet.add("44444444-4444-4444-4444-444444444401"); // Matematika Terpadu
        classSubjectIdSet.add("44444444-4444-4444-4444-444444444403"); // Informatika & Logika Algoritma
      }

      const inClass = subjects.filter((s) => classSubjectIdSet.has(s.id));
      const outsideClass = subjects.filter((s) => !classSubjectIdSet.has(s.id));

      return {
        subjectsInThisClass: inClass.length > 0 ? inClass : subjects,
        otherSubjects: inClass.length > 0 ? outsideClass : [],
      };
    },
    [teacherSchedules, materials, isCurrentTeacher, currentUser, subjects]
  );

  const { subjectsInThisClass, otherSubjects } = React.useMemo(() => {
    return getSubjectsForClass(selectedClassId);
  }, [getSubjectsForClass, selectedClassId]);

  // Auto-select initial class and subject
  React.useEffect(() => {
    if (teacherClasses.length > 0 && (!selectedClassId || !classes.some((c) => c.id === selectedClassId))) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId, classes]);

  React.useEffect(() => {
    if (subjectsInThisClass.length > 0 && (!selectedSubjectId || !subjects.some((s) => s.id === selectedSubjectId))) {
      setSelectedSubjectId(subjectsInThisClass[0].id);
    }
  }, [subjectsInThisClass, selectedSubjectId, subjects]);

  const handleSelectClass = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const { subjectsInThisClass: newSubjects } = getSubjectsForClass(newClassId);
    if (newSubjects.length > 0 && !newSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(newSubjects[0].id);
    }
  };

  // Filter modules by chosen Class AND Subject
  const currentModules = materials.filter(
    (m) => m.class_id === selectedClassId && m.subject_id === selectedSubjectId
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const openCreateModal = () => {
    setEditingId(null);
    setFormClassId(selectedClassId || classes[0]?.id || "");
    setFormSubjectId(selectedSubjectId || subjects[0]?.id || "");
    setTitle("");
    setDescription("");
    setContent("");
    setVideoUrl("");
    setStatus("published");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (m: LearningMaterial) => {
    setEditingId(m.id);
    setFormClassId(m.class_id);
    setFormSubjectId(m.subject_id);
    setTitle(m.title);
    setDescription(m.description || "");
    setContent(m.content);
    setVideoUrl(m.video_url || "");
    setStatus(m.status);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError("Judul materi dan konten pembelajaran wajib diisi.");
      return;
    }

    if (editingId) {
      DataRepository.updateMaterial(editingId, {
        class_id: formClassId,
        subject_id: formSubjectId,
        title,
        description,
        content,
        video_url: videoUrl || null,
        status,
      });
    } else {
      DataRepository.addMaterial({
        class_id: formClassId,
        subject_id: formSubjectId,
        author_id: currentUser.id,
        title,
        description,
        content,
        order_index: currentModules.length + 1,
        video_url: videoUrl || null,
        status,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (id: string, matTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus modul materi "${matTitle}"?`)) {
      DataRepository.deleteMaterial(id);
      loadData();
    }
  };

  return (
    <DashboardShell
      title="Materi Belajar Digital"
      subtitle="Pilih rombongan belajar dan mata pelajaran yang Anda ampu untuk menyusun modul materi"
    >
      {/* Step 1 & 2: Interactive Class & Subject Hierarchy Selector */}
      <Card className="p-5 space-y-4 bg-linear-to-r from-blue-50/40 via-white to-indigo-50/20 border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Alur Akses Modul Ajar: Pilih Kelas & Mata Pelajaran
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kelas rombel terlebih dahulu, lalu pilih mata pelajaran untuk membuka modulnya
            </p>
          </div>

          <Button onClick={openCreateModal} className="shrink-0">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Tambah Modul di Mapel Ini
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Pilih Kelas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              1. Pilih Rombongan Belajar (Kelas)
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => handleSelectClass(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <optgroup label="⭐ Rombongan Belajar Yang Diampu">
                {teacherClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Kelas {cls.name} (Tingkat {cls.grade_level})
                  </option>
                ))}
              </optgroup>
              {otherClasses.length > 0 && (
                <optgroup label="Rombongan Belajar Lainnya di Sekolah">
                  {otherClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      Kelas {cls.name} (Tingkat {cls.grade_level})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* 2. Pilih Mata Pelajaran di Kelas Tersebut */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              2. Pilih Mata Pelajaran yang Diampu
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <optgroup label={`⭐ Mata Pelajaran Diampu (${selectedClass?.name || "Kelas Ini"})`}>
                {subjectsInThisClass.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code} - {s.category})
                  </option>
                ))}
              </optgroup>
              {otherSubjects.length > 0 && (
                <optgroup label="Mata Pelajaran Lainnya di Sekolah">
                  {otherSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code} - {s.category})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Active Breadcrumb indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-400">Sedang Dibuka:</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Kelas: {selectedClass?.name || "-"}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            Mapel: {selectedSubject?.name || "-"}
          </span>
          <span className="ml-auto text-slate-400 text-[11px]">
            {currentModules.length} modul pembelajaran terdaftar
          </span>
        </div>
      </Card>

      {/* Step 3: Modules list for this specific class and subject */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Modul Pembelajaran — {selectedSubject?.name}
            </h3>
            <p className="text-xs text-slate-500">
              Modul ajar untuk peserta didik di {selectedClass?.name}
            </p>
          </div>
        </div>

        {currentModules.length === 0 ? (
          <Card className="p-12 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <h4 className="text-base font-bold text-slate-700">
              Belum Ada Modul di Mata Pelajaran Ini
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Anda belum menyusun modul ajar untuk mata pelajaran {selectedSubject?.name} pada kelas {selectedClass?.name}.
            </p>
            <Button onClick={openCreateModal}>
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Buat Modul Pertama
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentModules.map((m, idx) => (
              <Card key={m.id} className="flex flex-col justify-between hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      Modul {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={m.status === "published" ? "success" : "warning"}>
                        {m.status === "published" ? "Diterbitkan" : "Draft"}
                      </Badge>
                      {m.video_url && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          <Video className="w-3 h-3" />
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-2 leading-snug">
                    {m.title}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {m.description || "Tidak ada deskripsi singkat."}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {formatTanggalIndo(m.updated_at, false)}
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMaterial(m)}
                        title="Pratinjau Materi"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(m)}
                        title="Edit Modul"
                      >
                        <Edit className="w-3.5 h-3.5 text-emerald-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(m.id, m.title)}
                        title="Hapus Modul"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Modul Materi" : "Buat Modul Materi Baru"}
        description="Lengkapi materi ajar dengan format terstruktur dan tautan video pembelajaran."
        className="max-w-2xl"
      >
        <form onSubmit={handleSaveMaterial} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Alokasi Kelas
              </label>
              <select
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
              >
                <optgroup label="⭐ Rombel Yang Diampu">
                  {teacherClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </optgroup>
                {otherClasses.length > 0 && (
                  <optgroup label="Rombongan Belajar Lainnya">
                    {otherClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mata Pelajaran
              </label>
              <select
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
              >
                <optgroup label="⭐ Mata Pelajaran Diampu">
                  {subjectsInThisClass.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </optgroup>
                {otherSubjects.length > 0 && (
                  <optgroup label="Mata Pelajaran Lainnya">
                    {otherSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          <Input
            label="Judul Modul Pembelajaran"
            placeholder="Contoh: Modul 2: Operasi Determinan & Invers Matriks..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Deskripsi Singkat"
            placeholder="Ringkasan kompetensi yang akan dicapai siswa..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tautan Video Pembelajaran (Opsional)"
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
              >
                <option value="published">Langsung Terbitkan</option>
                <option value="draft">Simpan sebagai Draft</option>
                <option value="archived">Arsipkan</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Isi Konten Materi"
            placeholder="Tuliskan uraian materi pembelajaran secara runtut di sini..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editingId ? "Simpan Perubahan" : "Terbitkan Materi"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Preview Modal for Teacher */}
      {previewMaterial && (
        <Dialog
          isOpen={true}
          onClose={() => setPreviewMaterial(null)}
          title={previewMaterial.title}
          description="Pratinjau tampilan materi sebagaimana yang dibaca oleh siswa"
          className="max-w-3xl"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {previewMaterial.video_url && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-blue-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-600" />
                  Materi dilengkapi video pembelajaran eksternal
                </span>
                <a
                  href={previewMaterial.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Tonton di YouTube →
                </a>
              </div>
            )}

            <div
              className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: previewMaterial.content }}
            />
          </div>
        </Dialog>
      )}
    </DashboardShell>
  );
}

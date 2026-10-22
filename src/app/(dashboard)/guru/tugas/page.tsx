"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { Assignment, Profile, Submission, ClassRoom, Subject } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  CheckSquare,
  PlusCircle,
  Clock,
  Award,
  CheckCircle2,
  FileCheck,
  Send,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Edit,
  Trash2,
  Users,
} from "lucide-react";

export default function GuruTugasPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [classes, setClasses] = React.useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  // Filter states
  const [selectedClassFilter, setSelectedClassFilter] = React.useState<string>("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = React.useState<string>("all");
  const [studentSearch, setStudentSearch] = React.useState("");

  // Create / Edit Assignment Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingAssignment, setEditingAssignment] = React.useState<Assignment | null>(null);
  const [formClassId, setFormClassId] = React.useState("");
  const [formSubjectId, setFormSubjectId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [maxScore, setMaxScore] = React.useState("100");
  const [formError, setFormError] = React.useState("");

  // Grade Submission Modal
  const [gradingSubmission, setGradingSubmission] = React.useState<Submission | null>(null);
  const [inputScore, setInputScore] = React.useState("");
  const [inputFeedback, setInputFeedback] = React.useState("");

  const loadData = () => {
    setAssignments(DataRepository.getAssignments());
    setSubmissions(DataRepository.getSubmissions());
    setProfiles(DataRepository.getProfiles());
    setClasses(DataRepository.getClasses());
    setSubjects(DataRepository.getSubjects());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const currentUser = DataRepository.getCurrentUser();
  const students = profiles.filter((p) => p.role === "siswa");

  const getStudentProfile = (studentId: string): Profile | undefined => {
    return profiles.find((p) => p.id === studentId);
  };

  const getClassName = (classId: string): string => {
    return classes.find((c) => c.id === classId)?.name || "Kelas";
  };

  const getSubjectName = (subjectId: string): string => {
    return subjects.find((s) => s.id === subjectId)?.name || "Mata Pelajaran";
  };

  const openCreateModal = () => {
    setEditingAssignment(null);
    setFormClassId(selectedClassFilter !== "all" ? selectedClassFilter : classes[0]?.id || "");
    setFormSubjectId(selectedSubjectFilter !== "all" ? selectedSubjectFilter : subjects[0]?.id || "");
    setTitle("");
    setInstructions("");
    setDueDate("");
    setMaxScore("100");
    setFormError("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormClassId(asg.class_id);
    setFormSubjectId(asg.subject_id);
    setTitle(asg.title);
    setInstructions(asg.instructions);
    setDueDate(asg.due_date ? asg.due_date.slice(0, 16) : "");
    setMaxScore(asg.max_score.toString());
    setFormError("");
    setIsCreateModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim() || !dueDate) {
      setFormError("Judul, instruksi, dan tenggat waktu tugas wajib diisi.");
      return;
    }

    if (editingAssignment) {
      DataRepository.updateAssignment(editingAssignment.id, {
        class_id: formClassId,
        subject_id: formSubjectId,
        title,
        instructions,
        due_date: new Date(dueDate).toISOString(),
        max_score: parseFloat(maxScore) || 100,
      });
    } else {
      DataRepository.addAssignment({
        class_id: formClassId,
        subject_id: formSubjectId,
        author_id: currentUser.id,
        title,
        instructions,
        start_date: new Date().toISOString(),
        due_date: new Date(dueDate).toISOString(),
        max_score: parseFloat(maxScore) || 100,
        allow_late_submission: true,
        submission_type: "all",
        status: "published",
      });
    }

    setIsCreateModalOpen(false);
    loadData();
  };

  const handleDeleteAssignment = (asg: Assignment) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tugas "${asg.title}"?`)) {
      DataRepository.deleteAssignment(asg.id);
      loadData();
    }
  };

  const openGradeModal = (sub: Submission) => {
    setGradingSubmission(sub);
    setInputScore(sub.score ? sub.score.toString() : "");
    setInputFeedback(sub.feedback || "");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    DataRepository.gradeSubmission(
      gradingSubmission.id,
      parseFloat(inputScore) || 0,
      inputFeedback,
      currentUser.id
    );

    setGradingSubmission(null);
    loadData();
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((asg) => {
    const matchClass = selectedClassFilter === "all" || asg.class_id === selectedClassFilter;
    const matchSubject = selectedSubjectFilter === "all" || asg.subject_id === selectedSubjectFilter;
    return matchClass && matchSubject;
  });

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const asg = assignments.find((a) => a.id === sub.assignment_id);
    if (!asg) return false;

    // Filter by class
    const matchClass = selectedClassFilter === "all" || asg.class_id === selectedClassFilter;
    const matchSubject = selectedSubjectFilter === "all" || asg.subject_id === selectedSubjectFilter;

    // Filter by student search
    const student = getStudentProfile(sub.student_id);
    const sName = student ? student.full_name.toLowerCase() : "";
    const matchStudent = !studentSearch || sName.includes(studentSearch.toLowerCase());

    return matchClass && matchSubject && matchStudent;
  });

  return (
    <DashboardShell
      title="Manajemen Tugas & Penilaian Siswa"
      subtitle="Filter penugasan per rombongan belajar kelas dan periksa pengumpulan tugas masing-masing murid"
    >
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Penugasan Kelas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {filteredAssignments.length} penugasan pada filter saat ini
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Buat Tugas Baru
        </Button>
      </div>

      {/* Class & Subject Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Class Filter Dropdown */}
          <div className="w-full md:w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter Kelas
            </label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Kelas Diampu</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Tingkat {c.grade_level})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter Dropdown */}
          <div className="w-full md:w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter Mata Pelajaran
            </label>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Mata Pelajaran</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Search Student for Submissions */}
          <div className="flex-1 w-full md:pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama murid pengumpul tugas..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Grid Tugas Terjadwal */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-600" />
          Paket Tugas Aktif
        </h3>

        {filteredAssignments.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            <p className="font-semibold text-sm">Tidak ada tugas pada filter kelas/mapel ini.</p>
            <p className="text-xs mt-1">Ganti filter atau buat tugas baru.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAssignments.map((asg) => (
              <Card key={asg.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="indigo">{getSubjectName(asg.subject_id)}</Badge>
                      <Badge variant="default" className="bg-slate-100 text-slate-700 font-bold">
                        {getClassName(asg.class_id)}
                      </Badge>
                    </div>
                    <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Tenggat: {formatTanggalIndo(asg.due_date)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                      {asg.instructions}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Nilai Maksimal: <b className="text-slate-900">{asg.max_score} Poin</b>
                  </span>

                  <div className="flex items-center gap-2">
                    <Badge variant="success">
                      {asg.submissions_count || 0} Terkumpul
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(asg)}
                      title="Edit Tugas"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAssignment(asg)}
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tabel Pengumpulan Tugas Siswa Berdasarkan Kelas */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Lembar Pengumpulan Murid (Sesuai Filter Kelas)
          </h3>
          <span className="text-xs text-slate-500">
            {filteredSubmissions.length} berkas jawaban siswa
          </span>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Murid</th>
                  <th className="py-3 px-4">Kelas & Mapel</th>
                  <th className="py-3 px-4">Judul Tugas</th>
                  <th className="py-3 px-4">Waktu Pengumpulan</th>
                  <th className="py-3 px-4">Status & Nilai</th>
                  <th className="py-3 px-4 text-right">Aksi Penilaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Tidak ada pengumpulan tugas yang sesuai dengan filter kelas saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const student = getStudentProfile(sub.student_id);
                    const asg = assignments.find((a) => a.id === sub.assignment_id);

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">
                            {student?.full_name || "Murid"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            NISN: {student?.nip_nisn || "-"}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {asg ? getClassName(asg.class_id) : "-"}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {asg ? getSubjectName(asg.subject_id) : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-medium text-slate-900 truncate">
                            {asg?.title || "Tugas"}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {sub.text_answer || "Mengunggah lampiran jawaban."}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {formatTanggalIndo(sub.submitted_at)}
                        </td>
                        <td className="py-3 px-4">
                          {sub.status === "graded" ? (
                            <span className="inline-flex items-center text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              Nilai: {sub.score}
                            </span>
                          ) : (
                            <Badge variant="warning">Perlu Dinilai</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant={sub.status === "graded" ? "outline" : "primary"}
                            onClick={() => openGradeModal(sub)}
                          >
                            <FileCheck className="w-3.5 h-3.5 mr-1" />
                            {sub.status === "graded" ? "Koreksi Nilai" : "Beri Nilai"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create / Edit Assignment Modal */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingAssignment ? "Edit Tugas Siswa" : "Buat Tugas Baru"}
        description="Rancang penugasan terstruktur untuk peserta didik sesuai kelas dan mata pelajaran."
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Pilih Kelas Rombel
              </label>
              <select
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mata Pelajaran
              </label>
              <select
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Judul Tugas"
            placeholder="Contoh: Tugas 2: Pemecahan Masalah Matriks..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tenggat Waktu (Deadline)"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Input
              label="Nilai Maksimal (Bobot)"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="100"
              required
            />
          </div>

          <Textarea
            label="Petunjuk & Instruksi Lengkap Pengerjaan"
            placeholder="Tuliskan butir soal atau langkah tugas secara jelas..."
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editingAssignment ? "Simpan Perubahan" : "Terbitkan Tugas"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <Dialog
          isOpen={true}
          onClose={() => setGradingSubmission(null)}
          title="Koreksi & Penilaian Tugas Siswa"
          description="Berikan evaluasi angka dan catatan umpan balik yang membangun untuk siswa."
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Jawaban Teks Siswa:
              </span>
              <p className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                {gradingSubmission.text_answer || "Siswa mengunggah file portofolio jawaban."}
              </p>
            </div>

            <Input
              label="Nilai Angka (Skala 0 - 100)"
              type="number"
              min="0"
              max="100"
              placeholder="Contoh: 95"
              value={inputScore}
              onChange={(e) => setInputScore(e.target.value)}
              required
            />

            <Textarea
              label="Umpan Balik Guru (Feedback Konstruktif)"
              placeholder="Berikan masukan mengenai kelebihan dan perbaikan jawaban siswa..."
              rows={4}
              value={inputFeedback}
              onChange={(e) => setInputFeedback(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setGradingSubmission(null)}
              >
                Batal
              </Button>
              <Button type="submit">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Simpan & Publikasikan Nilai
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}

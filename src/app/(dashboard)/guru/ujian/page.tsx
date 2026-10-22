"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { Exam, ExamQuestion, ClassRoom, Subject } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  FileText,
  PlusCircle,
  Clock,
  Award,
  CheckCircle2,
  HelpCircle,
  Eye,
  Edit,
  Trash2,
  Settings,
  Plus,
  Check,
  AlertCircle,
  ListOrdered,
} from "lucide-react";

export default function GuruUjianPage() {
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [classes, setClasses] = React.useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  // Exam Modals
  const [isExamModalOpen, setIsExamModalOpen] = React.useState(false);
  const [editingExam, setEditingExam] = React.useState<Exam | null>(null);

  // Question Management Modal
  const [managingExam, setManagingExam] = React.useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = React.useState<ExamQuestion[]>([]);

  // Question Editor Modal (Add/Edit question)
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<ExamQuestion | null>(null);
  const [qType, setQType] = React.useState<"multiple_choice" | "true_false" | "essay">("multiple_choice");
  const [qText, setQText] = React.useState("");
  const [qPoints, setQPoints] = React.useState("20");
  const [optA, setOptA] = React.useState("");
  const [optB, setOptB] = React.useState("");
  const [optC, setOptC] = React.useState("");
  const [optD, setOptD] = React.useState("");
  const [correctOpt, setCorrectOpt] = React.useState<string>("A");
  const [qError, setQError] = React.useState("");

  // Exam Form states
  const [formClassId, setFormClassId] = React.useState("");
  const [formSubjectId, setFormSubjectId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [durationMinutes, setDurationMinutes] = React.useState("60");
  const [passingScore, setPassingScore] = React.useState("75");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setExams(DataRepository.getExams());
    setClasses(DataRepository.getClasses());
    setSubjects(DataRepository.getSubjects());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const currentUser = DataRepository.getCurrentUser();

  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name || "Semua Kelas";
  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "Mata Pelajaran";

  const openCreateExamModal = () => {
    setEditingExam(null);
    setFormClassId(classes[0]?.id || "");
    setFormSubjectId(subjects[0]?.id || "");
    setTitle("");
    setDescription("");
    setDurationMinutes("60");
    setPassingScore("75");
    setStartTime("");
    setEndTime("");
    setFormError("");
    setIsExamModalOpen(true);
  };

  const openEditExamModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormClassId(exam.class_id);
    setFormSubjectId(exam.subject_id);
    setTitle(exam.title);
    setDescription(exam.description || "");
    setDurationMinutes(exam.duration_minutes.toString());
    setPassingScore(exam.passing_score.toString());
    setStartTime(exam.start_time ? exam.start_time.slice(0, 16) : "");
    setEndTime(exam.end_time ? exam.end_time.slice(0, 16) : "");
    setFormError("");
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !durationMinutes) {
      setFormError("Judul dan durasi ujian wajib diisi.");
      return;
    }

    if (editingExam) {
      DataRepository.updateExam(editingExam.id, {
        class_id: formClassId,
        subject_id: formSubjectId,
        title,
        description,
        duration_minutes: parseInt(durationMinutes) || 60,
        passing_score: parseFloat(passingScore) || 75,
        start_time: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      setIsExamModalOpen(false);
      loadData();
    } else {
      const newExam = DataRepository.addExam({
        class_id: formClassId,
        subject_id: formSubjectId,
        author_id: currentUser.id,
        title,
        description,
        start_time: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
        duration_minutes: parseInt(durationMinutes) || 60,
        is_published: true,
        show_result_immediately: true,
        passing_score: parseFloat(passingScore) || 75,
      });

      setIsExamModalOpen(false);
      loadData();
      // Directly open Question Manager so teacher can immediately add questions!
      openManageQuestions(newExam);
    }
  };

  const handleDeleteExam = (exam: Exam) => {
    if (confirm(`Apakah Anda yakin ingin menghapus paket ujian "${exam.title}"? Seluruh butir soal dalam ujian ini akan dihapus.`)) {
      DataRepository.deleteExam(exam.id);
      loadData();
    }
  };

  // Question Management Functions
  const openManageQuestions = (exam: Exam) => {
    setManagingExam(exam);
    const qList = DataRepository.getExamQuestions(exam.id);
    setExamQuestions(qList);
  };

  const reloadQuestions = (examId: string) => {
    setExamQuestions(DataRepository.getExamQuestions(examId));
  };

  const openAddQuestion = () => {
    setEditingQuestion(null);
    setQType("multiple_choice");
    setQText("");
    setQPoints("20");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrectOpt("A");
    setQError("");
    setIsQuestionEditorOpen(true);
  };

  const openEditQuestion = (q: ExamQuestion) => {
    setEditingQuestion(q);
    setQType(q.question_type);
    setQText(q.question_text);
    setQPoints(q.points.toString());
    setQError("");

    if (q.question_type === "multiple_choice" && q.options) {
      setOptA(q.options[0]?.option_text || "");
      setOptB(q.options[1]?.option_text || "");
      setOptC(q.options[2]?.option_text || "");
      setOptD(q.options[3]?.option_text || "");

      const correctIndex = q.options.findIndex((o) => o.is_correct);
      const letter = correctIndex === 0 ? "A" : correctIndex === 1 ? "B" : correctIndex === 2 ? "C" : correctIndex === 3 ? "D" : "A";
      setCorrectOpt(letter);
    } else if (q.question_type === "true_false" && q.options) {
      const correctIndex = q.options.findIndex((o) => o.is_correct);
      setCorrectOpt(correctIndex === 0 ? "Benar" : "Salah");
    }

    setIsQuestionEditorOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingExam) return;

    if (!qText.trim()) {
      setQError("Isi butir pertanyaan ujian wajib diisi.");
      return;
    }

    let optionsData: any = undefined;

    if (qType === "multiple_choice") {
      if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
        setQError("Untuk soal pilihan ganda, semua opsi (A, B, C, D) wajib diisi.");
        return;
      }
      optionsData = [
        { id: "opt-a-" + Date.now(), option_text: optA, is_correct: correctOpt === "A", order_index: 1 },
        { id: "opt-b-" + Date.now(), option_text: optB, is_correct: correctOpt === "B", order_index: 2 },
        { id: "opt-c-" + Date.now(), option_text: optC, is_correct: correctOpt === "C", order_index: 3 },
        { id: "opt-d-" + Date.now(), option_text: optD, is_correct: correctOpt === "D", order_index: 4 },
      ];
    } else if (qType === "true_false") {
      optionsData = [
        { id: "opt-tf1-" + Date.now(), option_text: "Benar", is_correct: correctOpt === "Benar", order_index: 1 },
        { id: "opt-tf2-" + Date.now(), option_text: "Salah", is_correct: correctOpt === "Salah", order_index: 2 },
      ];
    }

    if (editingQuestion) {
      DataRepository.updateExamQuestion(editingQuestion.id, {
        question_text: qText,
        question_type: qType,
        points: parseInt(qPoints) || 20,
        options: optionsData,
      });
    } else {
      DataRepository.addExamQuestion({
        exam_id: managingExam.id,
        question_text: qText,
        question_type: qType,
        points: parseInt(qPoints) || 20,
        order_index: examQuestions.length + 1,
        options: optionsData,
      });
    }

    setIsQuestionEditorOpen(false);
    reloadQuestions(managingExam.id);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!managingExam) return;
    if (confirm("Hapus butir soal ini dari paket ujian?")) {
      DataRepository.deleteExamQuestion(qId);
      reloadQuestions(managingExam.id);
    }
  };

  return (
    <DashboardShell
      title="Manajemen Ujian & Penilaian Terpadu"
      subtitle="Kelola bank butir soal asesmen, kunci jawaban, durasi waktu ujian, dan timer otomatis"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Paket Ujian & Ulangan Harian</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {exams.length} paket ujian aktif pada bank soal sekolah
          </p>
        </div>

        <Button onClick={openCreateExamModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Buat Paket Ujian Baru
        </Button>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => {
          const qCount = DataRepository.getExamQuestions(exam.id).length;
          return (
            <Card key={exam.id} className="p-5 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="indigo">{getSubjectName(exam.subject_id)}</Badge>
                    <Badge variant="default" className="bg-slate-100 text-slate-700 font-bold">
                      {getClassName(exam.class_id)}
                    </Badge>
                    <Badge variant={exam.is_published ? "success" : "warning"}>
                      {exam.is_published ? "Dipublikasikan" : "Draft"}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{exam.title}</h3>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {exam.description || "Ujian evaluasi kompetensi belajar."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Durasi: {exam.duration_minutes} Menit
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      KKM Kelulusan: {exam.passing_score}
                    </span>
                    <span>Mulai: {formatTanggalIndo(exam.start_time, false)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => openManageQuestions(exam)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ListOrdered className="w-3.5 h-3.5 mr-1.5" />
                    Kelola Soal ({qCount} Butir)
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditExamModal(exam)}
                    title="Edit Pengaturan Ujian"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteExam(exam)}
                    title="Hapus Paket Ujian"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal 1: Create / Edit Exam */}
      <Dialog
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title={editingExam ? "Edit Pengaturan Paket Ujian" : "Buat Paket Ujian Baru"}
        description="Atur nama ujian, alokasi kelas, mata pelajaran, durasi waktu, dan KKM."
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
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
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
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
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
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
            label="Judul Ujian"
            placeholder="Contoh: Penilaian Harian Matriks, PTS Gasal..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Durasi Pengerjaan (Menit)"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="60"
              required
            />
            <Input
              label="Nilai KKM (Passing Score)"
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              placeholder="75"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waktu Buka Ujian"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="Waktu Batas Tutup Ujian"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <Textarea
            label="Petunjuk Khusus & Deskripsi Ujian"
            placeholder="Tuliskan petunjuk pengerjaan bagi peserta didik..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExamModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editingExam ? "Simpan Perubahan" : "Simpan & Lanjut Masukkan Soal"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal 2: Manage Questions in Exam (Bank Soal Ujian) */}
      {managingExam && (
        <Dialog
          isOpen={true}
          onClose={() => setManagingExam(null)}
          title={`Kelola Butir Soal: ${managingExam.title}`}
          description={`Total ${examQuestions.length} butir soal terdaftar pada paket ujian ini`}
          className="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
              <div className="text-xs text-blue-900">
                <span className="font-bold">Tips Guru:</span> Anda dapat menambahkan butir soal pilihan ganda, benar/salah, atau esai. Kunci jawaban dan bobot poin dapat diedit kapan saja jika terdapat kesalahan input.
              </div>
              <Button onClick={openAddQuestion} size="sm" className="shrink-0 ml-3">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Butir Soal
              </Button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {examQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl">
                  <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-sm">Belum ada butir soal dalam ujian ini.</p>
                  <p className="text-xs mt-1">Klik tombol "Tambah Butir Soal" di atas untuk memasukkan soal pertama.</p>
                </div>
              ) : (
                examQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <Badge variant="indigo">
                          {q.question_type === "multiple_choice"
                            ? "Pilihan Ganda"
                            : q.question_type === "true_false"
                            ? "Benar / Salah"
                            : "Esai Terstruktur"}
                        </Badge>
                        <Badge variant="secondary">Bobot: {q.points} Poin</Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditQuestion(q)}
                          title="Edit Butir Soal"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-600 mr-1" />
                          Edit Soal
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(q.id)}
                          title="Hapus Soal"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {q.question_text}
                    </p>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                              opt.is_correct
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt.option_text}</span>
                            </span>
                            {opt.is_correct && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                <Check className="w-3 h-3" />
                                Kunci
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button onClick={() => setManagingExam(null)}>Selesai Mengelola Soal</Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Modal 3: Add / Edit Question Editor */}
      {isQuestionEditorOpen && (
        <Dialog
          isOpen={true}
          onClose={() => setIsQuestionEditorOpen(false)}
          title={editingQuestion ? "Edit Butir Soal Ujian" : "Tambah Butir Soal Baru"}
          description="Masukkan pertanyaan, bobot poin, dan tentukan kunci jawaban yang benar."
          className="max-w-2xl"
        >
          <form onSubmit={handleSaveQuestion} className="space-y-4">
            {qError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {qError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Tipe Soal
                </label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="multiple_choice">Pilihan Ganda (A, B, C, D)</option>
                  <option value="true_false">Benar / Salah</option>
                  <option value="essay">Esai / Uraian Terbuka</option>
                </select>
              </div>

              <Input
                label="Bobot Poin Soal"
                type="number"
                value={qPoints}
                onChange={(e) => setQPoints(e.target.value)}
                placeholder="20"
                required
              />
            </div>

            <Textarea
              label="Teks Pertanyaan / Soal"
              placeholder="Tuliskan butir soal atau studi kasus yang harus dijawab siswa..."
              rows={4}
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              required
            />

            {/* Multiple Choice Options Configuration */}
            {qType === "multiple_choice" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Pilihan Jawaban & Kunci Jawaban:
                </label>

                {[
                  { key: "A", val: optA, set: setOptA },
                  { key: "B", val: optB, set: setOptB },
                  { key: "C", val: optC, set: setOptC },
                  { key: "D", val: optD, set: setOptD },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="correct_option"
                        checked={correctOpt === item.key}
                        onChange={() => setCorrectOpt(item.key)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        correctOpt === item.key ? "bg-emerald-600 text-white font-bold" : "bg-slate-100 text-slate-700"
                      }`}>
                        {item.key}
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Teks pilihan opsi ${item.key}...`}
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                    />
                    {correctOpt === item.key && (
                      <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                        (Kunci)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* True/False Options Configuration */}
            {qType === "true_false" && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Tentukan Kunci Jawaban:
                </label>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border bg-slate-50">
                    <input
                      type="radio"
                      name="tf_option"
                      checked={correctOpt === "Benar"}
                      onChange={() => setCorrectOpt("Benar")}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>Pernyataan Benar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border bg-slate-50">
                    <input
                      type="radio"
                      name="tf_option"
                      checked={correctOpt === "Salah"}
                      onChange={() => setCorrectOpt("Salah")}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>Pernyataan Salah</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuestionEditorOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                {editingQuestion ? "Simpan Perubahan Soal" : "Tambahkan Soal"}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}

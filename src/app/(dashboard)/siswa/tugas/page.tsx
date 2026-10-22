"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { Assignment, Submission } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  CheckSquare,
  Clock,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  MessageSquareQuote,
} from "lucide-react";

export default function SiswaTugasPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [activeTask, setActiveTask] = React.useState<Assignment | null>(null);

  // Form states for submission
  const [textAnswer, setTextAnswer] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successToast, setSuccessToast] = React.useState(false);

  const currentUser = DataRepository.getCurrentUser();

  const loadData = () => {
    setAssignments(DataRepository.getAssignments());
    setSubmissions(DataRepository.getSubmissions());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const openSubmitModal = (asg: Assignment) => {
    setActiveTask(asg);
    const existing = submissions.find(
      (s) => s.assignment_id === asg.id && s.student_id === currentUser.id
    );
    setTextAnswer(existing?.text_answer || "");
    setFileName(existing?.files?.[0]?.file_name || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    setIsSubmitting(true);
    setTimeout(() => {
      DataRepository.submitAssignment({
        assignment_id: activeTask.id,
        student_id: currentUser.id,
        text_answer: textAnswer,
        file_name: fileName || "Jawaban_Tugas_Siswa.pdf",
      });

      setIsSubmitting(false);
      setActiveTask(null);
      setSuccessToast(true);
      loadData();
      setTimeout(() => setSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <DashboardShell
      title="Penugasan & Lembar Kerja Siswa"
      subtitle="Kirimkan lembar jawaban tugas mandiri dan pantau evaluasi nilai dari guru"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Tugas Aktif</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perhatikan batas tenggat waktu masing-masing penugasan
          </p>
        </div>

        {successToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            Tugas Berhasil Terkirim ke Guru!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((asg) => {
          const mySubmission = submissions.find(
            (s) => s.assignment_id === asg.id && s.student_id === currentUser.id
          );
          const isGraded = mySubmission?.status === "graded";
          const isSubmitted = !!mySubmission;

          return (
            <Card key={asg.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo">Matematika Terpadu</Badge>
                  {isGraded ? (
                    <Badge variant="success">Dinilai ({mySubmission.score} Poin)</Badge>
                  ) : isSubmitted ? (
                    <Badge variant="warning">Telah Dikumpulkan</Badge>
                  ) : (
                    <Badge variant="destructive">Belum Mengumpulkan</Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {asg.instructions}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Batas: {formatTanggalIndo(asg.due_date)}
                  </span>
                  <span className="text-slate-500">Bobot: <b>{asg.max_score} Poin</b></span>
                </div>

                {/* Catatan / Feedback Guru Jika Sudah Dinilai */}
                {isGraded && mySubmission.feedback && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-700">
                      <MessageSquareQuote className="w-3.5 h-3.5" />
                      Umpan Balik Guru:
                    </p>
                    <p className="italic leading-relaxed">
                      "{mySubmission.feedback}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isSubmitted ? "Jawaban tersimpan di sistem" : "Segera kirimkan sebelum batas akhir"}
                </span>

                <Button size="sm" onClick={() => openSubmitModal(asg)}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {isSubmitted ? "Kirim Revisi Tugas" : "Kirim Jawaban Tugas"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit Assignment Modal */}
      {activeTask && (
        <Dialog
          isOpen={true}
          onClose={() => setActiveTask(null)}
          title={`Pengumpulan: ${activeTask.title}`}
          description="Ketikkan uraian jawaban atau lampirkan berkas file tugas Anda."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
              <b>Petunjuk Tugas:</b> {activeTask.instructions}
            </div>

            <Textarea
              label="Lembar Jawaban Teks"
              placeholder="Tuliskan uraian solusi langkah perhitungan atau jawaban tugas Anda di sini..."
              rows={6}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              required={!fileName}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Unggah File Lampiran (PDF, Word, Gambar)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">
                  {fileName || "Klik untuk memilih berkas jawaban dari komputer"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Maksimal 25 MB (Format .pdf, .docx, .png, .jpg)
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="task-file-input"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2.5"
                  onClick={() => document.getElementById("task-file-input")?.click()}
                >
                  Pilih Berkas File
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTask(null)}
              >
                Batal
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Kirimkan Tugas Sekarang
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}

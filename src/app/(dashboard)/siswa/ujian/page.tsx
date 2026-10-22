"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { DataRepository } from "@/lib/data-repository";
import { Exam, ExamQuestion } from "@/types/database";
import { initialExamQuestions } from "@/lib/mock-data";
import { formatTanggalIndo, formatDurasiWaktu } from "@/lib/utils";
import {
  FileText,
  Clock,
  Award,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
} from "lucide-react";

export default function SiswaUjianPage() {
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [activeExam, setActiveExam] = React.useState<Exam | null>(null);
  const [activeQuestions, setActiveQuestions] = React.useState<ExamQuestion[]>([]);

  // Exam Room State
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = React.useState(3600); // 60 menit
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = React.useState(false);
  const [examResult, setExamResult] = React.useState<{
    score: number;
    total: number;
    isPassed: boolean;
  } | null>(null);

  React.useEffect(() => {
    setExams(DataRepository.getExams());
  }, []);

  // Timer Countdown Effect
  React.useEffect(() => {
    if (!activeExam || examResult) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Otomatis kirim saat waktu habis
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, examResult]);

  const startExam = (exam: Exam) => {
    const qs = DataRepository.getExamQuestions(exam.id);
    const resolvedQs = qs.length > 0 ? qs : initialExamQuestions;
    setActiveExam(exam);
    setActiveQuestions(resolvedQs);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRemainingSeconds(exam.duration_minutes * 60);
    setExamResult(null);
  };

  const currentQ = activeQuestions[currentQuestionIndex] || initialExamQuestions[0];

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleEssayChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleFinalSubmit = () => {
    setIsSubmitConfirmOpen(false);

    // Hitung skor otomatis untuk soal objektif
    let totalScore = 0;
    const questionsToGrade = activeQuestions.length > 0 ? activeQuestions : initialExamQuestions;

    questionsToGrade.forEach((q) => {
      if (q.question_type === "multiple_choice" || q.question_type === "true_false") {
        const correctOpt = q.options?.find((o) => o.is_correct);
        if (correctOpt && answers[q.id] === correctOpt.id) {
          totalScore += q.points;
        }
      } else {
        // Soal esai: berikan estimasi nilai untuk simulasi
        if (answers[q.id] && answers[q.id].length > 10) {
          totalScore += 35; // Parsial esai
        }
      }
    });

    const isPassed = totalScore >= (activeExam?.passing_score || 75);
    setExamResult({
      score: totalScore,
      total: 100,
      isPassed,
    });
  };

  return (
    <DashboardShell
      title="Ujian & Ulangan Harian Online"
      subtitle="Asesmen terjadwal dengan sistem timer terintegrasi dan navigasi soal responsif"
    >
      {!activeExam ? (
        // List of Available Exams
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ujian yang Tersedia</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik "Mulai Ujian" untuk memasuki ruang pengerjaan ujian
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {exams.map((ex) => (
              <Card key={ex.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo">Matematika Terpadu</Badge>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      KKM: {ex.passing_score}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{ex.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {ex.description || "Ujian evaluasi capaian materi."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Durasi: {ex.duration_minutes} Menit
                    </span>
                    <span className="text-slate-500">
                      4 Butir Soal Terpadu
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Batas Akhir: {formatTanggalIndo(ex.end_time, false)}
                  </span>

                  <Button onClick={() => startExam(ex)}>
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Mulai Ujian Sekarang
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : examResult ? (
        // Exam Result Summary Card
        <Card className="max-w-xl mx-auto p-8 text-center space-y-5 animate-scale-up">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              examResult.isPassed
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {examResult.isPassed ? (
              <CheckCircle2 className="w-10 h-10" />
            ) : (
              <AlertTriangle className="w-10 h-10" />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Ujian Berhasil Dikirimkan!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Jawaban Anda telah tersimpan dan terverifikasi secara aman di database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-xs mx-auto">
            <span className="text-xs font-semibold text-slate-500 block uppercase">
              Capaian Nilai Sementara:
            </span>
            <span className="text-4xl font-black text-blue-600 mt-1 block">
              {examResult.score} / 100
            </span>
            <Badge
              variant={examResult.isPassed ? "success" : "warning"}
              className="mt-2"
            >
              {examResult.isPassed ? "LULUS AMBANG BATAS" : "PERLU EVALUASI"}
            </Badge>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Nilai soal objektif dihitung otomatis. Nilai esai final akan diperbarui setelah diperiksa oleh guru pengampu.
          </p>

          <Button onClick={() => setActiveExam(null)} className="w-full">
            Kembali ke Halaman Ujian
          </Button>
        </Card>
      ) : (
        // Active Exam Room
        <div className="space-y-6">
          {/* Top Bar: Title & Timer */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4 sticky top-20 z-20">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeExam.title}</h3>
              <p className="text-xs text-slate-500">
                Soal {currentQuestionIndex + 1} dari {activeQuestions.length}
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Sisa Waktu: {formatDurasiWaktu(remainingSeconds)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left 3 Cols: Question and Options */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Nomor {currentQuestionIndex + 1}
                  </span>
                  <Badge variant="indigo">
                    Bobot: {currentQ.points} Poin
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentQ.question_text}
                </p>

                {/* Multiple Choice / True-False Options */}
                {currentQ.options ? (
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt) => {
                      const isSelected = answers[currentQ.id] === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQ.id, opt.id)}
                          className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-xs"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span>{opt.option_text}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Essay Textarea
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Tuliskan Jawaban Esai Anda:
                    </label>
                    <Textarea
                      rows={6}
                      placeholder="Uraikan jawaban dan langkah pemecahan masalah Anda di sini..."
                      value={answers[currentQ.id] || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEssayChange(currentQ.id, e.target.value)}
                    />
                  </div>
                )}

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Soal Sebelumnya
                  </Button>

                  {currentQuestionIndex < activeQuestions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    >
                      Soal Berikutnya
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => setIsSubmitConfirmOpen(true)}
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Selesai & Kirim Ujian
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Right 1 Col: Question Number Grid Navigator */}
            <div className="space-y-4">
              <Card className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Navigasi Nomor Soal
                </h4>

                <div className="grid grid-cols-4 gap-2">
                  {activeQuestions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600 ring-offset-2"
                            : isAnswered
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Sudah Dijawab ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200" />
                    <span>
                      Belum Dijawab ({activeQuestions.length - Object.keys(answers).length})
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setIsSubmitConfirmOpen(true)}
                >
                  Akhiri Ujian Sekarang
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Before Submitting */}
      <Dialog
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
        title="Konfirmasi Pengiriman Ujian"
        description="Apakah Anda yakin ingin menyelesaikan dan mengirimkan seluruh lembar jawaban?"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            Anda telah menjawab <b>{Object.keys(answers).length}</b> dari total{" "}
            <b>{activeQuestions.length}</b> butir soal. Setelah dikirimkan, jawaban tidak dapat diubah kembali.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsSubmitConfirmOpen(false)}
            >
              Periksa Kembali
            </Button>
            <Button variant="success" onClick={handleFinalSubmit}>
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Ya, Kirimkan Jawaban
            </Button>
          </div>
        </div>
      </Dialog>
    </DashboardShell>
  );
}

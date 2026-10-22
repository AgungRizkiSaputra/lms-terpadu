"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { Submission, Assignment } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  Award,
  MessageSquareQuote,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Clock,
  XCircle,
} from "lucide-react";

function getLetterGrade(score: number): { label: string; color: string; bg: string } {
  if (score >= 93) return { label: "A", color: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 85) return { label: "A-", color: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 78) return { label: "B+", color: "text-blue-700", bg: "bg-blue-50" };
  if (score >= 75) return { label: "B", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 68) return { label: "C+", color: "text-amber-700", bg: "bg-amber-50" };
  if (score >= 60) return { label: "C", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "D", color: "text-rose-600", bg: "bg-rose-50" };
}

function getPredikat(average: number): string {
  if (average >= 90) return "SANGAT BAIK (A)";
  if (average >= 80) return "BAIK (B)";
  if (average >= 70) return "CUKUP (C)";
  return "PERLU PERBAIKAN (D)";
}

export default function SiswaNilaiPage() {
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const currentUser = DataRepository.getCurrentUser();
  const subjects = DataRepository.getSubjects();

  React.useEffect(() => {
    setSubmissions(DataRepository.getSubmissions());
    setAssignments(DataRepository.getAssignments());
  }, []);

  // Get only this student's graded submissions
  const mySubmissions = submissions.filter(
    (s) => s.student_id === currentUser.id && s.status === "graded"
  );

  // Pending submissions (submitted but not yet graded)
  const pendingSubmissions = submissions.filter(
    (s) => s.student_id === currentUser.id && s.status === "submitted"
  );

  // Compute averages
  const gradedScores = mySubmissions.map((s) => s.score ?? 0);
  const average =
    gradedScores.length > 0
      ? Math.round(gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length)
      : null;

  const isPassed = average !== null && average >= 75;

  // Get assignment title for a submission
  const getAssignmentTitle = (assignmentId: string) => {
    return assignments.find((a) => a.id === assignmentId)?.title ?? "Penugasan";
  };

  // Get subject name for an assignment
  const getSubjectForAssignment = (assignmentId: string) => {
    const asg = assignments.find((a) => a.id === assignmentId);
    if (!asg) return "Mapel";
    return subjects.find((s) => s.id === asg.subject_id)?.name ?? "Mapel";
  };

  const letterGrade = average !== null ? getLetterGrade(average) : null;

  return (
    <DashboardShell
      title="Rapor & Capaian Nilai"
      subtitle="Evaluasi hasil belajar: penugasan, ujian, dan catatan dari guru"
    >
      {/* Overview Metric Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <Badge variant={isPassed ? "success" : "warning"} className="mb-2">
            {average !== null ? `PREDIKAT AKADEMIK: ${getPredikat(average)}` : "BELUM ADA PENILAIAN"}
          </Badge>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Transkrip Nilai Mandiri: {currentUser.full_name.split(" ").slice(0, 2).join(" ")}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            NISN: {currentUser.nip_nisn || "-"} • Semester Ganjil 2026/2027
          </p>
        </div>

        <div className="flex items-center gap-3">
          {average !== null ? (
            <>
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-center min-w-[80px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Rata-Rata
                </span>
                <p className="text-2xl font-black text-blue-600 mt-0.5">{average}</p>
              </div>
              {letterGrade && (
                <div className={`p-3.5 rounded-xl border text-center min-w-[80px] ${letterGrade.bg} border-current`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Predikat
                  </span>
                  <p className={`text-2xl font-black mt-0.5 ${letterGrade.color}`}>
                    {letterGrade.label}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-400 font-medium">
                Belum ada nilai
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Award className="w-5 h-5 mx-auto text-blue-600 mb-1" />
          <p className="text-2xl font-black text-blue-700">{mySubmissions.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold">Tugas Dinilai</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-5 h-5 mx-auto text-amber-600 mb-1" />
          <p className="text-2xl font-black text-amber-600">{pendingSubmissions.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold">Menunggu Nilai</p>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
          <p className="text-2xl font-black text-emerald-700">
            {mySubmissions.filter((s) => (s.score ?? 0) >= 75).length}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">Nilai Tuntas</p>
        </Card>
        <Card className="p-4 text-center">
          <XCircle className="w-5 h-5 mx-auto text-rose-500 mb-1" />
          <p className="text-2xl font-black text-rose-600">
            {mySubmissions.filter((s) => (s.score ?? 0) < 75).length}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">Perlu Perbaikan</p>
        </Card>
      </div>

      {/* Detail of Graded Submissions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Rincian Nilai Penugasan & Asesmen
        </h3>

        {mySubmissions.length === 0 ? (
          <Card className="p-10 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Belum ada nilai yang diterima</p>
            <p className="text-xs text-slate-400 mt-1">Kerjakan tugas dan tunggu penilaian dari guru</p>
          </Card>
        ) : (
          mySubmissions.map((sub) => {
            const grade = getLetterGrade(sub.score ?? 0);
            const isPassing = (sub.score ?? 0) >= 75;
            return (
              <Card key={sub.id} className="p-5 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="indigo">{getSubjectForAssignment(sub.assignment_id)}</Badge>
                      <Badge variant="success">Telah Dinilai Guru</Badge>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {getAssignmentTitle(sub.assignment_id)}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Diserahkan pada: {formatTanggalIndo(sub.submitted_at)}
                    </p>

                    {sub.feedback && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1 mt-2">
                        <p className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-700">
                          <MessageSquareQuote className="w-3.5 h-3.5" />
                          Catatan Evaluasi Guru:
                        </p>
                        <p className="italic leading-relaxed">&ldquo;{sub.feedback}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center shrink-0 min-w-[80px]">
                    <span className="text-[11px] text-slate-400 block font-medium">Nilai</span>
                    <span
                      className={`text-4xl font-black ${isPassing ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {sub.score ?? 0}
                    </span>
                    <span
                      className={`text-lg font-black block mt-0.5 ${grade.color}`}
                    >
                      {grade.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {isPassing ? "Tuntas" : "Remedial"}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}

        {/* Pending submissions notice */}
        {pendingSubmissions.length > 0 && (
          <Card className="p-4 border-amber-200 bg-amber-50/50">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800">
                  {pendingSubmissions.length} Tugas Menunggu Penilaian Guru
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Tugas sudah dikumpulkan dan sedang dalam proses koreksi oleh guru pengampu.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}

"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataRepository } from "@/lib/data-repository";
import { Profile, Assignment, Submission, Subject, ClassRoom, ClassSchedule } from "@/types/database";
import {
  Award,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";

function getLetterGrade(
  score: number | null | undefined,
  passingGrade: number = 75
): { label: string; color: string } {
  if (score === null || score === undefined) return { label: "Belum", color: "text-slate-400" };
  if (score >= 93) return { label: "A", color: "text-emerald-700" };
  if (score >= 85) return { label: "A-", color: "text-emerald-600" };
  if (score >= 78) return { label: "B+", color: "text-blue-700" };
  if (score >= passingGrade) return { label: "B", color: "text-blue-600" };
  if (score >= 68) return { label: "C+", color: "text-amber-700" };
  if (score >= 60) return { label: "C", color: "text-amber-600" };
  return { label: "D", color: "text-rose-600" };
}

export default function GuruPenilaianPage() {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [classes, setClasses] = React.useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [schedules, setSchedules] = React.useState<ClassSchedule[]>([]);

  // Selected filters
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>("");
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");

  React.useEffect(() => {
    const profs = DataRepository.getProfiles();
    const asgs = DataRepository.getAssignments();
    const subs = DataRepository.getSubmissions();
    const cls = DataRepository.getClasses();
    const sbjs = DataRepository.getSubjects();
    const scheds = DataRepository.getSchedules();

    setProfiles(profs);
    setAssignments(asgs);
    setSubmissions(subs);
    setClasses(cls);
    setSubjects(sbjs);
    setSchedules(scheds);
  }, []);

  const currentUser = DataRepository.getCurrentUser();

  // Find ONLY subjects taught by this teacher
  // Based on ClassSchedule, or assignments created by this teacher
  const teacherSchedules = schedules.filter((s) => s.teacher_id === currentUser.id);
  const teacherAssignmentSubjectIds = assignments
    .filter((a) => a.author_id === currentUser.id)
    .map((a) => a.subject_id);

  const teacherScheduleSubjectIds = teacherSchedules.map((s) => s.subject_id);

  const taughtSubjectIds = Array.from(
    new Set([...teacherScheduleSubjectIds, ...teacherAssignmentSubjectIds])
  );

  // If no specific schedule found (e.g. admin logged in as guru or custom user), fall back to available subjects
  const teacherSubjects = taughtSubjectIds.length > 0
    ? subjects.filter((s) => taughtSubjectIds.includes(s.id))
    : subjects.slice(0, 2);

  // Set initial selected subject if not set
  React.useEffect(() => {
    if (teacherSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(teacherSubjects[0].id);
    }
  }, [teacherSubjects, selectedSubjectId]);

  // Find classes where this teacher teaches the selected subject
  const currentSubjectSchedules = teacherSchedules.filter(
    (s) => s.subject_id === selectedSubjectId
  );
  const classIdsForSubject = Array.from(new Set(currentSubjectSchedules.map((s) => s.class_id)));

  const availableClasses = classIdsForSubject.length > 0
    ? classes.filter((c) => classIdsForSubject.includes(c.id))
    : classes;

  // Set initial selected class if not set or invalid
  React.useEffect(() => {
    if (availableClasses.length > 0) {
      const isValid = availableClasses.some((c) => c.id === selectedClassId);
      if (!isValid) {
        setSelectedClassId(availableClasses[0].id);
      }
    }
  }, [availableClasses, selectedClassId]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const kkm = selectedSubject?.passing_grade || 75;

  const students = profiles.filter((p) => p.role === "siswa");

  // ONLY assignments for selected class AND selected subject taught by this teacher!
  const classAssignments = assignments.filter(
    (a) => a.class_id === selectedClassId && a.subject_id === selectedSubjectId
  );

  // Build grade matrix: student -> assignment -> score
  const gradeMatrix = students.map((student) => {
    const grades = classAssignments.map((asg) => {
      const sub = submissions.find(
        (s) => s.assignment_id === asg.id && s.student_id === student.id
      );
      return {
        assignmentId: asg.id,
        score: sub?.status === "graded" ? sub.score : null,
        status: sub?.status,
      };
    });

    const scoredGrades = grades.filter((g) => g.score !== null);
    const average =
      scoredGrades.length > 0
        ? Math.round(
            scoredGrades.reduce((sum, g) => sum + (g.score ?? 0), 0) / scoredGrades.length
          )
        : null;

    return { student, grades, average };
  });

  // Class stats
  const allAverages = gradeMatrix.map((r) => r.average).filter((a) => a !== null) as number[];
  const classAverage =
    allAverages.length > 0
      ? Math.round(allAverages.reduce((s, a) => s + a, 0) / allAverages.length)
      : null;
  const passCount = allAverages.filter((a) => a >= kkm).length;
  const remedialCount = allAverages.filter((a) => a < kkm).length;

  return (
    <DashboardShell
      title="Buku Nilai & Rekapitulasi Akademik"
      subtitle="Rekap nilai tugas dan ulangan harian khusus untuk mata pelajaran yang Anda ampu"
    >
      {/* 1. Subject Selector: Only Teacher's Subjects */}
      <Card className="p-4 bg-linear-to-r from-emerald-50/60 via-white to-blue-50/40 border-emerald-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Mata Pelajaran yang Anda Ampu ({currentUser.full_name})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hanya menampilkan daftar rekap nilai dari mata pelajaran yang Anda bimbing
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Fitur ekspor rekap nilai mata pelajaran ke format Excel (.xlsx) siap digunakan.")}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Ekspor Nilai (.xlsx)
          </Button>
        </div>

        <div className="pt-3">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Pilih Mata Pelajaran:
          </label>
          <div className="flex flex-wrap gap-2">
            {teacherSubjects.map((sbj) => {
              const isSelected = selectedSubjectId === sbj.id;
              return (
                <button
                  key={sbj.id}
                  onClick={() => setSelectedSubjectId(sbj.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                      : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-80">{sbj.code}</span>
                  <span>{sbj.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    KKM: {sbj.passing_grade}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 2. Class Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Pilih Rombongan Belajar (Kelas) yang Mengikuti Mata Pelajaran Ini:
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableClasses.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedClassId === cls.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      {selectedClass && selectedSubject && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Total Peserta</p>
                <h4 className="text-lg font-bold text-slate-900">{students.length} Siswa</h4>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Rata-Rata Kelas</p>
                <h4 className="text-lg font-bold text-slate-900">{classAverage ?? "-"}</h4>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Tuntas (≥ {kkm})</p>
                <h4 className="text-lg font-bold text-emerald-700">{passCount} siswa</h4>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Remedial (&lt; {kkm})</p>
                <h4 className="text-lg font-bold text-rose-700">{remedialCount} siswa</h4>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Grade Table */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Rekap Nilai — {selectedClass?.name || ""}</span>
              <Badge variant="indigo">{selectedSubject?.name || "Mata Pelajaran"}</Badge>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kode: {selectedSubject?.code} • Kategori: {selectedSubject?.category} • Standar KKM: {kkm}
            </p>
          </div>
          <Badge variant="success">{classAssignments.length} Tugas Terdaftar</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[200px]">Nama Siswa</th>
                {classAssignments.length === 0 ? (
                  <th className="py-3 px-4 text-center text-slate-400 font-normal">
                    (Belum ada penugasan untuk mapel ini di kelas terpilih)
                  </th>
                ) : (
                  classAssignments.map((asg, i) => (
                    <th key={asg.id} className="py-3 px-4 text-center min-w-[120px]">
                      Tugas {i + 1}
                      <div className="text-[10px] font-normal text-slate-400 normal-case truncate max-w-[120px]">
                        {asg.title.length > 20 ? asg.title.slice(0, 20) + "..." : asg.title}
                      </div>
                    </th>
                  ))
                )}
                <th className="py-3 px-4 text-center min-w-[90px]">Rata-Rata</th>
                <th className="py-3 px-4 text-center min-w-[100px]">Predikat</th>
                <th className="py-3 px-4 text-center min-w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradeMatrix.length === 0 ? (
                <tr>
                  <td
                    colSpan={classAssignments.length + 4}
                    className="py-10 text-center text-slate-400"
                  >
                    Belum ada data siswa untuk kelas ini.
                  </td>
                </tr>
              ) : (
                gradeMatrix.map(({ student, grades, average }) => {
                  const isPassed = average !== null && average >= kkm;
                  const letterGrade = getLetterGrade(average, kkm);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {student.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={student.avatar_url}
                              alt={student.full_name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              {student.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{student.full_name}</p>
                            <p className="text-[11px] text-slate-400">NISN: {student.nip_nisn || "-"}</p>
                          </div>
                        </div>
                      </td>

                      {classAssignments.length === 0 ? (
                        <td className="py-3 px-4 text-center text-slate-400 italic">
                          Belum ada tugas
                        </td>
                      ) : (
                        grades.map((g, i) => (
                          <td key={i} className="py-3 px-4 text-center">
                            {g.score !== null ? (
                              <span
                                className={`font-mono font-bold text-sm ${
                                  (g.score ?? 0) >= kkm ? "text-emerald-700" : "text-rose-600"
                                }`}
                              >
                                {g.score}
                              </span>
                            ) : (
                              <span className="text-slate-300 font-bold">—</span>
                            )}
                          </td>
                        ))
                      )}

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-extrabold text-base ${
                            average !== null
                              ? average >= kkm
                                ? "text-blue-700"
                                : "text-rose-600"
                              : "text-slate-400"
                          }`}
                        >
                          {average ?? "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-black text-base ${letterGrade.color}`}>
                          {letterGrade.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {average !== null ? (
                          <Badge variant={isPassed ? "success" : "destructive"}>
                            {isPassed ? "TUNTAS" : "REMEDIAL"}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Proses</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* KKM Legend */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="font-semibold">Keterangan Predikat (KKM {kkm}):</span>
          {[
            { grade: "A", range: "≥93", color: "text-emerald-700" },
            { grade: "A-", range: "85–92", color: "text-emerald-600" },
            { grade: "B+", range: "78–84", color: "text-blue-700" },
            { grade: "B", range: `${kkm}–77`, color: "text-blue-600" },
            { grade: "C+", range: "68–74", color: "text-amber-700" },
            { grade: "C", range: "60–67", color: "text-amber-600" },
            { grade: "D", range: `<60`, color: "text-rose-600" },
          ].map((g) => (
            <span key={g.grade} className="flex items-center gap-1">
              <b className={g.color}>{g.grade}</b> ({g.range})
            </span>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}

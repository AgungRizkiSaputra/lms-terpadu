"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataRepository } from "@/lib/data-repository";
import { formatTanggalIndo } from "@/lib/utils";
import {
  GraduationCap,
  BookOpen,
  CheckSquare,
  FileText,
  PlusCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function GuruDashboardPage() {
  const [materials, setMaterials] = React.useState(DataRepository.getMaterials());
  const [assignments, setAssignments] = React.useState(DataRepository.getAssignments());
  const [submissions, setSubmissions] = React.useState(DataRepository.getSubmissions());
  const [exams, setExams] = React.useState(DataRepository.getExams());

  const pendingGrading = submissions.filter((s) => s.status === "submitted").length;

  return (
    <DashboardShell
      title="Dashboard Guru Pengampu"
      subtitle="Kelola materi pembelajaran, periksa tugas siswa, dan pantau hasil asesmen"
    >
      {/* Teacher Welcome Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Tenaga Pendidik Aktif
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Budi Santoso, S.Pd., M.Mat. • Wali Kelas X-1
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Ruang Kerja Pembelajaran Guru
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Anda mengampu 2 Rombongan Belajar dengan 69 peserta didik aktif. Kelola materi ajar terstruktur, evaluasi pengumpulan tugas, dan susun bank soal ujian CBT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/guru/materi">
            <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-xs">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Buat Materi
            </Button>
          </Link>
          <Link href="/guru/tugas">
            <Button variant="outline" size="sm" className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white">
              <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
              Buat Tugas
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Kelas Diampu"
          value="2 Rombel"
          icon={GraduationCap}
          variant="emerald"
          description="X-1 (Unggulan) & X-2"
        />
        <StatCard
          title="Materi Terbit"
          value={materials.length}
          icon={BookOpen}
          variant="blue"
          description="Modul & video ajar"
        />
        <StatCard
          title="Tugas Belum Dinilai"
          value={pendingGrading}
          icon={Clock}
          variant="amber"
          description="Perlu pemeriksaan"
        />
        <StatCard
          title="Ujian Terjadwal"
          value={exams.length}
          icon={FileText}
          variant="purple"
          description="PTS & Ulangan Harian"
        />
      </div>

      {/* Submissions to grade and Materials overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antrean Pengumpulan Tugas Yang Perlu Dinilai */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Antrean Pemeriksaan Tugas</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Pengumpulan tugas siswa yang menunggu penilaian guru</p>
            </div>
            <Link href="/guru/tugas" className="text-xs font-semibold text-emerald-600 hover:underline">
              Buka Penilaian
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">
                      Tugas Matriks Ordo 2x2
                    </p>
                    <Badge variant={sub.status === "graded" ? "success" : "warning"}>
                      {sub.status === "graded" ? `Dinilai: ${sub.score}` : "Menunggu Dinilai"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dikirim oleh siswa: {formatTanggalIndo(sub.submitted_at)}
                  </p>
                </div>

                <Link href="/guru/tugas">
                  <Button size="sm" variant={sub.status === "graded" ? "outline" : "primary"}>
                    {sub.status === "graded" ? "Ubah Nilai" : "Beri Nilai"}
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Materi Pembelajaran Terkini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Materi Ajar Aktif</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Modul pembelajaran yang dapat diakses oleh siswa</p>
            </div>
            <Link href="/guru/materi">
              <Button size="sm" variant="outline">
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                Materi Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {materials.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {m.title}
                  </h4>
                  <Badge variant="indigo">Terbit</Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {m.description}
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Diperbarui: {formatTanggalIndo(m.updated_at, false)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

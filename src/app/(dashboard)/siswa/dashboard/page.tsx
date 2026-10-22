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
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  Video,
} from "lucide-react";

export default function SiswaDashboardPage() {
  const [materials, setMaterials] = React.useState(DataRepository.getMaterials());
  const [assignments, setAssignments] = React.useState(DataRepository.getAssignments());
  const [exams, setExams] = React.useState(DataRepository.getExams());
  const [submissions, setSubmissions] = React.useState(DataRepository.getSubmissions());
  const currentUser = DataRepository.getCurrentUser();

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  return (
    <DashboardShell
      title="Dashboard Siswa Pintar"
      subtitle="Ruang belajar digital terpadu untuk mengikuti materi, tugas, dan asesmen sekolah"
    >
      {/* Student Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {currentUser.full_name} • Kelas X-1 (MIPA Unggulan)
          </span>
          <h2 className="text-xl font-extrabold tracking-tight">
            Semangat Belajar, Masa Depan Cerah!
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl leading-relaxed">
            Periksa jadwal tugas dan ujian terdekat agar capaian pembelajaran Anda senantiasa optimal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/siswa/tugas">
            <Button variant="secondary" size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
              <CheckSquare className="w-3.5 h-3.5 mr-1" />
              Kerjakan Tugas
            </Button>
          </Link>
          <Link href="/siswa/ujian">
            <Button variant="outline" size="sm" className="bg-blue-700/50 border-white/30 text-white hover:bg-blue-700">
              <FileText className="w-3.5 h-3.5 mr-1" />
              Ujian Terjadwal
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Materi Baru"
          value={materials.length}
          icon={BookOpen}
          variant="blue"
          description="Siap dipelajari"
        />
        <StatCard
          title="Tugas Aktif"
          value={assignments.length}
          icon={CheckSquare}
          variant="amber"
          description="Ada tenggat waktu"
        />
        <StatCard
          title="Ujian Terbuka"
          value={exams.length}
          icon={FileText}
          variant="purple"
          description="Penilaian Tengah Semester"
        />
        <StatCard
          title="Nilai Rata-Rata"
          value="94.0"
          icon={Award}
          variant="emerald"
          description="Predikat Sangat Baik (A)"
        />
      </div>

      {/* Two Columns: Urgent Tasks & New Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tugas dengan Tenggat Terdekat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tugas Siswa Terjadwal</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Selesaikan sebelum batas waktu pengumpulan berakhir</p>
            </div>
            <Link href="/siswa/tugas" className="text-xs font-semibold text-blue-600 hover:underline">
              Buka Semua
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <Badge variant="indigo" className="mb-1">
                    Matematika Terpadu
                  </Badge>
                  <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Batas: {formatTanggalIndo(asg.due_date)}
                  </p>
                </div>

                <Link href="/siswa/tugas">
                  <Button size="sm">Kirim Tugas</Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Materi Pembelajaran Terkini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Materi Pelajaran Terbaru</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Modul pembelajaran yang diterbitkan oleh bapak/ibu guru</p>
            </div>
            <Link href="/siswa/materi" className="text-xs font-semibold text-blue-600 hover:underline">
              Buka Materi
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {materials.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {m.description}
                  </p>
                </div>

                <Link href="/siswa/materi">
                  <Button size="sm" variant="outline">
                    Pelajari
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

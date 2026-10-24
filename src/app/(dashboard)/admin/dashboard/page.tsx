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
  Users,
  GraduationCap,
  BookOpen,
  CheckSquare,
  FileText,
  Bell,
  ArrowRight,
  TrendingUp,
  UserPlus,
  PlusCircle,
  Megaphone,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalSiswa: 0,
    totalGuru: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalMaterials: 0,
    totalAssignments: 0,
    totalExams: 0,
  });

  const [announcements, setAnnouncements] = React.useState(DataRepository.getAnnouncements());
  const [submissions, setSubmissions] = React.useState(DataRepository.getSubmissions());

  React.useEffect(() => {
    const profiles = DataRepository.getProfiles();
    const classes = DataRepository.getClasses();
    const subjects = DataRepository.getSubjects();
    const materials = DataRepository.getMaterials();
    const assignments = DataRepository.getAssignments();
    const exams = DataRepository.getExams();

    setStats({
      totalUsers: profiles.length,
      totalSiswa: profiles.filter((p) => p.role === "siswa").length,
      totalGuru: profiles.filter((p) => p.role === "guru").length,
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      totalMaterials: materials.length,
      totalAssignments: assignments.length,
      totalExams: exams.length,
    });

    setAnnouncements(DataRepository.getAnnouncements());
    setSubmissions(DataRepository.getSubmissions());
  }, []);

  return (
    <DashboardShell
      title="Dashboard Administrator Sekolah"
      subtitle="Ringkasan eksekutif statistik akademik dan operasional LMS terintegrasi"
    >
      {/* Top Banner Announcement Alert */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/80 text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tahun Ajaran 2026/2027 • Semester Ganjil
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/60">
              Kurikulum Merdeka
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Pusat Kendali Akademik Sekolah
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Kelola operasional rombongan belajar, data pendidik & peserta didik, distribusi modul pembelajaran, serta evaluasi ujian CBT terpusat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/admin/pengguna">
            <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-xs">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Tambah Pengguna
            </Button>
          </Link>
          <Link href="/admin/pengumuman">
            <Button variant="outline" size="sm" className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white">
              <Megaphone className="w-3.5 h-3.5 mr-1.5" />
              Buat Pengumuman
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Siswa"
          value={stats.totalSiswa}
          icon={Users}
          variant="blue"
          description="Terdaftar aktif"
        />
        <StatCard
          title="Dewan Guru"
          value={stats.totalGuru}
          icon={GraduationCap}
          variant="emerald"
          description="Pengampu mapel"
        />
        <StatCard
          title="Rombel / Kelas"
          value={stats.totalClasses}
          icon={BookOpen}
          variant="purple"
          description="Kelas aktif"
        />
        <StatCard
          title="Mata Pelajaran"
          value={stats.totalSubjects}
          icon={CheckSquare}
          variant="amber"
          description="Kurikulum terpadu"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Materi Pembelajaran</p>
              <h4 className="text-lg font-bold text-slate-900">{stats.totalMaterials} Modul Terbit</h4>
            </div>
          </div>
          <Link href="/admin/kelas">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Button>
          </Link>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Tugas Terjadwal</p>
              <h4 className="text-lg font-bold text-slate-900">{stats.totalAssignments} Tugas Siswa</h4>
            </div>
          </div>
          <Link href="/admin/kelas">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Button>
          </Link>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Ujian Online / PTS</p>
              <h4 className="text-lg font-bold text-slate-900">{stats.totalExams} Bank Ujian</h4>
            </div>
          </div>
          <Link href="/admin/kelas">
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Two Column Grid: Latest Submissions & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitas Pengumpulan Tugas Terkini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Aktivitas Pengumpulan Tugas</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Pengumpulan jawaban siswa terkini yang masuk ke sistem</p>
            </div>
            <Link href="/admin/kelas" className="text-xs font-semibold text-blue-600 hover:underline">
              Lihat Semua
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Tugas Matriks Ordo 2x2
                    </p>
                    <Badge variant={sub.status === "graded" ? "success" : "warning"}>
                      {sub.status === "graded" ? `Dinilai (${sub.score})` : "Menunggu Koreksi"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dikumpulkan: {formatTanggalIndo(sub.submitted_at)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    Nilai: {sub.score || "-"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pengumuman Sekolah Terkini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pengumuman Sekolah</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Informasi resmi yang disiarkan kepada warga sekolah</p>
            </div>
            <Link href="/admin/pengumuman">
              <Button variant="outline" size="sm">
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                Buat Baru
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {ann.title}
                  </h4>
                  <Badge variant={ann.priority === "urgent" ? "destructive" : "indigo"}>
                    {ann.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Sasaran: {ann.target_role === "all" ? "Semua Warga Sekolah" : ann.target_role}</span>
                  <span>{formatTanggalIndo(ann.published_at, false)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Calendar,
  Bell,
  Award,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  UserCheck,
  Sliders,
  ExternalLink,
  Laptop,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { UserRole } from "@/types/database";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState(DataRepository.getCurrentUser());
  const [activePreviewTab, setActivePreviewTab] = React.useState<"siswa" | "guru" | "admin">("siswa");
  const school = DataRepository.getSchool();
  const announcements = DataRepository.getAnnouncements().slice(0, 3);
  const events = DataRepository.getEvents().slice(0, 3);

  const handleRoleSelect = (role: UserRole) => {
    const user = DataRepository.loginAsRole(role);
    setCurrentUser(user);
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "guru") router.push("/guru/dashboard");
    else if (role === "siswa") router.push("/siswa/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Notification / Context Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-white">Lingkungan Percontohan Mandiri:</span>
            <span>Seluruh data sekolah, nama pengajar, dan siswa di sistem ini bersifat anonim / fiktif.</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Tahun Ajaran 2026/2027 • Semester Ganjil</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-slate-300 font-mono">NPSN: {school.npsn}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black group-hover:bg-blue-600 transition-colors shadow-2xs">
              <School className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                {school.name}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                LMS Terpadu • Sistem Belajar Mandiri
              </span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#simulasi-peran" className="hover:text-slate-900 transition-colors">
              Simulasi Peran
            </a>
            <a href="#pratinjau" className="hover:text-slate-900 transition-colors">
              Live Preview
            </a>
            <a href="#fitur" className="hover:text-slate-900 transition-colors">
              Modul Sistem
            </a>
            <a href="#agenda-pengumuman" className="hover:text-slate-900 transition-colors">
              Agenda & Berita
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-slate-300 text-slate-700 hover:bg-slate-100">
                Masuk Akun
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => handleRoleSelect(currentUser.role)}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-2xs font-semibold"
            >
              Buka Dashboard
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-6">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Platform Pembelajaran Digital • Portofolio Sistem Informasi Sekolah</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Pusat Manajemen Pembelajaran, Evaluasi CBT & Administrasi Akademik
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Dirancang mandiri untuk menyatukan alur kerja sekolah secara terstruktur. Lengkap dengan modul bahan ajar digital, pengumpulan tugas siswa, evaluasi ujian CBT bebas bias, dan pembukuan nilai berbasis standar KKM.
            </p>

            {/* Call To Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#simulasi-peran">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs px-6">
                  Coba Akses Langsung
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#pratinjau">
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-6">
                  <Laptop className="w-4 h-4 mr-2 text-slate-500" />
                  Lihat Pratinjau Ruang Kerja
                </Button>
              </a>
            </div>
          </div>

          {/* Role Gateway Cards Section */}
          <div id="simulasi-peran" className="mt-16 pt-10 border-t border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">
                Pilih Akses Pengguna (Simulasi Peran Langsung)
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                Tanpa perlu registrasi ulang. Klik salah satu portal di bawah untuk langsung mencoba ruang kerja sesuai peran hak akses masing-masing:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {/* Admin Portal Gateway */}
              <div
                onClick={() => handleRoleSelect("admin")}
                className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      Hak Akses Penuh
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Portal Administrator
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Kelola data pokok sekolah, rombongan belajar (kelas), pembagian mata pelajaran, plot dewan guru, dan pengumuman instansi.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  <span>Masuk Sebagai Admin</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Guru Portal Gateway */}
              <div
                onClick={() => handleRoleSelect("guru")}
                className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
                      Tenaga Pendidik
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Portal Guru Pengampu
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Terbitkan modul materi dan video ajar, buat tugas digital berbatas waktu, periksa pengumpulan siswa, dan susun bank soal CBT.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>Masuk Sebagai Guru</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Siswa Portal Gateway */}
              <div
                onClick={() => handleRoleSelect("siswa")}
                className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider">
                      Peserta Didik
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Portal Siswa Mandiri
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Pelajari modul pelajaran, unggah berkas tugas online, ikuti ujian CBT dengan timer otomatis, dan periksa rekapitulasi nilai rapor.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  <span>Masuk Sebagai Siswa</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Workspace Preview Section */}
      <section id="pratinjau" className="py-20 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Eksplorasi Antarmuka
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Simulasi Ruang Kerja Langsung (Live Workspace Preview)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Pilih tab di samping untuk melihat pratinjau nyata antarmuka setiap peran sebelum membuka dashboard lengkap:
              </p>
            </div>

            {/* Tab Switchers */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
              <button
                onClick={() => setActivePreviewTab("siswa")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activePreviewTab === "siswa"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Pratinjau Siswa
              </button>
              <button
                onClick={() => setActivePreviewTab("guru")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activePreviewTab === "guru"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Pratinjau Guru
              </button>
              <button
                onClick={() => setActivePreviewTab("admin")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activePreviewTab === "admin"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Pratinjau Admin
              </button>
            </div>
          </div>

          {/* Mock Browser/Workspace Window */}
          <div className="rounded-2xl bg-white border border-slate-300 shadow-sm overflow-hidden">
            {/* Window Topbar */}
            <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  lms.cendekianusantara.sch.id/{activePreviewTab}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sesi Aktif
                </span>
              </div>
            </div>

            {/* Workspace Inner Content */}
            <div className="p-6 bg-slate-50">
              {activePreviewTab === "siswa" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">Ahmad Fauzi Ramadhan</span>
                        <Badge variant="default" className="text-[10px]">Kelas X-1 (MIPA Unggulan)</Badge>
                      </div>
                      <p className="text-xs text-slate-500">NISN: 0078129481 • Status: Aktif Mengikuti 6 Mata Pelajaran</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRoleSelect("siswa")}
                      className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 font-semibold"
                    >
                      Buka Dashboard Siswa
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Item 1 */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-blue-700">Tugas Terdekat</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Hari Ini, 23:59</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Laporan Praktikum Kinematika</h4>
                      <p className="text-xs text-slate-500 mt-1">Fisika Dasar • Bpk. Hendra Wijaya</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>Format: PDF / Word</span>
                        <span className="font-semibold text-blue-600">Unggah Berkas →</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-emerald-700">Ujian Online CBT</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Terjadwal</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">PTS Matematika Wajib Semester 1</h4>
                      <p className="text-xs text-slate-500 mt-1">40 Soal PG • Durasi 90 Menit</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>Anti-Cheat Aktif</span>
                        <span className="font-semibold text-emerald-700">Mulai Simulasi →</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-purple-700">Rapor & Nilai</span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">KKM: 75.0</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Nilai Rata-Rata Saat Ini: 94.0</h4>
                      <p className="text-xs text-slate-500 mt-1">Predikat A (Sangat Baik) • 4 Tugas Dinilai</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>Transkrip Digital</span>
                        <span className="font-semibold text-purple-700">Lihat Rincian →</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "guru" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">Budi Santoso, S.Pd., M.Mat.</span>
                        <Badge variant="success" className="text-[10px]">Guru Pengampu Matematika</Badge>
                      </div>
                      <p className="text-xs text-slate-500">NIP: 198503142009031004 • Wali Kelas X-1 • Total 69 Siswa</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRoleSelect("guru")}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 font-semibold"
                    >
                      Buka Dashboard Guru
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-emerald-700">Antrean Penilaian</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">12 Tugas Masuk</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Tugas 2: Sistem Persamaan Linear Tiga Variabel</h4>
                      <p className="text-xs text-slate-500 mt-1">Kelas X-1 • Menunggu penilaian guru</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                        <span>Buka Lembar Penilaian</span>
                        <span>→</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-blue-700">Bank Modul Pembelajaran</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">4 Modul Terbit</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Modul 4: Vektor dan Transformasi Geometri</h4>
                      <p className="text-xs text-slate-500 mt-1">Disertai rangkuman PDF dan link video YouTube</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                        <span>Kelola Materi Belajar</span>
                        <span>→</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-purple-700">Jadwal Tatap Muka</span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Hari Ini</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Jam Ke 3-4 di Ruang Kelas X-1</h4>
                      <p className="text-xs text-slate-500 mt-1">Pukul 09.00 - 10.30 WIB (90 Menit)</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
                        <span>Lihat Jadwal Mingguan</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "admin" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">Dr. H. Raden Permadi, M.Pd.</span>
                        <Badge variant="secondary" className="text-[10px]">Administrator Sistem Akademik</Badge>
                      </div>
                      <p className="text-xs text-slate-500">NIP: 197805122002121001 • Pengelola Seluruh Rombel & Pengguna Sekolah</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRoleSelect("admin")}
                      className="bg-slate-900 hover:bg-slate-800 text-white shrink-0 font-semibold"
                    >
                      Buka Dashboard Admin
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-700">Kapasitas Rombel</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Optimal</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Kelas X-1, X-2, XI-IPA, XII-MIPA</h4>
                      <p className="text-xs text-slate-500 mt-1">Total 69 siswa aktif terdaftar pada rombel aktif</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>Kelola Kelas & Rombel</span>
                        <span>→</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-700">Manajemen Akun</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Multi-Peran</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Audit Guru, Siswa & Operator</h4>
                      <p className="text-xs text-slate-500 mt-1">Dilengkapi reset password mandiri dan pemetaan role</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>Direktori Pengguna</span>
                        <span>→</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-700">Edaran Informasi</span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">3 Terbit</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Siaran Pengumuman Terpusat</h4>
                      <p className="text-xs text-slate-500 mt-1">Target siaran: Seluruh Sekolah, Khusus Guru, atau Siswa</p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>Buat Pengumuman Baru</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Structured Core Modules Section */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Kemampuan Arsitektur Sistem
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Modul Fungsional Sesuai Praktik Nyata Sekolah
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Seluruh fungsionalitas dirancang berdasarkan kebutuhan operasional kurikulum dan kegiatan belajar mengajar harian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pusat Modul & Bahan Ajar Digital</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Guru dapat mengunggah rangkuman materi teks lengkap, menyematkan video pembelajaran interaktif, serta melampirkan berkas penunjang (PDF/dokumen) secara rapi per mata pelajaran.
              </p>
            </div>

            {/* 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Penugasan & Pengumpulan Berkas</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tenggat waktu terprogram otomatis dengan indikator sisa waktu, batasan format unggah berkas, dan lembar koreksi nilai langsung bagi guru dengan feedback catatan revisi.
              </p>
            </div>

            {/* 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Ujian Online CBT Terstandar</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Simulasi asesmen daring dengan timer hitung mundur, pengacakan nomor soal, kunci lembar jawaban saat waktu habis, dan kalkulasi nilai seketika tanpa rekap manual.
              </p>
            </div>

            {/* 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Buku Nilai & Rekapitulasi Rapor</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pencatatan akumulasi nilai tugas dan ulangan secara transparan. Perbandingan otomatis dengan KKM mata pelajaran dan kalkulasi predikat capaian belajar.
              </p>
            </div>

            {/* 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Penjadwalan Rombel & Kalender</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pemetaan jadwal tatap muka mingguan antar ruang kelas dan guru pengampu, kalender libur semester, agenda Penilaian Tengah Semester (PTS), serta Asesmen Akhir.
              </p>
            </div>

            {/* 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Partisi Hak Akses Pengguna</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pemisahan hak akses ketat antara Administrator, Guru, dan Siswa. Siswa tidak memiliki akses ke lembar koreksi atau soal ujian sebelum jadwal dibuka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements and Calendar Section */}
      <section id="agenda-pengumuman" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Pengumuman Terkini */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Pengumuman Akademik</h3>
                    <p className="text-xs text-slate-500">Pemberitahuan resmi dari pihak sekolah</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                        {item.target_role === "all" ? "Semua Warga Sekolah" : `Khusus ${item.target_role.toUpperCase()}`}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(item.published_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda Akademik */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Agenda Kalender Sekolah</h3>
                    <p className="text-xs text-slate-500">Rencana kegiatan semester berjalan</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4"
                  >
                    <div className="w-13 h-13 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {new Date(evt.start_time).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                      <span className="text-lg font-black leading-none mt-0.5 font-mono">
                        {new Date(evt.start_time).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{evt.title}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-2 shrink-0">
                          {evt.event_type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed truncate">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <School className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-extrabold tracking-tight">{school.name}</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {school.address} • Kontak: {school.phone} • Email: {school.email}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Akreditasi A
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Kurikulum Merdeka
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  NPSN: {school.npsn}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed max-w-md">
                *Catatan: Seluruh data institusi, pendidik, dan siswa yang tercantum dalam platform ini merupakan data percontohan (fiktif/anonim) untuk keperluan simulasi pembelajaran mandiri.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Akses Langsung Portal
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleRoleSelect("admin")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Dashboard Administrator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleSelect("guru")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Dashboard Guru Pengampu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleSelect("siswa")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Dashboard Siswa
                  </button>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Halaman Masuk Akun
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Fondasi Teknologi
              </h4>
              <ul className="space-y-2 text-xs">
                <li>Next.js App Router (React Server/Client)</li>
                <li>TypeScript & Tailwind CSS Design System</li>
                <li>Local Repository Persistence with Sync</li>
                <li>Supabase & PostgreSql Cloud Compatible</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 {school.name}. Platform Sistem Pembelajaran Mandiri.</p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Simulasi Lingkungan Terpadu • Bersih & Tanpa Data Riil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

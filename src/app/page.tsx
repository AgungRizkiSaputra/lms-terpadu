"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School,
  Sparkles,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { UserRole } from "@/types/database";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState(DataRepository.getCurrentUser());
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
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                {school.name}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LMS Terpadu ({school.level}) • NPSN: {school.npsn}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur LMS
            </a>
            <a href="#demo-role" className="hover:text-blue-600 transition-colors">
              Pilihan Peran
            </a>
            <a href="#pengumuman" className="hover:text-blue-600 transition-colors">
              Pengumuman
            </a>
            <a href="#agenda" className="hover:text-blue-600 transition-colors">
              Agenda
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Masuk Akun
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => handleRoleSelect(currentUser.role)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25"
            >
              Buka Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-bold mb-6 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Learning Management System Generasi Baru • Next.js & Supabase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Platform Pembelajaran Digital Sekolah Modern, Aman & Interaktif
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Menghubungkan manajemen sekolah, guru berdedikasi, dan siswa dalam satu ekosistem terpadu. Lengkap dengan materi pembelajaran digital, tugas online, ujian CBT interaktif, dan kartu hasil studi.
          </p>

          {/* Quick Demo Preview Cards */}
          <div id="demo-role" className="mt-12 max-w-4xl mx-auto">
            <div className="p-1 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60">
              <div className="p-4 sm:p-6 bg-slate-50/80 rounded-[22px] border border-slate-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 text-left">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      Pratinjau Langsung Berdasarkan Peran (Live Role Preview)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Klik salah satu tombol peran di bawah untuk langsung mencoba tampilan dan fitur aslinya:
                    </p>
                  </div>
                  <Badge variant="success" className="px-3 py-1 text-xs">
                    Mode Interaktif Siap
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Admin Card */}
                  <div
                    onClick={() => handleRoleSelect("admin")}
                    className="p-5 rounded-2xl bg-white border-2 border-purple-200/80 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer text-left group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        Portal Administrator
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Kelola data guru, siswa, kelas, mata pelajaran, kurikulum & pengaturan sekolah.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                      <span>Buka Sebagai Admin</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Guru Card */}
                  <div
                    onClick={() => handleRoleSelect("guru")}
                    className="p-5 rounded-2xl bg-white border-2 border-emerald-200/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer text-left group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Portal Guru Pengampu
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Unggah materi modul, buat tugas siswa, koreksi & penilaian, dan kelola ujian CBT.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>Buka Sebagai Guru</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Siswa Card */}
                  <div
                    onClick={() => handleRoleSelect("siswa")}
                    className="p-5 rounded-2xl bg-white border-2 border-blue-200/80 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer text-left group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Portal Siswa
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Baca materi, kumpulkan tugas online, ikuti ujian digital real-time & cek rapor.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                      <span>Buka Sebagai Siswa</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-extrabold text-blue-600">450+</span>
              <span className="text-xs font-semibold text-slate-500">Siswa Aktif</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-extrabold text-emerald-600">42</span>
              <span className="text-xs font-semibold text-slate-500">Guru Profesional</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-extrabold text-purple-600">18</span>
              <span className="text-xs font-semibold text-slate-500">Mata Pelajaran</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="block text-2xl font-extrabold text-amber-600">98%</span>
              <span className="text-xs font-semibold text-slate-500">Tingkat Kelulusan KKM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="indigo" className="mb-3 px-3 py-1">
              Modul Terintegrasi
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Fitur Lengkap Dirancang untuk Kebutuhan Sekolah Nyata
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Mulai dari perencanaan kurikulum, distribusi modul ajar digital, pengumpulan tugas siswa, hingga evaluasi ujian CBT berbobot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Manajemen Materi Pembelajaran</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Guru dapat mengunggah rangkuman modul teks lengkap, menyematkan video pembelajaran interaktif, serta berkas lampiran pendukung dalam satu tempat yang rapi.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Penugasan & Pengumpulan Digital</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tenggat waktu otomatis, upload berkas tugas siswa dengan kuota terkelola, serta panel koreksi dan pemberian nilai langsung dari guru ke siswa.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Ujian Online CBT Interaktif</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Simulasi ujian daring dengan timer hitung mundur, soal pilihan ganda acak, pencegah kecurangan, dan kalkulasi nilai otomatis seketika.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Buku Nilai & Rapor Digital</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pencatatan nilai tugas dan ujian yang transparan, perbandingan otomatis terhadap KKM sekolah, serta rekapan nilai akhir siswa per semester.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Jadwal Kelas & Kalender Sekolah</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Jadwal harian pelajaran per ruang kelas, agenda kegiatan sekolah, tanggal ujian semester, dan libur resmi nasional.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Keamanan Supabase Auth & RLS</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Row Level Security (RLS) PostgreSQL melindungi data privat setiap siswa dan guru. Tidak ada kebocoran nilai atau berkas antar pengguna yang tidak berhak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pengumuman & Agenda Section */}
      <section id="pengumuman" className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Pengumuman */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pengumuman Terkini</h3>
                    <p className="text-xs text-slate-500">Informasi resmi dari pihak akademik sekolah</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {item.target_role === "all" ? "Semua Warga Sekolah" : item.target_role.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">
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

            {/* Agenda & Kalender */}
            <div id="agenda">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Agenda Akademik</h3>
                    <p className="text-xs text-slate-500">Jadwal kegiatan semester berjalan</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-black uppercase">
                        {new Date(evt.start_time).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                      <span className="text-base font-extrabold leading-none">
                        {new Date(evt.start_time).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-2">
                          {evt.event_type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <School className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-black">{school.name}</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {school.address} • Telp: {school.phone} • Email: {school.email}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="indigo" className="bg-blue-900/60 text-blue-300 border-blue-700/50">
                  Akreditasi A
                </Badge>
                <Badge variant="success" className="bg-emerald-900/60 text-emerald-300 border-emerald-700/50">
                  Kurikulum Merdeka
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Akses Langsung LMS
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleRoleSelect("admin")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Dashboard Administrator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleSelect("guru")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Dashboard Guru Pengampu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleRoleSelect("siswa")}
                    className="hover:text-white transition-colors cursor-pointer"
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
                Teknologi & Keamanan
              </h4>
              <ul className="space-y-2 text-xs">
                <li>Next.js App Router & TypeScript</li>
                <li>Supabase PostgreSQL & Auth</li>
                <li>Row Level Security (RLS)</li>
                <li>Netlify Cloud Ready</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 {school.name}. Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sistem Pembelajaran Terintegrasi SMP / SMA / SMK
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

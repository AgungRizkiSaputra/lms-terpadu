"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { ClassSchedule, ClassRoom, Subject, Profile } from "@/types/database";
import {
  CalendarDays,
  PlusCircle,
  Search,
  Clock,
  UserCheck,
  BookOpen,
  GraduationCap,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react";

const DAYS = [
  { id: 1, name: "Senin" },
  { id: 2, name: "Selasa" },
  { id: 3, name: "Rabu" },
  { id: 4, name: "Kamis" },
  { id: 5, name: "Jumat" },
  { id: 6, name: "Sabtu" },
];

export default function AdminJadwalPage() {
  const [schedules, setSchedules] = React.useState<ClassSchedule[]>([]);
  const [classes, setClasses] = React.useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);

  // Filter states
  const [dayFilter, setDayFilter] = React.useState<string>("all");
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<ClassSchedule | null>(null);

  // Form states
  const [formClassId, setFormClassId] = React.useState("");
  const [formSubjectId, setFormSubjectId] = React.useState("");
  const [formTeacherId, setFormTeacherId] = React.useState("");
  const [formDay, setFormDay] = React.useState<number>(1);
  const [formStartTime, setFormStartTime] = React.useState("07:30");
  const [formEndTime, setFormEndTime] = React.useState("09:00");
  const [formRoom, setFormRoom] = React.useState("Ruang 101");
  const [formStatus, setFormStatus] = React.useState<"aktif" | "libur" | "pengganti">("aktif");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setSchedules(DataRepository.getSchedules());
    setClasses(DataRepository.getClasses());
    setSubjects(DataRepository.getSubjects());
    setProfiles(DataRepository.getProfiles());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const teachers = profiles.filter((p) => p.role === "guru");

  const openAddModal = () => {
    setEditingSchedule(null);
    setFormClassId(classes[0]?.id || "");
    setFormSubjectId(subjects[0]?.id || "");
    setFormTeacherId(teachers[0]?.id || "");
    setFormDay(1);
    setFormStartTime("07:30");
    setFormEndTime("09:00");
    setFormRoom("Ruang 101");
    setFormStatus("aktif");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (sched: ClassSchedule) => {
    setEditingSchedule(sched);
    setFormClassId(sched.class_id);
    setFormSubjectId(sched.subject_id);
    setFormTeacherId(sched.teacher_id);
    setFormDay(sched.day_of_week);
    setFormStartTime(sched.start_time);
    setFormEndTime(sched.end_time);
    setFormRoom(sched.room || "Ruang 101");
    setFormStatus(sched.status || "aktif");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClassId || !formSubjectId || !formTeacherId) {
      setFormError("Kelas, mata pelajaran, dan guru pengajar wajib dipilih.");
      return;
    }
    if (!formStartTime || !formEndTime) {
      setFormError("Jam mulai dan jam selesai mengajar wajib diisi.");
      return;
    }

    if (editingSchedule) {
      DataRepository.updateSchedule(editingSchedule.id, {
        class_id: formClassId,
        subject_id: formSubjectId,
        teacher_id: formTeacherId,
        day_of_week: formDay,
        start_time: formStartTime,
        end_time: formEndTime,
        room: formRoom,
        status: formStatus,
      });
    } else {
      DataRepository.addSchedule({
        class_id: formClassId,
        subject_id: formSubjectId,
        teacher_id: formTeacherId,
        day_of_week: formDay,
        start_time: formStartTime,
        end_time: formEndTime,
        room: formRoom,
        status: formStatus,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteSchedule = (sched: ClassSchedule) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal kelas ini?")) {
      DataRepository.deleteSchedule(sched.id);
      loadData();
    }
  };

  const getDayName = (dayNum: number): string => {
    const found = DAYS.find((d) => d.id === dayNum);
    return found ? found.name : "Senin";
  };

  const getClassName = (clsId: string): string => {
    return classes.find((c) => c.id === clsId)?.name || "Kelas";
  };

  const getSubjectName = (sbjId: string): string => {
    return subjects.find((s) => s.id === sbjId)?.name || "Mata Pelajaran";
  };

  const getSubjectCode = (sbjId: string): string => {
    return subjects.find((s) => s.id === sbjId)?.code || "MAPEL";
  };

  const getTeacherName = (tId: string): string => {
    return profiles.find((p) => p.id === tId)?.full_name || "Guru Pengajar";
  };

  // Filtered schedules
  const filtered = schedules.filter((s) => {
    const matchDay = dayFilter === "all" || s.day_of_week.toString() === dayFilter;
    const matchClass = classFilter === "all" || s.class_id === classFilter;
    const subjName = getSubjectName(s.subject_id).toLowerCase();
    const tName = getTeacherName(s.teacher_id).toLowerCase();
    const cName = getClassName(s.class_id).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchQuery =
      !query ||
      subjName.includes(query) ||
      tName.includes(query) ||
      cName.includes(query) ||
      (s.room && s.room.toLowerCase().includes(query));

    return matchDay && matchClass && matchQuery;
  });

  return (
    <DashboardShell
      title="Manajemen Jadwal Kelas"
      subtitle="Atur jam mengajar, hari pembelajaran, mata pelajaran, guru pengampu, serta status aktif ruang kelas"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Jadwal Mata Pelajaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {schedules.length} slot jadwal kelas terkonfigurasi pada semester berjalan
          </p>
        </div>

        <Button onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Tambah Jadwal Baru
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari mapel, nama guru, kelas, atau ruangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Filter Hari */}
          <div className="w-full md:w-auto">
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Hari</option>
              {DAYS.map((d) => (
                <option key={d.id} value={d.id.toString()}>
                  Hari {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kelas */}
          <div className="w-full md:w-auto">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Kelas / Rombel</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {filtered.length} jadwal ditemukan
          </div>
        </div>
      </Card>

      {/* Schedule Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Hari & Jam Ngajar</th>
                <th className="py-3 px-4">Kelas / Rombel</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Guru Pengampu</th>
                <th className="py-3 px-4">Ruang Kelas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CalendarDays className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                    <p className="font-semibold">Tidak ada jadwal yang sesuai filter</p>
                    <p className="text-[11px] mt-1">Coba sesuaikan pilihan hari atau rombel</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sched) => (
                  <tr key={sched.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Hari & Jam */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {getDayName(sched.day_of_week)}
                        </span>
                        <span className="text-xs font-semibold text-blue-700 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {sched.start_time} - {sched.end_time}
                        </span>
                      </div>
                    </td>

                    {/* Kelas */}
                    <td className="py-3 px-4">
                      <Badge variant="indigo" className="font-semibold">
                        {getClassName(sched.class_id)}
                      </Badge>
                    </td>

                    {/* Mapel */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {getSubjectCode(sched.subject_id)}
                        </span>
                        <span className="font-bold text-slate-900">
                          {getSubjectName(sched.subject_id)}
                        </span>
                      </div>
                    </td>

                    {/* Guru */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{getTeacherName(sched.teacher_id)}</span>
                      </div>
                    </td>

                    {/* Ruang */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {sched.room || "Ruang 101"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {sched.status === "libur" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                          Libur
                        </span>
                      ) : sched.status === "pengganti" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Pengganti
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Aktif
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(sched)}
                          title="Edit Jadwal"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSchedule(sched)}
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Schedule Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? "Edit Jadwal Pelajaran" : "Tambah Jadwal Pelajaran Baru"}
        description="Lengkapi alokasi kelas, mata pelajaran, guru pengampu, dan waktu tatap muka."
      >
        <form onSubmit={handleSaveSchedule} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Pilih Hari Belajar
              </label>
              <select
                value={formDay}
                onChange={(e) => setFormDay(parseInt(e.target.value) || 1)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {DAYS.map((d) => (
                  <option key={d.id} value={d.id}>
                    Hari {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Kelas / Rombel
              </label>
              <select
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Tingkat {c.grade_level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Mata Pelajaran
            </label>
            <select
              value={formSubjectId}
              onChange={(e) => setFormSubjectId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code} - {s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Guru Pengajar
            </label>
            <select
              value={formTeacherId}
              onChange={(e) => setFormTeacherId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.nip_nisn || "Guru Pengampu"})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jam Mulai"
              type="time"
              value={formStartTime}
              onChange={(e) => setFormStartTime(e.target.value)}
              required
            />
            <Input
              label="Jam Selesai"
              type="time"
              value={formEndTime}
              onChange={(e) => setFormEndTime(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ruang Kelas / Lab"
              placeholder="Contoh: Ruang 101, Lab Komputer"
              value={formRoom}
              onChange={(e) => setFormRoom(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Status Jadwal
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "aktif" | "libur" | "pengganti")}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="aktif">Aktif Terjadwal</option>
                <option value="pengganti">Kelas Pengganti</option>
                <option value="libur">Diliburkan</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editingSchedule ? "Simpan Perubahan" : "Simpan Jadwal"}
            </Button>
          </div>
        </form>
      </Dialog>
    </DashboardShell>
  );
}

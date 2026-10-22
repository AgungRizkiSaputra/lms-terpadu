"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { ClassRoom, Profile } from "@/types/database";
import {
  GraduationCap,
  PlusCircle,
  Users,
  Search,
  BookOpen,
  UserCheck,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AdminKelasPage() {
  const [classes, setClasses] = React.useState<ClassRoom[]>([]);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<ClassRoom | null>(null);
  const [viewingStudentsClass, setViewingStudentsClass] = React.useState<ClassRoom | null>(null);

  // Form states
  const [className, setClassName] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("X");
  const [capacity, setCapacity] = React.useState("36");
  const [homeroomTeacherId, setHomeroomTeacherId] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setClasses(DataRepository.getClasses());
    setProfiles(DataRepository.getProfiles());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const teachers = profiles.filter((p) => p.role === "guru");
  const students = profiles.filter((p) => p.role === "siswa");

  const openAddModal = () => {
    setEditingClass(null);
    setClassName("");
    setGradeLevel("X");
    setCapacity("36");
    setHomeroomTeacherId("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setClassName(cls.name);
    setGradeLevel(cls.grade_level);
    setCapacity(cls.capacity.toString());
    setHomeroomTeacherId(cls.homeroom_teacher_id || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      setFormError("Nama rombel kelas wajib diisi.");
      return;
    }

    if (editingClass) {
      DataRepository.updateClass(editingClass.id, {
        name: className,
        grade_level: gradeLevel,
        capacity: parseInt(capacity) || 36,
        homeroom_teacher_id: homeroomTeacherId || null,
      });
    } else {
      DataRepository.addClass({
        name: className,
        grade_level: gradeLevel,
        capacity: parseInt(capacity) || 36,
        homeroom_teacher_id: homeroomTeacherId || null,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteClass = (cls: ClassRoom) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${cls.name}"? Data rombel ini akan dihapus.`)) {
      DataRepository.deleteClass(cls.id);
      loadData();
    }
  };

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.grade_level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell
      title="Manajemen Kelas & Rombel"
      subtitle="Pengorganisasian rombongan belajar peserta didik beserta alokasi wali kelas dan kapasitas"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rombongan Belajar (Rombel)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {classes.length} rombel aktif pada tahun ajaran berjalan
          </p>
        </div>

        <Button onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Tambah Kelas Baru
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama rombel atau tingkat (contoh: X-1, VII-A)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cls) => {
          const homeroom = profiles.find((p) => p.id === cls.homeroom_teacher_id);
          return (
            <Card key={cls.id} className="hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Badge variant="indigo" className="font-bold">
                    Tingkat {cls.grade_level}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    Kapasitas: {cls.capacity} Siswa
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Wali Kelas:{" "}
                        <b className="text-slate-800">
                          {homeroom ? homeroom.full_name : "Belum ditentukan"}
                        </b>
                      </span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Siswa Terdaftar:
                    </span>
                    <span className="font-bold text-slate-800">
                      {cls.total_students || 34} / {cls.capacity}
                    </span>
                  </div>
                </CardContent>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingStudentsClass(cls)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Lihat Siswa
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(cls)}
                    title="Edit Kelas"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClass(cls)}
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Class Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? "Edit Data Rombel Kelas" : "Tambah Rombel Kelas Baru"}
        description="Atur nama rombel, tingkat kelas, kapasitas, dan alokasi wali kelas."
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <Input
            label="Nama Kelas / Rombel"
            placeholder="Contoh: X-1 (MIPA Unggulan), VII-B, XII RPL 1"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Tingkat / Grade
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="VII">VII (SMP)</option>
                <option value="VIII">VIII (SMP)</option>
                <option value="IX">IX (SMP)</option>
                <option value="X">X (SMA/SMK)</option>
                <option value="XI">XI (SMA/SMK)</option>
                <option value="XII">XII (SMA/SMK)</option>
              </select>
            </div>

            <Input
              label="Kapasitas Siswa"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="36"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Wali Kelas (Dewan Guru)
            </label>
            <select
              value={homeroomTeacherId}
              onChange={(e) => setHomeroomTeacherId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">-- Pilih Guru Sebagai Wali Kelas --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.nip_nisn || "Guru"})
                </option>
              ))}
            </select>
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
              {editingClass ? "Simpan Perubahan" : "Simpan Kelas"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* View Students in Class Modal */}
      {viewingStudentsClass && (
        <Dialog
          isOpen={true}
          onClose={() => setViewingStudentsClass(null)}
          title={`Daftar Peserta Didik — ${viewingStudentsClass.name}`}
          description={`Kapasitas: ${viewingStudentsClass.capacity} Siswa • Tingkat: ${viewingStudentsClass.grade_level}`}
          className="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900">
                Wali Kelas:{" "}
                {profiles.find((p) => p.id === viewingStudentsClass.homeroom_teacher_id)?.full_name ||
                  "Belum ditentukan"}
              </span>
              <Badge variant="indigo">{students.length} Siswa Terdaftar</Badge>
            </div>

            <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {students.map((st, idx) => (
                <div key={st.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-slate-400">
                      {idx + 1}
                    </span>
                    {st.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={st.avatar_url}
                        alt={st.full_name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {st.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{st.full_name}</p>
                      <p className="text-[11px] text-slate-500">NISN: {st.nip_nisn || "-"} • {st.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    Aktif
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingStudentsClass(null)}>Tutup</Button>
            </div>
          </div>
        </Dialog>
      )}
    </DashboardShell>
  );
}

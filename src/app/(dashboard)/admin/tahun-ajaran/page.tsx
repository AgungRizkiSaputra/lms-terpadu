"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { AcademicYear } from "@/types/database";
import {
  Calendar,
  PlusCircle,
  CheckCircle,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatTanggalIndo } from "@/lib/utils";

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(`lms_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`lms_${key}`, JSON.stringify(value));
  } catch {}
}

export default function AdminTahunAjaranPage() {
  const [academicYears, setAcademicYears] = React.useState<AcademicYear[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingYear, setEditingYear] = React.useState<AcademicYear | null>(null);

  // Form fields
  const [formName, setFormName] = React.useState("");
  const [formSemester, setFormSemester] = React.useState<"Ganjil" | "Genap">("Ganjil");
  const [formStartDate, setFormStartDate] = React.useState("");
  const [formEndDate, setFormEndDate] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setAcademicYears(DataRepository.getAcademicYears());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingYear(null);
    setFormName("");
    setFormSemester("Ganjil");
    setFormStartDate("");
    setFormEndDate("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (ay: AcademicYear) => {
    setEditingYear(ay);
    setFormName(ay.name);
    setFormSemester(ay.semester);
    setFormStartDate(ay.start_date);
    setFormEndDate(ay.end_date);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formStartDate || !formEndDate) {
      setFormError("Nama tahun ajaran, tanggal mulai, dan tanggal selesai wajib diisi.");
      return;
    }
    if (formEndDate <= formStartDate) {
      setFormError("Tanggal selesai harus lebih besar dari tanggal mulai.");
      return;
    }

    const all = getStorage<AcademicYear[]>("academic_years", DataRepository.getAcademicYears());

    if (editingYear) {
      const idx = all.findIndex((ay) => ay.id === editingYear.id);
      if (idx !== -1) {
        all[idx] = {
          ...all[idx],
          name: formName,
          semester: formSemester,
          start_date: formStartDate,
          end_date: formEndDate,
        };
        setStorage("academic_years", all);
      }
    } else {
      const newAY: AcademicYear = {
        id: "ay-" + Date.now(),
        school_id: "11111111-1111-1111-1111-111111111111",
        name: formName,
        semester: formSemester,
        start_date: formStartDate,
        end_date: formEndDate,
        is_active: false,
        created_at: new Date().toISOString(),
      };
      all.unshift(newAY);
      setStorage("academic_years", all);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleActivate = (id: string) => {
    const all = getStorage<AcademicYear[]>("academic_years", DataRepository.getAcademicYears());
    const updated = all.map((ay) => ({ ...ay, is_active: ay.id === id }));
    setStorage("academic_years", updated);
    loadData();
  };

  const handleDelete = (id: string, name: string) => {
    const all = getStorage<AcademicYear[]>("academic_years", DataRepository.getAcademicYears());
    const target = all.find((ay) => ay.id === id);
    if (target?.is_active) {
      alert("Tidak dapat menghapus tahun ajaran yang sedang aktif.");
      return;
    }
    if (confirm(`Hapus tahun ajaran "${name}"? Data tidak dapat dikembalikan.`)) {
      setStorage("academic_years", all.filter((ay) => ay.id !== id));
      loadData();
    }
  };

  const activeYear = academicYears.find((ay) => ay.is_active);

  return (
    <DashboardShell
      title="Manajemen Tahun Ajaran"
      subtitle="Kelola kalender semester, periode aktif, dan arsip data akademik sekolah"
    >
      {/* Active Year Banner */}
      {activeYear && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Semester Aktif Saat Ini
            </span>
            <h2 className="text-lg font-extrabold">
              Tahun Ajaran {activeYear.name} — Semester {activeYear.semester}
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              {formatTanggalIndo(activeYear.start_date, false)} — {formatTanggalIndo(activeYear.end_date, false)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={openAddModal}
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              Buka Periode Baru
            </Button>
          </div>
        </div>
      )}

      {/* Header Bar (if no active year) */}
      {!activeYear && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Periode Tahun Ajaran</h2>
            <p className="text-xs text-slate-500 mt-0.5">Belum ada semester yang diaktifkan</p>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Buka Periode Baru
          </Button>
        </div>
      )}

      {/* List of Academic Years */}
      <div className="space-y-4">
        {academicYears.length === 0 ? (
          <Card className="p-10 text-center">
            <Calendar className="w-12 h-12 mx-auto text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Belum ada data tahun ajaran</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol &quot;Buka Periode Baru&quot; untuk menambahkan.</p>
          </Card>
        ) : (
          academicYears.map((ay) => (
            <Card key={ay.id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      ay.is_active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        Tahun Ajaran {ay.name}
                      </h3>
                      <Badge variant={ay.is_active ? "success" : "secondary"}>
                        {ay.is_active ? "AKTIF" : "ARSIP"}
                      </Badge>
                      <Badge variant="indigo">Semester {ay.semester}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatTanggalIndo(ay.start_date, false)} s.d.{" "}
                      {formatTanggalIndo(ay.end_date, false)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {ay.is_active ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Sedang Berjalan
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivate(ay.id)}
                    >
                      Jadikan Aktif
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(ay)}
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                  </Button>
                  {!ay.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ay.id, ay.name)}
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingYear ? "Edit Tahun Ajaran" : "Buka Periode Tahun Ajaran Baru"}
        description="Tentukan nama, semester, dan durasi berlakunya periode akademik."
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          <Input
            label="Nama Tahun Ajaran"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contoh: 2026/2027"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Semester</label>
            <select
              value={formSemester}
              onChange={(e) => setFormSemester(e.target.value as "Ganjil" | "Genap")}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="Ganjil">Ganjil (Juli — Desember)</option>
              <option value="Genap">Genap (Januari — Juni)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
              required
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              {editingYear ? "Simpan Perubahan" : "Buat Periode Baru"}
            </Button>
          </div>
        </form>
      </Dialog>
    </DashboardShell>
  );
}

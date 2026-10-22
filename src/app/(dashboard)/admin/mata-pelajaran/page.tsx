"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { Subject } from "@/types/database";
import {
  BookOpen,
  PlusCircle,
  Search,
  Award,
  Edit,
  Trash2,
  Eye,
  Info,
} from "lucide-react";

export default function AdminMataPelajaranPage() {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = React.useState<Subject | null>(null);

  // Form states
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Wajib");
  const [passingGrade, setPassingGrade] = React.useState("75");
  const [description, setDescription] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setSubjects(DataRepository.getSubjects());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSubject(null);
    setCode("");
    setName("");
    setCategory("Wajib");
    setPassingGrade("75");
    setDescription("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: Subject) => {
    setEditingSubject(s);
    setCode(s.code);
    setName(s.name);
    setCategory(s.category);
    setPassingGrade(s.passing_grade.toString());
    setDescription(s.description || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setFormError("Kode dan nama mata pelajaran wajib diisi.");
      return;
    }

    if (editingSubject) {
      DataRepository.updateSubject(editingSubject.id, {
        code: code.toUpperCase(),
        name,
        category,
        passing_grade: parseFloat(passingGrade) || 75,
        description,
      });
    } else {
      DataRepository.addSubject({
        code: code.toUpperCase(),
        name,
        category,
        passing_grade: parseFloat(passingGrade) || 75,
        description,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteSubject = (s: Subject) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${s.name}" (${s.code})? Tindakan ini tidak dapat dibatalkan.`)) {
      DataRepository.deleteSubject(s.id);
      loadData();
    }
  };

  const filtered = subjects.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchQuery && matchCat;
  });

  return (
    <DashboardShell
      title="Manajemen Mata Pelajaran"
      subtitle="Struktur kurikulum nasional dan alokasi mata pelajaran sekolah terintegrasi"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kurikulum Mata Pelajaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {subjects.length} mata pelajaran aktif pada kurikulum sekolah
          </p>
        </div>

        <Button onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Tambah Mapel Baru
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kode atau nama mapel (contoh: MAT-X, Bahasa Indonesia)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Kategori</option>
              <option value="Wajib">Wajib Nasional</option>
              <option value="Peminatan">Peminatan / Jurusan</option>
              <option value="Kejuruan">Kejuruan / Vokasi</option>
              <option value="Muatan Lokal">Muatan Lokal</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <Card key={s.id} className="p-5 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {s.code.split("-")[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {s.code}
                      </span>
                      <Badge variant={s.category === "Wajib" ? "indigo" : "warning"}>
                        {s.category}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{s.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {s.description || "Tidak ada deskripsi kurikulum."}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block font-medium">KKM Minimal</span>
                  <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                    {s.passing_grade}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingSubject(s)}
              >
                <Eye className="w-3.5 h-3.5 mr-1 text-slate-600" />
                Rincian Mapel
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(s)}
                  title="Edit Mata Pelajaran"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSubject(s)}
                  title="Hapus Mata Pelajaran"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Subject Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran Baru"}
        description="Daftarkan atau perbarui kurikulum mata pelajaran sekolah."
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Mapel"
              placeholder="Contoh: MAT-X, BIN-SMP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Kategori Kurikulum
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="Wajib">Wajib Nasional</option>
                <option value="Peminatan">Peminatan / Jurusan</option>
                <option value="Kejuruan">Kejuruan / Vokasi</option>
                <option value="Muatan Lokal">Muatan Lokal</option>
              </select>
            </div>
          </div>

          <Input
            label="Nama Mata Pelajaran"
            placeholder="Contoh: Matematika Terpadu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Kriteria Ketuntasan Minimal (KKM)"
            type="number"
            value={passingGrade}
            onChange={(e) => setPassingGrade(e.target.value)}
            placeholder="75"
            required
          />

          <Textarea
            label="Deskripsi Kurikulum"
            placeholder="Tuliskan cakupan kompetensi dasar mata pelajaran ini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {editingSubject ? "Simpan Perubahan" : "Simpan Mata Pelajaran"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* View Subject Detail Modal */}
      {viewingSubject && (
        <Dialog
          isOpen={true}
          onClose={() => setViewingSubject(null)}
          title={`Detail Mata Pelajaran: ${viewingSubject.name}`}
          description={`Kode: ${viewingSubject.code} • Kategori: ${viewingSubject.category}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {viewingSubject.code}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  KKM Kelulusan: {viewingSubject.passing_grade}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{viewingSubject.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {viewingSubject.description || "Belum ada uraian silabus untuk mata pelajaran ini."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setViewingSubject(null)}>Tutup</Button>
              <Button onClick={() => { const s = viewingSubject; setViewingSubject(null); openEditModal(s); }}>
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit Mapel
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </DashboardShell>
  );
}

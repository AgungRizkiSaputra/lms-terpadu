"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { Announcement } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import { Bell, PlusCircle, Megaphone, CheckCircle } from "lucide-react";

export default function AdminPengumumanPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Form states
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [targetRole, setTargetRole] = React.useState<"all" | "admin" | "guru" | "siswa">("all");
  const [priority, setPriority] = React.useState<"low" | "normal" | "high" | "urgent">("normal");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setAnnouncements(DataRepository.getAnnouncements());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError("Judul dan isi pengumuman wajib diisi.");
      return;
    }

    const school = DataRepository.getSchool();
    const currentUser = DataRepository.getCurrentUser();

    DataRepository.addAnnouncement({
      school_id: school.id,
      author_id: currentUser.id,
      title,
      content,
      target_role: targetRole,
      priority,
      is_published: true,
    });

    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setTargetRole("all");
    setPriority("normal");
    setFormError("");
    loadData();
  };

  return (
    <DashboardShell
      title="Manajemen Pengumuman Sekolah"
      subtitle="Siarkan informasi resmi dan edaran penting kepada dewan guru dan peserta didik"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Pengumuman Resmi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {announcements.length} siaran informasi aktif
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Buat Pengumuman Baru
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className="p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                    <Badge variant={ann.priority === "urgent" ? "destructive" : "indigo"}>
                      {ann.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <span>
                      Penerima:{" "}
                      <b className="text-slate-700">
                        {ann.target_role === "all"
                          ? "Semua Warga Sekolah"
                          : ann.target_role.toUpperCase()}
                      </b>
                    </span>
                    <span>Dipublikasikan: {formatTanggalIndo(ann.published_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add Announcement */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Pengumuman Baru"
        description="Siarkan pengumuman kepada guru, siswa, atau seluruh komunitas sekolah."
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <Input
            label="Judul Pengumuman"
            placeholder="Contoh: Jadwal Penilaian Tengah Semester Gasal..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Target Penerima
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
              >
                <option value="all">Semua Warga Sekolah</option>
                <option value="guru">Khusus Dewan Guru</option>
                <option value="siswa">Khusus Peserta Didik</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
              >
                <option value="normal">Normal</option>
                <option value="high">Penting (High)</option>
                <option value="urgent">Mendesak (Urgent)</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Isi Pengumuman Lengkap"
            placeholder="Tuliskan detail pengumuman dan instruksi resmi di sini..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">Siarkan Pengumuman</Button>
          </div>
        </form>
      </Dialog>
    </DashboardShell>
  );
}

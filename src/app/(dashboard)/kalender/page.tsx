"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { SchoolEvent } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  CalendarDays,
  PlusCircle,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";

export default function KalenderAkademikPage() {
  const [events, setEvents] = React.useState<SchoolEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const currentUser = DataRepository.getCurrentUser();

  // Form states
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [eventType, setEventType] = React.useState<"ujian" | "kegiatan" | "libur" | "akademik">("kegiatan");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setEvents(DataRepository.getEvents());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) {
      setFormError("Judul agenda, waktu mulai, dan selesai wajib diisi.");
      return;
    }

    const school = DataRepository.getSchool();
    DataRepository.addEvent({
      school_id: school.id,
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      event_type: eventType,
      is_public: true,
    });

    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setFormError("");
    loadData();
  };

  return (
    <DashboardShell
      title="Kalender Akademik & Jadwal Sekolah"
      subtitle="Jadwal pekan ujian, kegiatan sekolah, tenggat tugas, dan hari libur resmi (WIB)"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Agenda Akademik (Asia/Jakarta)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kalender terintegrasi dengan penugasan dan jadwal ujian sekolah
          </p>
        </div>

        {currentUser.role !== "siswa" && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Tambah Agenda Baru
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: List of Events */}
        <div className="md:col-span-2 space-y-4">
          {events.map((evt) => (
            <Card key={evt.id} className="p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    evt.event_type === "ujian"
                      ? "bg-purple-100 text-purple-700"
                      : evt.event_type === "libur"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <CalendarDays className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                    <Badge
                      variant={
                        evt.event_type === "ujian"
                          ? "indigo"
                          : evt.event_type === "libur"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {evt.event_type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {formatTanggalIndo(evt.start_time)} s.d.{" "}
                      {formatTanggalIndo(evt.end_time)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Weekly Schedule Quick Glance */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              Jadwal Rutin Mingguan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-blue-700">Senin (07:30 - 09:00 WIB)</span>
                <p className="font-semibold text-slate-800">Matematika Terpadu</p>
                <p className="text-slate-400 text-[11px]">Ruang 101 • Pak Budi Santoso</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-blue-700">Senin (09:15 - 10:45 WIB)</span>
                <p className="font-semibold text-slate-800">Bahasa Indonesia</p>
                <p className="text-slate-400 text-[11px]">Ruang 101 • Dra. Siti Rahmawati</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-blue-700">Selasa (08:00 - 10:15 WIB)</span>
                <p className="font-semibold text-slate-800">Informatika & Pemrograman</p>
                <p className="text-slate-400 text-[11px]">Lab Komputer 1 • Pak Hendra</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Add Event */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Agenda Kalender Sekolah"
        description="Masukkan kegiatan akademik, jadwal ujian, atau hari libur resmi."
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <Input
            label="Nama Agenda Kegiatan"
            placeholder="Contoh: Pekan Asesmen Sumatif Akhir Jenjang..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Jenis Kategori Kegiatan
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
            >
              <option value="kegiatan">Kegiatan Sekolah</option>
              <option value="ujian">Pekan Ujian & Asesmen</option>
              <option value="akademik">Tenggat Akademik</option>
              <option value="libur">Hari Libur Sekolah</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waktu Mulai"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="Waktu Selesai"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Keterangan Agenda"
            placeholder="Tuliskan catatan penting mengenai agenda ini..."
            rows={3}
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
            <Button type="submit">Simpan ke Kalender</Button>
          </div>
        </form>
      </Dialog>
    </DashboardShell>
  );
}

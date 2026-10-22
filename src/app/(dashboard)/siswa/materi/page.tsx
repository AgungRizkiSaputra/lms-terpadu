"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { LearningMaterial } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import { BookOpen, Video, CheckCircle2, Circle, Eye } from "lucide-react";

export default function SiswaMateriPage() {
  const [materials, setMaterials] = React.useState<LearningMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = React.useState<LearningMaterial | null>(null);
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setMaterials(DataRepository.getMaterials());
    // Ambil riwayat selesai dari local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lms_student_completed_materials");
      if (saved) setCompletedIds(JSON.parse(saved));
    }
  }, []);

  const toggleComplete = (id: string) => {
    let updated: string[];
    if (completedIds.includes(id)) {
      updated = completedIds.filter((item) => item !== id);
    } else {
      updated = [...completedIds, id];
    }
    setCompletedIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lms_student_completed_materials", JSON.stringify(updated));
    }
  };

  return (
    <DashboardShell
      title="Materi Pembelajaran Mandiri"
      subtitle="Akses modul materi pelajaran, tonton video pengantar, dan pantau progres belajar"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Modul Belajar Aktif</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Selesaikan pembacaan modul untuk membuka penugasan
          </p>
        </div>

        <Badge variant="success" className="px-3 py-1 text-xs">
          {completedIds.length} dari {materials.length} Selesai Dipelajari
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {materials.map((m) => {
          const isDone = completedIds.includes(m.id);
          return (
            <Card
              key={m.id}
              className={`flex flex-col justify-between hover:shadow-md transition-all ${
                isDone ? "border-emerald-200 bg-emerald-50/15" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo">Matematika</Badge>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <Circle className="w-3.5 h-3.5" />
                      Belum Dibaca
                    </span>
                  )}
                </div>

                <CardTitle className="text-base font-bold mt-2 leading-snug">
                  {m.title}
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {m.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant={isDone ? "outline" : "primary"}
                    onClick={() => setSelectedMaterial(m)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Buka Modul
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleComplete(m.id)}
                    className={isDone ? "text-slate-400" : "text-emerald-600"}
                  >
                    {isDone ? "Batal Selesai" : "Tandai Selesai"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reader Modal */}
      {selectedMaterial && (
        <Dialog
          isOpen={true}
          onClose={() => setSelectedMaterial(null)}
          title={selectedMaterial.title}
          description="Bacalah uraian materi di bawah ini dengan saksama."
          className="max-w-3xl"
        >
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
            {selectedMaterial.video_url && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-blue-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-600" />
                  Materi ini dilengkapi video penjelasan guru di YouTube
                </span>
                <a
                  href={selectedMaterial.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Tonton Video →
                </a>
              </div>
            )}

            <div
              className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: selectedMaterial.content }}
            />

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Diperbarui: {formatTanggalIndo(selectedMaterial.updated_at)}
              </span>

              <Button
                variant={completedIds.includes(selectedMaterial.id) ? "outline" : "success"}
                onClick={() => {
                  toggleComplete(selectedMaterial.id);
                  setSelectedMaterial(null);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {completedIds.includes(selectedMaterial.id)
                  ? "Tutup Modul"
                  : "Tandai Selesai Membaca"}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </DashboardShell>
  );
}

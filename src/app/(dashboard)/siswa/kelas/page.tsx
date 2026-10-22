"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { GraduationCap, BookOpen, Users, UserCheck } from "lucide-react";

export default function SiswaKelasPage() {
  const subjects = DataRepository.getSubjects();

  return (
    <DashboardShell
      title="Kelas & Rombel Saya"
      subtitle="Informasi rombongan belajar, wali kelas, dan kurikulum mata pelajaran"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kelas Card */}
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="indigo">Tingkat X • SMA</Badge>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              X-1 (MIPA Unggulan)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tahun Ajaran 2026/2027 • Semester Ganjil
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Wali Kelas:</span>
              <span className="font-bold text-slate-800">Budi Santoso, S.Pd.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Rekan Kelas:</span>
              <span className="font-bold text-slate-800">34 Siswa</span>
            </div>
          </div>
        </Card>

        {/* Kurikulum Mapel di Kelas */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Mata Pelajaran yang Diikuti
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((s) => (
              <Card key={s.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {s.code}
                  </span>
                  <Badge variant={s.category === "Wajib" ? "indigo" : "warning"}>
                    {s.category}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{s.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {s.description}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>KKM: <b>{s.passing_grade}</b></span>
                  <span className="text-emerald-600 font-semibold">Tersinkronisasi</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { School } from "@/types/database";
import { Settings, Save, CheckCircle2, School as SchoolIcon } from "lucide-react";

export default function AdminPengaturanPage() {
  const [school, setSchool] = React.useState<School | null>(null);
  const [name, setName] = React.useState("");
  const [npsn, setNpsn] = React.useState("");
  const [level, setLevel] = React.useState<"SMP" | "SMA" | "SMK">("SMA");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    const s = DataRepository.getSchool();
    setSchool(s);
    setName(s.name);
    setNpsn(s.npsn || "");
    setLevel(s.level);
    setAddress(s.address || "");
    setPhone(s.phone || "");
    setEmail(s.email || "");
    setWebsite(s.website || "");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataRepository.updateSchool({
      name,
      npsn,
      level,
      address,
      phone,
      email,
      website,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!school) return null;

  return (
    <DashboardShell
      title="Pengaturan Identitas Sekolah"
      subtitle="Konfigurasi data pokok pendidikan, profil lembaga, dan parameter sistem LMS"
    >
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSave}>
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <SchoolIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Profil Lembaga Pendidikan
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini digunakan sebagai kop surat digital, rapor, dan sertifikat kelulusan
                </p>
              </div>
            </div>

            {isSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Data pengaturan sekolah berhasil diperbarui dan disimpan!
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Nama Resmi Sekolah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Jenjang Sekolah
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm"
                  >
                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                    <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                    <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="NPSN (Nomor Pokok Sekolah Nasional)"
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                />
                <Input
                  label="Nomor Telepon Kantor"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Resmi Sekolah"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Website Lembaga"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <Textarea
                label="Alamat Lengkap Sekolah"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <Button type="submit" size="md">
                <Save className="w-4 h-4 mr-1.5" />
                Simpan Perubahan Pengaturan
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardShell>
  );
}

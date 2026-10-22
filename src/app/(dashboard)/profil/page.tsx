"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { Profile } from "@/types/database";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function ProfilPage() {
  const [user, setUser] = React.useState<Profile | null>(null);
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [isSaved, setIsSaved] = React.useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  React.useEffect(() => {
    const u = DataRepository.getCurrentUser();
    setUser(u);
    setFullName(u.full_name);
    setPhone(u.phone || "");
    setBio(u.bio || "");
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    DataRepository.updateProfile(user.id, {
      full_name: fullName,
      phone,
      bio,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <DashboardShell
      title="Pengaturan Profil Akun"
      subtitle="Kelola identitas pribadi, informasi kontak, dan keamanan kata sandi"
    >
      <div className="max-w-3xl space-y-6">
        {/* User Card Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border-2 border-blue-500">
                {user.full_name.charAt(0)}
              </div>
            )}

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
                <Badge
                  variant={
                    user.role === "admin"
                      ? "indigo"
                      : user.role === "guru"
                      ? "success"
                      : "default"
                  }
                >
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-xs text-slate-400 font-mono">
                NIP/NISN: {user.nip_nisn || "Belum dikonfigurasi"}
              </p>
            </div>
          </div>
        </Card>

        {/* Edit Profile Form */}
        <Card className="p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Informasi Pribadi & Kontak
          </h3>

          {isSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profil pribadi berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Alamat Email (Terkunci)"
                value={user.email}
                disabled
                helperText="Email dikelola oleh administrator sekolah"
              />
              <Input
                label="Nomor Telepon / WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812..."
              />
            </div>

            <Textarea
              label="Bio Singkat"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Deskripsi singkat mengenai peran atau minat akademik..."
              rows={3}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit">
                <Save className="w-4 h-4 mr-1.5" />
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            Keamanan & Ganti Kata Sandi
          </h3>

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Kata sandi baru berhasil disimpan!
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="Kata Sandi Saat Ini"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="Kata Sandi Baru"
              type="password"
              placeholder="Minimal 8 karakter..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="outline">
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

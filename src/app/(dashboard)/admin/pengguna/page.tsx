"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DataRepository } from "@/lib/data-repository";
import { Profile, UserRole } from "@/types/database";
import {
  Users,
  Search,
  UserPlus,
  Shield,
  GraduationCap,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  KeyRound,
  Copy,
  X,
} from "lucide-react";

function AdminPenggunaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as "all" | UserRole | null;

  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [roleFilter, setRoleFilter] = React.useState<"all" | UserRole>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 8;

  // Sync roleFilter with URL query param from sidebar dropdown
  React.useEffect(() => {
    if (roleParam === "admin" || roleParam === "guru" || roleParam === "siswa") {
      setRoleFilter(roleParam);
    } else {
      setRoleFilter("all");
    }
  }, [roleParam]);

  const handleRoleFilterChange = (newRole: "all" | UserRole) => {
    setRoleFilter(newRole);
    router.push(newRole === "all" ? "/admin/pengguna" : `/admin/pengguna?role=${newRole}`);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<Profile | null>(null);
  const [viewingUser, setViewingUser] = React.useState<Profile | null>(null);
  const [resetPasswordInfo, setResetPasswordInfo] = React.useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  // Form State
  const [formName, setFormName] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formRole, setFormRole] = React.useState<UserRole>("siswa");
  const [formNip, setFormNip] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formBio, setFormBio] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const loadData = () => {
    setProfiles(DataRepository.getProfiles());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, searchQuery, statusFilter]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole(roleFilter === "all" ? "siswa" : roleFilter);
    setFormNip("");
    setFormPhone("");
    setFormBio("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (user: Profile) => {
    setEditingUser(user);
    setFormName(user.full_name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormNip(user.nip_nisn || "");
    setFormPhone(user.phone || "");
    setFormBio(user.bio || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Nama lengkap dan email wajib diisi.");
      return;
    }

    if (editingUser) {
      DataRepository.updateProfile(editingUser.id, {
        full_name: formName,
        email: formEmail,
        role: formRole,
        nip_nisn: formNip,
        phone: formPhone,
        bio: formBio,
      });
    } else {
      DataRepository.addProfile({
        full_name: formName,
        email: formEmail,
        role: formRole,
        nip_nisn: formNip,
        phone: formPhone,
        bio: formBio,
        is_active: true,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleToggleStatus = (user: Profile) => {
    DataRepository.updateProfile(user.id, {
      is_active: !user.is_active,
    });
    loadData();
  };

  const handleResetPassword = (user: Profile) => {
    if (confirm(`Apakah Anda yakin ingin mereset kata sandi akun "${user.full_name}"?`)) {
      const res = DataRepository.resetUserPassword(user.id);
      if (res.success) {
        setResetPasswordInfo({
          name: user.full_name,
          email: user.email,
          password: res.defaultPassword || "Sekolah2026!",
        });
      }
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      DataRepository.deleteProfile(id);
      loadData();
    }
  };

  // Counts per role
  const counts = {
    semua: profiles.length,
    admin: profiles.filter((p) => p.role === "admin").length,
    guru: profiles.filter((p) => p.role === "guru").length,
    siswa: profiles.filter((p) => p.role === "siswa").length,
  };

  // Filtered List
  const filteredProfiles = profiles.filter((p) => {
    const matchQuery =
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nip_nisn && p.nip_nisn.includes(searchQuery));

    const matchRole = roleFilter === "all" || p.role === roleFilter;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? p.is_active : !p.is_active);

    return matchQuery && matchRole && matchStatus;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE));
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const roleBadgeVariant = (role: UserRole) => {
    if (role === "admin") return "indigo";
    if (role === "guru") return "success";
    return "default";
  };

  const roleLabel = (role: UserRole) => {
    if (role === "admin") return "Administrator";
    if (role === "guru") return "Guru";
    return "Siswa";
  };

  return (
    <DashboardShell
      title="Manajemen Pengguna Sekolah"
      subtitle="Kelola akun Admin, Guru, dan Peserta Didik dengan filter peran dan kontrol akses"
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Direktori Akun Pengguna</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {profiles.length} akun terdaftar di sistem LMS Sekolah
          </p>
        </div>

        <Button onClick={openAddModal}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Tambah Pengguna Baru
        </Button>
      </div>

      {/* Filter and Search Bar with Role Dropdown */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, email, atau NIP/NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Role Dropdown Filter */}
          <div className="w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value as "all" | UserRole)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Peran ({counts.semua})</option>
              <option value="admin">Administrator ({counts.admin})</option>
              <option value="guru">Dewan Guru ({counts.guru})</option>
              <option value="siswa">Peserta Didik ({counts.siswa})</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {/* Summary */}
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {filteredProfiles.length} ditemukan
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">NIP / NISN</th>
                <th className="py-3 px-4">No. Telepon</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                    <p className="font-semibold">Tidak ada pengguna yang sesuai</p>
                    <p className="text-[11px] mt-1">Coba ubah filter pencarian</p>
                  </td>
                </tr>
              ) : (
                paginatedProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.avatar_url}
                            alt={p.full_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {p.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {p.full_name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {p.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={roleBadgeVariant(p.role)}>
                        {roleLabel(p.role)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                      {p.nip_nisn || "-"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.phone || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {p.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingUser(p)}
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(p)}
                          title={p.is_active ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                        >
                          {p.is_active ? (
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResetPassword(p)}
                          title="Reset Kata Sandi"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(p)}
                          title="Edit Pengguna"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(p.id, p.full_name)}
                          title="Hapus Pengguna"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/30">
            <span className="text-xs text-slate-500">
              Halaman {currentPage} dari {totalPages} ({filteredProfiles.length} data)
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lsaquo; Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next &rsaquo;
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View Detail Modal */}
      {viewingUser && (
        <Dialog
          isOpen={true}
          onClose={() => setViewingUser(null)}
          title="Detail Profil Pengguna"
          description="Informasi lengkap akun pengguna terdaftar di sistem LMS."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              {viewingUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={viewingUser.avatar_url}
                  alt={viewingUser.full_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-2xl">
                  {viewingUser.full_name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingUser.full_name}</h3>
                <p className="text-xs text-slate-500">{viewingUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={roleBadgeVariant(viewingUser.role)}>{roleLabel(viewingUser.role)}</Badge>
                  {viewingUser.is_active ? (
                    <span className="text-[11px] text-emerald-700 font-semibold">● Aktif</span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold">● Nonaktif</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">NIP / NISN</span>
                <span className="text-slate-900 font-mono font-bold">{viewingUser.nip_nisn || "-"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block mb-0.5">No. Telepon</span>
                <span className="text-slate-900 font-bold">{viewingUser.phone || "-"}</span>
              </div>
            </div>

            {viewingUser.bio && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Biografi / Catatan</span>
                <p className="text-slate-700 leading-relaxed">{viewingUser.bio}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setViewingUser(null)}>Tutup</Button>
              <Button onClick={() => { setViewingUser(null); openEditModal(viewingUser); }}>
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit Data
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Add / Edit User Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit Profil Pengguna" : "Tambah Pengguna Baru"}
        description="Pastikan data identitas sekolah diisi secara lengkap dan benar."
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <Input
            label="Nama Lengkap dengan Gelar"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contoh: Ahmad Fauzi, S.Pd."
            required
          />

          <Input
            label="Alamat Email Sekolah"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="user@sekolah.id"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Peran Akun (Role)
            </label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="siswa">Peserta Didik (Siswa)</option>
              <option value="guru">Dewan Guru Pengampu</option>
              <option value="admin">Administrator Sekolah</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="NIP / NISN"
              value={formNip}
              onChange={(e) => setFormNip(e.target.value)}
              placeholder="Contoh: 19850314..."
            />
            <Input
              label="Nomor Telepon / WA"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="0812..."
            />
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
              {editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Reset Password Info Modal */}
      {resetPasswordInfo && (
        <Dialog
          isOpen={true}
          onClose={() => setResetPasswordInfo(null)}
          title="Kata Sandi Berhasil Direset"
          description="Informasikan kata sandi default baru ini kepada pengguna yang bersangkutan."
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
              <p className="text-amber-900">
                Kata sandi untuk akun <b>{resetPasswordInfo.name}</b> ({resetPasswordInfo.email}) telah dikembalikan ke kata sandi sementara:
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-300 font-mono text-sm font-bold text-slate-800">
                <span>{resetPasswordInfo.password}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(resetPasswordInfo.password);
                    alert("Kata sandi berhasil disalin ke clipboard!");
                  }}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Salin
                </Button>
              </div>
              <p className="text-[11px] text-amber-700">
                * Pengguna disarankan untuk segera mengubah kata sandi setelah berhasil login kembali.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setResetPasswordInfo(null)}>Tutup</Button>
            </div>
          </div>
        </Dialog>
      )}
    </DashboardShell>
  );
}

export default function AdminPenggunaPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat Data Pengguna...</div>}>
      <AdminPenggunaContent />
    </React.Suspense>
  );
}

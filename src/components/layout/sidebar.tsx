"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Profile, UserRole } from "@/types/database";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Bell,
  Settings,
  FileText,
  CheckSquare,
  Award,
  Sparkles,
  School as SchoolIcon,
  LogOut,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Calendar,
  Shield,
} from "lucide-react";

interface NavSubItem {
  label: string;
  href: string;
  roleFilter?: "all" | "admin" | "guru" | "siswa";
  icon?: React.ElementType;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavSubItem[];
}

interface SidebarProps {
  currentUser: Profile;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function Sidebar({ currentUser, isOpen, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRoleParam = searchParams.get("role");

  // State to control collapsible dropdown menus in sidebar
  const [isPenggunaDropdownOpen, setIsPenggunaDropdownOpen] = React.useState(true);

  // Auto-expand if currently on admin/pengguna route
  React.useEffect(() => {
    if (pathname.startsWith("/admin/pengguna")) {
      setIsPenggunaDropdownOpen(true);
    }
  }, [pathname]);

  // Menu items per role
  const getNavItems = (role: UserRole): NavItem[] => {
    switch (role) {
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          {
            label: "Data Pengguna",
            href: "/admin/pengguna",
            icon: Users,
            children: [
              // { label: "Lihat Semua Pengguna", href: "/admin/pengguna?role=all", roleFilter: "all", icon: Users },
              { label: "Admin", href: "/admin/pengguna?role=admin", roleFilter: "admin", icon: Shield },
              { label: "Guru", href: "/admin/pengguna?role=guru", roleFilter: "guru", icon: GraduationCap },
              { label: "Peserta Didik", href: "/admin/pengguna?role=siswa", roleFilter: "siswa", icon: BookOpen },
            ],
          },
          { label: "Kelola Kelas", href: "/admin/kelas", icon: GraduationCap },
          { label: "Mata Pelajaran", href: "/admin/mata-pelajaran", icon: BookOpen },
          { label: "Jadwal Kelas", href: "/admin/jadwal", icon: CalendarDays },
          { label: "Tahun Ajaran", href: "/admin/tahun-ajaran", icon: Calendar },
          { label: "Pengumuman", href: "/admin/pengumuman", icon: Bell },
          { label: "Pengaturan Sekolah", href: "/admin/pengaturan", icon: Settings },
        ];
      case "guru":
        return [
          { label: "Dashboard", href: "/guru/dashboard", icon: LayoutDashboard },
          { label: "Kelas Diampu", href: "/guru/kelas", icon: GraduationCap },
          { label: "Materi Belajar", href: "/guru/materi", icon: BookOpen },
          { label: "Tugas Siswa", href: "/guru/tugas", icon: CheckSquare },
          { label: "Ujian & PTS", href: "/guru/ujian", icon: FileText },
          { label: "Buku Nilai", href: "/guru/penilaian", icon: Award },
        ];
      case "siswa":
        return [
          { label: "Dashboard", href: "/siswa/dashboard", icon: LayoutDashboard },
          { label: "Kelas Saya", href: "/siswa/kelas", icon: GraduationCap },
          { label: "Materi Pelajaran", href: "/siswa/materi", icon: BookOpen },
          { label: "Tugas Saya", href: "/siswa/tugas", icon: CheckSquare },
          { label: "Ujian Online", href: "/siswa/ujian", icon: FileText },
          { label: "Rapor & Nilai", href: "/siswa/nilai", icon: Award },
        ];
    }
  };

  const navItems = getNavItems(currentUser.role);

  const sharedNav = [
    { label: "Kalender Akademik", href: "/kalender", icon: CalendarDays },
    { label: "Notifikasi", href: "/notifikasi", icon: Bell },
    { label: "Profil Saya", href: "/profil", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-68 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 bg-linear-to-r from-blue-50/50 to-indigo-50/30">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold text-lg">
            <SchoolIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-900 truncate">LMS Pintar</h1>
            <p className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Portal Terpadu
            </p>
          </div>
        </div>

        {/* Current User Card */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
          {currentUser.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {currentUser.full_name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {currentUser.full_name}
            </p>
            <span
              className={cn(
                "inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5",
                currentUser.role === "admin" && "bg-purple-100 text-purple-700",
                currentUser.role === "guru" && "bg-emerald-100 text-emerald-700",
                currentUser.role === "siswa" && "bg-blue-100 text-blue-700"
              )}
            >
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu Utama
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isItemRouteActive = pathname === item.href || pathname.startsWith(item.href + "/");

                if (hasChildren) {
                  return (
                    <div key={item.label} className="space-y-1">
                      {/* Parent Item with Collapsible Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsPenggunaDropdownOpen((prev) => !prev)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer",
                          isItemRouteActive
                            ? "bg-blue-50 text-blue-800 font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-transform group-hover:scale-110",
                            isItemRouteActive ? "text-blue-600" : "text-slate-400"
                          )}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isPenggunaDropdownOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-blue-600 transition-transform" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform" />
                        )}
                      </button>

                      {/* Dropdown Sub-Items */}
                      {isPenggunaDropdownOpen && (
                        <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-blue-200/80 ml-5 transition-all">
                          {item.children!.map((child) => {
                            const ChildIcon = child.icon || Users;
                            // Check if this child role filter matches
                            const isChildActive =
                              pathname === "/admin/pengguna" &&
                              (child.roleFilter === "all"
                                ? !currentRoleParam || currentRoleParam === "all"
                                : currentRoleParam === child.roleFilter);

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => onClose()}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                  isChildActive
                                    ? "bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/20"
                                    : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/70"
                                )}
                              >
                                <ChildIcon
                                  className={cn(
                                    "w-3.5 h-3.5 shrink-0",
                                    isChildActive ? "text-white" : "text-slate-400"
                                  )}
                                />
                                <span className="truncate">{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Normal Item
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                      isItemRouteActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isItemRouteActive ? "text-white" : "text-slate-400"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isItemRouteActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Layanan Sekolah
            </p>
            <nav className="space-y-1">
              {sharedNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 py-1 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sistem Aktif
            </span>
            <span className="text-slate-400">v1.0 (Next.js 16)</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar dari Sesi
          </button>
        </div>
      </aside>
    </>
  );
}

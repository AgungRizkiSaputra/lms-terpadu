"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Profile, UserRole } from "@/types/database";
import { DataRepository } from "@/lib/data-repository";
import {
  Menu,
  Bell,
  Search,
  UserCheck,
} from "lucide-react";

interface HeaderProps {
  currentUser: Profile;
  onOpenMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({
  currentUser,
  onOpenMobileSidebar,
  title = "Dashboard Pembelajaran",
  subtitle,
}: HeaderProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = React.useState(2);

  React.useEffect(() => {
    const notifs = DataRepository.getNotifications();
    const unread = notifs.filter((n) => !n.is_read).length;
    setUnreadCount(unread);
  }, []);

  const handleSwitchRole = (newRole: UserRole) => {
    const updatedUser = DataRepository.loginAsRole(newRole);
    if (updatedUser.role === "admin") router.push("/admin/dashboard");
    else if (updatedUser.role === "guru") router.push("/guru/dashboard");
    else if (updatedUser.role === "siswa") router.push("/siswa/dashboard");
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile trigger & Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center: Search Bar (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-xs relative mx-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari kelas, materi, siswa..."
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right: Role Switcher Demo Pill + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year Chip */}
        <span className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
          TA 2026/2027 (Ganjil)
        </span>

        {/* Fast Role Switcher */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <span className="px-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Peran:
          </span>
          <button
            onClick={() => handleSwitchRole("admin")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
              currentUser.role === "admin"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => handleSwitchRole("guru")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
              currentUser.role === "guru"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Guru
          </button>
          <button
            onClick={() => handleSwitchRole("siswa")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
              currentUser.role === "siswa"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Siswa
          </button>
        </div>

        {/* Notifications Icon Button */}
        <Link
          href="/notifikasi"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Avatar Link */}
        <Link
          href="/profil"
          className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors border border-transparent hover:border-slate-200"
        >
          {currentUser.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[120px]">
            {currentUser.full_name.split(" ")[0]}
          </span>
        </Link>
      </div>
    </header>
  );
}

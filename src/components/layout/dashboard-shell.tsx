"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Profile } from "@/types/database";
import { DataRepository } from "@/lib/data-repository";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardShell({
  children,
  title,
  subtitle,
}: DashboardShellProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<Profile | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const user = DataRepository.getCurrentUser();
    setCurrentUser(user);

    const handleAuthChange = () => {
      const updated = DataRepository.getCurrentUser();
      setCurrentUser(updated);
    };

    window.addEventListener("lms_auth_changed", handleAuthChange);
    return () => window.removeEventListener("lms_auth_changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    DataRepository.logout();
    router.push("/login");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Memuat Sesi LMS Sekolah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <React.Suspense fallback={<aside className="w-68 bg-white border-r hidden lg:block" />}>
        <Sidebar
          currentUser={currentUser}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </React.Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentUser={currentUser}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

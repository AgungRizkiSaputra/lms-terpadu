"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataRepository } from "@/lib/data-repository";
import { NotificationItem } from "@/types/database";
import { formatTanggalIndo } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Megaphone,
  ArrowRight,
} from "lucide-react";

export default function NotifikasiPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  const loadData = () => {
    setNotifications(DataRepository.getNotifications());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleMarkAsRead = (id: string) => {
    DataRepository.markNotificationAsRead(id);
    loadData();
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((n) => DataRepository.markNotificationAsRead(n.id));
    loadData();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "tugas":
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case "nilai":
        return <Award className="w-5 h-5 text-emerald-600" />;
      case "pengumuman":
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <DashboardShell
      title="Pusat Pemberitahuan Internal"
      subtitle="Semua notifikasi pengumuman, tugas baru, dan publikasi nilai akademis Anda"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifikasi Pembelajaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemberitahuan resmi tersinkronisasi otomatis
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          <CheckCheck className="w-4 h-4 mr-1.5" />
          Tandai Semua Sudah Dibaca
        </Button>
      </div>

      <div className="space-y-3 max-w-4xl">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`p-4 transition-all ${
              !notif.is_read
                ? "border-blue-200 bg-blue-50/20 shadow-xs"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {notif.title}
                    </h4>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.content}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatTanggalIndo(notif.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    Tandai Dibaca
                  </Button>
                )}

                {notif.link && (
                  <Link href={notif.link}>
                    <Button size="sm" variant="outline">
                      Buka Halaman
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

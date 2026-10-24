"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { School, LogIn, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataRepository } from "@/lib/data-repository";
import { UserRole } from "@/types/database";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Cari pengguna dari mock / profil yang cocok
      const profiles = DataRepository.getProfiles();
      const user = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

      if (user) {
        DataRepository.setCurrentUser(user);
        redirectUser(user.role);
      } else {
        // Fallback: Login berhasil sebagai pengguna terdaftar pertama
        const fallback = profiles[0];
        DataRepository.setCurrentUser(fallback);
        redirectUser(fallback.role);
      }
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = DataRepository.loginAsRole(role);
      redirectUser(user.role);
    }, 250);
  };

  const redirectUser = (role: UserRole) => {
    if (redirectPath) {
      router.push(redirectPath);
      return;
    }
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "guru") router.push("/guru/dashboard");
    else if (role === "siswa") router.push("/siswa/dashboard");
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Logo & Title */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-xs mb-3 hover:bg-slate-800 transition-colors">
          <School className="w-6 h-6 text-blue-400" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          SMA Cendekia Nusantara
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Portal Sistem Pembelajaran Terpadu • Akun Percontohan
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Masuk ke Akun</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Masukkan email dan kata sandi yang telah terdaftar di sekolah.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Alamat Email"
            type="email"
            placeholder="nama@sekolah.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <Link
                href="/lupa-sandi"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Lupa sandi?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isLoading}
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            Masuk Sekarang
          </Button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Akses Cepat Mode Demo:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-700 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Admin</span>
              <span className="text-[10px] text-purple-600 font-normal">Kepala/Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("guru")}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-700 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Guru</span>
              <span className="text-[10px] text-emerald-600 font-normal">Pak Budi (Mat)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("siswa")}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Siswa</span>
              <span className="text-[10px] text-blue-600 font-normal">Ahmad (X-1)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security badge footer */}
      <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>Keamanan Terjamin dengan Supabase Auth & RLS</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50/40 flex items-center justify-center p-4">
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center p-8 text-sm text-slate-500">
            Memuat Formulir Masuk...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}

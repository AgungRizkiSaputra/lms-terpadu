"use client";

import * as React from "react";
import Link from "next/link";
import { School, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LupaSandiPage() {
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-3">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pemulihan Kata Sandi
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            LMS Sekolah Pintar
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Tautan Pemulihan Terkirim!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kami telah mengirimkan instruksi pengaturan kata sandi baru ke{" "}
                <b className="text-slate-900">{email}</b>. Silakan periksa kotak masuk atau folder spam email Anda.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Kembali ke Halaman Masuk
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Lupa Kata Sandi Akun?
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Masukkan email terdaftar Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi dengan aman.
                </p>
              </div>

              <Input
                label="Alamat Email Terdaftar"
                type="email"
                placeholder="nama@sekolah.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                isLoading={isLoading}
              >
                <Mail className="w-4 h-4 mr-1.5" />
                Kirim Tautan Pemulihan
              </Button>

              <div className="text-center pt-3 border-t border-slate-100">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

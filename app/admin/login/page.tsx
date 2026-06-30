"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none transition-colors focus:border-sunrise-amber";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-sm rounded-2xl border border-paper/10 bg-paper/5 p-8 backdrop-blur-sm">
        <p className="eyebrow mb-2 text-paper">SolarDV Admin</p>
        <h1 className="font-display text-xl font-semibold text-paper">Đăng nhập quản trị</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-paper/60">
              Email
            </label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="admin@solardv.vn" />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-paper/60">
              Mật khẩu
            </label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-paper/40">Demo: admin@solardv.vn / admin123 (dữ liệu mock, sẽ thay khi nối backend)</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { COMPANY_INFO } from "@/lib/constants";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({ fullName: user?.fullName ?? "", email: user?.email ?? "" });
  const [site, setSite] = useState({ phone: COMPANY_INFO.phone, email: COMPANY_INFO.email, address: COMPANY_INFO.address });
  const [saved, setSaved] = useState<"profile" | "site" | null>(null);

  function save(section: "profile" | "site") {
    // TODO: gọi PATCH /users/me (profile) hoặc PATCH /settings (site) khi nối backend
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  }

  return (
    <>
      <AdminPageHeader title="Cài đặt" description="Thông tin tài khoản & cấu hình website" />

      <div className="space-y-6">
        {/* Hồ sơ cá nhân */}
        <div className="rounded-2xl border border-navy/10 bg-white p-6">
          <p className="mb-5 font-display text-sm font-semibold text-navy">Hồ sơ tài khoản</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Họ và tên</label>
              <input className={inputClass} value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Email</label>
              <input className={inputClass} type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" className="px-5" onClick={() => save("profile")}>
              Lưu thay đổi
            </Button>
            {saved === "profile" && <p className="text-xs text-emerald-600">Đã lưu!</p>}
          </div>
        </div>

        {/* Đổi mật khẩu */}
        <div className="rounded-2xl border border-navy/10 bg-white p-6">
          <p className="mb-5 font-display text-sm font-semibold text-navy">Đổi mật khẩu</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới"].map((label) => (
              <div key={label}>
                <label className="mb-1.5 block text-xs font-medium text-navy/60">{label}</label>
                <input type="password" className={inputClass} placeholder="••••••••" />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="secondary" className="px-5">
              Đổi mật khẩu
            </Button>
          </div>
        </div>

        {/* Thông tin công ty */}
        <div className="rounded-2xl border border-navy/10 bg-white p-6">
          <p className="mb-1 font-display text-sm font-semibold text-navy">Thông tin liên hệ công ty</p>
          <p className="mb-5 text-xs text-navy/50">Hiển thị trên trang Contact và Footer của website.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Điện thoại</label>
              <input className={inputClass} value={site.phone} onChange={(e) => setSite((s) => ({ ...s, phone: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Email</label>
              <input className={inputClass} type="email" value={site.email} onChange={(e) => setSite((s) => ({ ...s, email: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Địa chỉ</label>
              <input className={inputClass} value={site.address} onChange={(e) => setSite((s) => ({ ...s, address: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" className="px-5" onClick={() => save("site")}>
              Lưu thay đổi
            </Button>
            {saved === "site" && <p className="text-xs text-emerald-600">Đã lưu!</p>}
          </div>
        </div>
      </div>
    </>
  );
}

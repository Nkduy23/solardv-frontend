"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUsers, createUser, deleteUser } from "@/lib/api/users.api";
import { updateMe } from "@/lib/api/users.api";
import { AuthUser } from "@/types/user";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { COMPANY_INFO } from "@/lib/constants";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const EMPTY_STAFF: { email: string; password: string; fullName: string; role: "ADMIN" | "STAFF" } = { email: "", password: "", fullName: "", role: "STAFF" };
export default function AdminSettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({ fullName: user?.fullName ?? "" });
  const [site, setSite] = useState({ phone: COMPANY_INFO.phone, email: COMPANY_INFO.email, address: COMPANY_INFO.address });
  const [saved, setSaved] = useState<"profile" | "site" | "staff" | null>(null);

  const [staffList, setStaffList] = useState<AuthUser[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(!USE_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [staffError, setStaffError] = useState("");
  const [savingStaff, setSavingStaff] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AuthUser | null>(null);

  const { toast } = useToast();

  const isAdmin = user?.role === "ADMIN";

  async function loadStaff() {
    if (USE_MOCK || !isAdmin) return;
    setLoadingStaff(true);
    try {
      const users = await getUsers();
      setStaffList(users);
    } finally {
      setLoadingStaff(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, [isAdmin]);

  async function handleSaveProfile() {
    try {
      if (!USE_MOCK) await updateMe({ fullName: profile.fullName });
      toast("Đã cập nhật hồ sơ", "success");
    } catch (err: any) {
      toast(err?.response?.data?.message ?? "Không thể cập nhật hồ sơ", "error");
    }
  }

  function saveSite() {
    toast("Đã lưu thông tin công ty", "success");
  }

  async function handleCreateStaff() {
    setStaffError("");
    setSavingStaff(true);
    try {
      if (USE_MOCK) {
        setStaffList((prev) => [...prev, { id: `u-${Date.now()}`, ...staffForm }]);
      } else {
        const created = await createUser(staffForm);
        setStaffList((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setStaffForm(EMPTY_STAFF);
      toast("Đã tạo tài khoản", "success");
    } catch (err: any) {
      setStaffError(err?.response?.data?.message ?? "Không thể tạo tài khoản");
      console.error(err);
      toast(err?.response?.data?.message ?? "Không thể tạo tài khoản", "error");
    } finally {
      setSavingStaff(false);
    }
  }

  async function handleDeleteStaff() {
    if (!deleteTarget) return;
    try {
      if (!USE_MOCK) await deleteUser(deleteTarget.id);
      setStaffList((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast("Đã xoá nhân viên", "success");
    } catch (err: any) {
      toast(err?.response?.data?.message ?? "Không thể xoá nhân viên", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const staffColumns = [
    { key: "fullName", header: "Họ tên", render: (u: AuthUser) => <p className="font-medium text-navy">{u.fullName}</p> },
    { key: "email", header: "Email", render: (u: AuthUser) => <span className="text-navy/60">{u.email}</span> },
    {
      key: "role",
      header: "Vai trò",
      render: (u: AuthUser) => (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", u.role === "ADMIN" ? "bg-sunrise-amber/15 text-sunrise-copper" : "bg-navy/10 text-navy/60")}>
          {u.role === "ADMIN" ? "Admin" : "Staff"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (u: AuthUser) =>
        u.id !== user?.id ? (
          <Button variant="ghost" className="px-3 py-2 text-xs text-red-500" onClick={() => setDeleteTarget(u)}>
            <Trash2 size={13} /> Xoá
          </Button>
        ) : (
          <span className="text-xs text-navy/30">Tài khoản của bạn</span>
        ),
    },
  ];

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
              <input className={inputClass} value={profile.fullName} onChange={(e) => setProfile({ fullName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Email</label>
              <input className={inputClass} value={user?.email ?? ""} disabled />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" className="px-5" onClick={handleSaveProfile}>
              Lưu thay đổi
            </Button>
            {saved === "profile" && <p className="text-xs text-emerald-600">Đã lưu!</p>}
          </div>
        </div>

        {/* Quản lý tài khoản Staff — chỉ Admin thấy */}
        {isAdmin && (
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-semibold text-navy">Quản lý nhân viên</p>
                <p className="mt-1 text-xs text-navy/50">Tạo tài khoản Staff để hỗ trợ quản trị nội dung</p>
              </div>
              <Button variant="primary" className="px-4 text-xs" onClick={() => setModalOpen(true)}>
                + Thêm nhân viên
              </Button>
            </div>
            {loadingStaff ? (
              <div className="h-32 animate-pulse rounded-2xl bg-navy/5" />
            ) : (
              <DataTable columns={staffColumns} data={staffList} keyExtractor={(u) => u.id} emptyText="Chưa có nhân viên nào" />
            )}
          </div>
        )}

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
              <input className={inputClass} value={site.email} onChange={(e) => setSite((s) => ({ ...s, email: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Địa chỉ</label>
              <input className={inputClass} value={site.address} onChange={(e) => setSite((s) => ({ ...s, address: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" className="px-5" onClick={saveSite}>
              Lưu thay đổi
            </Button>
            {saved === "site" && <p className="text-xs text-emerald-600">Đã lưu!</p>}
          </div>
        </div>
      </div>

      {/* Modal tạo Staff */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Thêm nhân viên mới">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Họ và tên</label>
            <input className={inputClass} value={staffForm.fullName} onChange={(e) => setStaffForm((f) => ({ ...f, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Email</label>
            <input type="email" className={inputClass} value={staffForm.email} onChange={(e) => setStaffForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Mật khẩu</label>
            <input type="password" className={inputClass} value={staffForm.password} onChange={(e) => setStaffForm((f) => ({ ...f, password: e.target.value }))} placeholder="Tối thiểu 6 ký tự" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Vai trò</label>
            <select className={inputClass} value={staffForm.role} onChange={(e) => setStaffForm((f) => ({ ...f, role: e.target.value as "ADMIN" | "STAFF" }))}>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {staffError && <p className="text-xs text-red-600">{staffError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button variant="primary" onClick={handleCreateStaff} disabled={!staffForm.email || !staffForm.password || !staffForm.fullName || savingStaff}>
              {savingStaff ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá nhân viên?"
        description={`Tài khoản "${deleteTarget?.fullName}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDeleteStaff}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

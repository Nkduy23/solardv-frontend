"use client";

import { useEffect, useState } from "react";
import { Consultation, ConsultationStatus } from "@/types/consultation";
import { getConsultations, updateConsultationStatus, deleteConsultation } from "@/lib/api/consultations.api";
import { consultationsMock } from "@/mocks/consultations.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const STATUS_OPTIONS: { value: ConsultationStatus; label: string }[] = [
  { value: "NEW", label: "Mới" },
  { value: "CONTACTED", label: "Đã liên hệ" },
  { value: "DONE", label: "Hoàn tất" },
  { value: "CANCELLED", label: "Đã huỷ" },
];
const STATUS_COLOR: Record<ConsultationStatus, string> = {
  NEW: "bg-sunrise-amber/15 text-sunrise-copper",
  CONTACTED: "bg-blue-100 text-blue-700",
  DONE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-navy/10 text-navy/50",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminConsultationsPage() {
  const [data, setData] = useState<Consultation[]>(USE_MOCK ? consultationsMock : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Consultation | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (USE_MOCK) return;
    setLoading(true);
    const res = await getConsultations({ limit: 100 });
    setData(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdateStatus(id: string, status: ConsultationStatus) {
    if (USE_MOCK) {
      setData((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
      return;
    }
    setSaving(true);
    const updated = await updateConsultationStatus(id, status);
    setData((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setSelected((prev) => (prev?.id === id ? updated : prev));
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!USE_MOCK) await deleteConsultation(deleteTarget.id);
    setData((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const columns = [
    { key: "fullName", header: "Khách hàng", render: (c: Consultation) => <p className="font-medium text-navy">{c.fullName}</p> },
    { key: "phone", header: "Điện thoại", render: (c: Consultation) => <span className="text-navy/60">{c.phone}</span> },
    { key: "message", header: "Nội dung", className: "max-w-xs", render: (c: Consultation) => <span className="line-clamp-1 text-navy/60">{c.message}</span> },
    {
      key: "status",
      header: "Trạng thái",
      render: (c: Consultation) => <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_COLOR[c.status])}>{STATUS_OPTIONS.find((s) => s.value === c.status)?.label}</span>,
    },
    { key: "createdAt", header: "Ngày đăng ký", render: (c: Consultation) => <span className="text-navy/50">{formatDate(c.createdAt)}</span> },
    {
      key: "actions",
      header: "",
      render: (c: Consultation) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="text-xs" onClick={() => setSelected(c)}>
            Chi tiết
          </Button>
          <Button variant="ghost" className="text-xs text-red-500" onClick={() => setDeleteTarget(c)}>
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Đăng ký tư vấn" description={loading ? "Đang tải..." : `${data.filter((c) => c.status === "NEW").length} đăng ký mới chưa xử lý`} />

      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-navy/5" /> : <DataTable columns={columns} data={data} keyExtractor={(c) => c.id} emptyText="Chưa có đăng ký nào" />}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Chi tiết đăng ký tư vấn">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-navy/50">Họ tên</p>
                <p className="mt-1 font-medium text-navy">{selected.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-navy/50">Điện thoại</p>
                <p className="mt-1 font-medium text-navy">{selected.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-navy/50">Nội dung</p>
                <p className="mt-1 text-navy/80">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs text-navy/50">Ngày đăng ký</p>
                <p className="mt-1 text-navy/80">{formatDate(selected.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-navy/50">Cập nhật trạng thái</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    disabled={saving}
                    onClick={() => handleUpdateStatus(selected.id, opt.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                      selected.status === opt.value ? "border-sunrise-amber bg-sunrise-amber text-navy" : "border-navy/15 text-navy/60 hover:border-navy/30",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setSelected(null)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá đăng ký?"
        description={`Xoá đăng ký của "${deleteTarget?.fullName}"?`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

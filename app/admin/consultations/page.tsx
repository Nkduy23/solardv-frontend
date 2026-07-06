"use client";

import { useEffect, useState } from "react";
import { Consultation, ConsultationStatus } from "@/types/consultation";
import { getConsultations, updateConsultationStatus, deleteConsultation } from "@/lib/api/consultations.api";
import { consultationsMock } from "@/mocks/consultations.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const LIMIT = 10;

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
  const { page, limit, meta, updateMeta, goTo } = usePagination(LIMIT);
  const { toast } = useToast();

  async function load(p = page) {
    if (USE_MOCK) return;
    setLoading(true);
    const res = await getConsultations({ page: p, limit });
    setData(res.data);
    updateMeta(res.meta);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [page]);

  async function handleUpdateStatus(id: string, status: ConsultationStatus) {
    setSaving(true);
    if (!USE_MOCK) {
      const updated = await updateConsultationStatus(id, status);
      setData((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSelected((prev) => (prev?.id === id ? updated : prev));
      toast("Đã cập nhật trạng thái", "success");
    } else {
      toast("Cập nhật thất bại", "success");
      setData((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      setSelected((prev) => (prev?.id === id ? { ...prev!, status } : prev));
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!USE_MOCK) await deleteConsultation(deleteTarget.id);
    setData((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    updateMeta({ ...meta, total: meta.total - 1 });
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
        <div className="flex justify-end gap-2">
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
      <AdminPageHeader title="Đăng ký tư vấn" description={loading ? "Đang tải..." : `${USE_MOCK ? data.filter((c) => c.status === "NEW").length : meta.total} kết quả`} />
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-navy/5" />
      ) : (
        <>
          <DataTable columns={columns} data={data} keyExtractor={(c) => c.id} emptyText="Chưa có đăng ký nào" />
          {!USE_MOCK && <Pagination page={page} total={meta.total} limit={limit} onChange={goTo} />}
        </>
      )}

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

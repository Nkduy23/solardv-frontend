"use client";

import { useEffect, useState } from "react";
import { Service } from "@/types/service";
import * as api from "@/lib/api/services.api";
import { servicesMock } from "@/mocks/services.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const EMPTY = { title: "", slug: "", summary: "", detail: "" };

export default function AdminServicesPage() {
  const [data, setData] = useState<Service[]>(USE_MOCK ? servicesMock : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const { page, limit, meta, updateMeta, goTo } = usePagination(10);
  const { toast } = useToast();

  async function load(p = page) {
    if (USE_MOCK) return;
    setLoading(true);
    const res = await api.getServices({ page: p, limit });
    setData(res.data);
    updateMeta(res.meta);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [page]);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(item: Service) {
    setEditTarget(item);
    setForm({ title: item.title, slug: item.slug, summary: item.summary ?? "", detail: item.detail ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (USE_MOCK) {
        if (editTarget) setData((prev) => prev.map((s) => (s.id === editTarget.id ? { ...editTarget, ...form } : s)));
        else setData((prev) => [...prev, { id: `svc-${Date.now()}`, ...form }]);
      } else {
        if (editTarget) {
          const updated = await api.updateService(editTarget.id, form);
          setData((prev) => prev.map((s) => (s.id === editTarget.id ? updated : s)));
        } else {
          const created = await api.createService(form);
          setData((prev) => [created, ...prev]);
          updateMeta({ ...meta, total: meta.total + 1 });
        }
      }
      setModalOpen(false);
      toast(editTarget ? "Đã cập nhật dịch vụ" : "Đã thêm dịch vụ mới", "success");
    } catch (err: any) {
      toast(err?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!USE_MOCK) await api.deleteService(deleteTarget.id);
    setData((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    updateMeta({ ...meta, total: meta.total - 1 });
    setDeleteTarget(null);
  }

  const columns = [
    { key: "title", header: "Tên dịch vụ", render: (s: Service) => <p className="font-medium text-navy">{s.title}</p> },
    { key: "summary", header: "Mô tả ngắn", className: "max-w-xs", render: (s: Service) => <span className="line-clamp-1 text-sm text-navy/60">{s.summary}</span> },
    {
      key: "actions",
      header: "",
      render: (s: Service) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => openEdit(s)}>
            <Pencil size={13} /> Sửa
          </Button>
          <Button variant="ghost" className="px-3 py-2 text-xs text-red-500" onClick={() => setDeleteTarget(s)}>
            <Trash2 size={13} /> Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Quản lý dịch vụ" description={USE_MOCK ? `${data.length} dịch vụ` : `${meta.total} dịch vụ`} action="Thêm dịch vụ" onAction={openCreate} />
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-navy/5" />
      ) : (
        <>
          <DataTable columns={columns} data={data} keyExtractor={(s) => s.id} />
          {!USE_MOCK && <Pagination page={page} total={meta.total} limit={limit} onChange={goTo} />}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}>
        <div className="space-y-4">
          {[
            { key: "title", label: "Tên dịch vụ", placeholder: "Lắp đặt điện mặt trời..." },
            { key: "slug", label: "Slug", placeholder: "lap-dat-dien-mat-troi" },
            { key: "summary", label: "Mô tả ngắn", placeholder: "Tóm tắt dịch vụ..." },
            { key: "detail", label: "Mô tả chi tiết", placeholder: "Nội dung đầy đủ..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">{label}</label>
              {key === "detail" || key === "summary" ? (
                <textarea rows={3} className={inputClass + " resize-none"} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
              ) : (
                <input
                  className={inputClass}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((f) => ({
                      ...f,
                      [key]: value,
                      // Chỉ auto-gen slug khi đang sửa "title" VÀ slug hiện tại đang trống hoặc đang khớp bản cũ (chưa bị người dùng tự sửa tay)
                      ...(key === "title" && (f.slug === "" || f.slug === slugify(f.title)) ? { slug: slugify(value) } : {}),
                    }));
                  }}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.title || saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá dịch vụ?"
        description={`Dịch vụ "${deleteTarget?.title}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

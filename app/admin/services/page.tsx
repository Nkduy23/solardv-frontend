"use client";

import { useState } from "react";
import { Service } from "@/types/service";
import { servicesMock } from "@/mocks/services.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";

const EMPTY: Omit<Service, "id"> = { title: "", slug: "", summary: "", detail: "" };

export default function AdminServicesPage() {
  const [data, setData] = useState<Service[]>(servicesMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(item: Service) {
    setEditTarget(item);
    setForm({ title: item.title, slug: item.slug, summary: item.summary, detail: item.detail });
    setModalOpen(true);
  }

  function handleSave() {
    if (editTarget) {
      setData((prev) => prev.map((s) => (s.id === editTarget.id ? { ...editTarget, ...form } : s)));
    } else {
      setData((prev) => [...prev, { id: `svc-${Date.now()}`, ...form }]);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "title",
      header: "Tên dịch vụ",
      render: (s: Service) => <p className="font-medium text-navy">{s.title}</p>,
    },
    {
      key: "summary",
      header: "Mô tả ngắn",
      className: "max-w-xs",
      render: (s: Service) => <span className="line-clamp-1 text-sm text-navy/60">{s.summary}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (s: Service) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => openEdit(s)}>
            <Pencil size={13} /> Sửa
          </Button>
          <Button variant="ghost" className="px-3 py-2 text-xs text-red-500 hover:text-red-700" onClick={() => setDeleteTarget(s)}>
            <Trash2 size={13} /> Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Quản lý dịch vụ" description={`${data.length} dịch vụ`} action="Thêm dịch vụ" onAction={openCreate} />
      <DataTable columns={columns} data={data} keyExtractor={(s) => s.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}>
        <div className="space-y-4">
          {(["title", "slug", "summary", "detail"] as const).map((field) => (
            <div key={field}>
              <label className="mb-1.5 block text-xs font-medium capitalize text-navy/60">
                {field === "title" ? "Tên dịch vụ" : field === "slug" ? "Slug (URL)" : field === "summary" ? "Mô tả ngắn" : "Mô tả chi tiết"}
              </label>
              {field === "detail" || field === "summary" ? (
                <textarea rows={3} className={inputClass + " resize-none"} value={form[field] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
              ) : (
                <input className={inputClass} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.title}>
              Lưu
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

"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { projectsMock } from "@/mocks/projects.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const EMPTY: Omit<Project, "id"> = { title: "", slug: "", location: "", capacity: "", completedYear: "" };

export default function AdminProjectsPage() {
  const [data, setData] = useState<Project[]>(projectsMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  function field(key: keyof typeof EMPTY, label: string, placeholder = "") {
    return (
      <div key={key}>
        <label className="mb-1.5 block text-xs font-medium text-navy/60">{label}</label>
        <input className={inputClass} value={form[key]} placeholder={placeholder} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
      </div>
    );
  }

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(item: Project) {
    setEditTarget(item);
    setForm({ title: item.title, slug: item.slug, location: item.location, capacity: item.capacity, completedYear: item.completedYear });
    setModalOpen(true);
  }
  function handleSave() {
    if (editTarget) {
      setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form } : p)));
    } else {
      setData((prev) => [...prev, { id: `proj-${Date.now()}`, ...form }]);
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "title",
      header: "Tên công trình",
      render: (p: Project) => <p className="font-medium text-navy">{p.title}</p>,
    },
    {
      key: "location",
      header: "Địa điểm",
      render: (p: Project) => <span className="text-sm text-navy/60">{p.location}</span>,
    },
    {
      key: "capacity",
      header: "Công suất",
      render: (p: Project) => <span className="font-mono text-sm text-sunrise-copper">{p.capacity}</span>,
    },
    {
      key: "completedYear",
      header: "Năm",
      render: (p: Project) => <span className="text-sm text-navy/50">{p.completedYear}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p: Project) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => openEdit(p)}>
            <Pencil size={13} /> Sửa
          </Button>
          <Button variant="ghost" className="px-3 py-2 text-xs text-red-500 hover:text-red-700" onClick={() => setDeleteTarget(p)}>
            <Trash2 size={13} /> Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Quản lý dự án" description={`${data.length} công trình`} action="Thêm dự án" onAction={openCreate} />
      <DataTable columns={columns} data={data} keyExtractor={(p) => p.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa dự án" : "Thêm dự án mới"}>
        <div className="space-y-4">
          {field("title", "Tên công trình", "Hệ thống áp mái nhà xưởng...")}
          {field("slug", "Slug (URL)", "ap-mai-nha-xuong-...")}
          {field("location", "Địa điểm", "Bình Dương")}
          {field("capacity", "Công suất", "850 kWp")}
          {field("completedYear", "Năm hoàn thành", "2025")}
          <p className="text-xs text-navy/40">Upload ảnh công trình sẽ khả dụng khi nối backend (module media).</p>
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
        title="Xoá dự án?"
        description={`Dự án "${deleteTarget?.title}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

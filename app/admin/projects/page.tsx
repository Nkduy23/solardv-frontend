"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import * as api from "@/lib/api/projects.api";
import { projectsMock } from "@/mocks/projects.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const EMPTY = { title: "", slug: "", location: "", capacity: "", completedYear: "", image: "" };

export default function AdminProjectsPage() {
  const [data, setData] = useState<(Project & { image?: string })[]>(USE_MOCK ? projectsMock : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (USE_MOCK) return;
    setLoading(true);
    const res = await api.getProjects({ limit: 100 });
    // BE trả images: string[] — lấy ảnh đầu tiên làm đại diện cho UI admin
    setData(res.data.map((p: any) => ({ ...p, image: p.images?.[0] ?? "" })));
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(item: Project & { image?: string }) {
    setEditTarget(item);
    setForm({ title: item.title, slug: item.slug, location: item.location, capacity: item.capacity, completedYear: item.completedYear, image: item.image ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Map field FE (image, capacity, completedYear) sang đúng shape BE cần
      const payload = {
        title: form.title,
        slug: form.slug,
        location: form.location,
        description: "",
        images: form.image ? [form.image] : [],
        completedAt: form.completedYear ? `${form.completedYear}-01-01` : undefined,
      };

      if (USE_MOCK) {
        if (editTarget) setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form } : p)));
        else setData((prev) => [...prev, { id: `proj-${Date.now()}`, ...form }]);
      } else {
        if (editTarget) {
          const updated = await api.updateProject(editTarget.id, payload);
          setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...updated, image: form.image, capacity: form.capacity, completedYear: form.completedYear } : p)));
        } else {
          const created = await api.createProject(payload);
          setData((prev) => [...prev, { ...created, image: form.image, capacity: form.capacity, completedYear: form.completedYear }]);
        }
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!USE_MOCK) await api.deleteProject(deleteTarget.id);
    setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "image",
      header: "",
      render: (p: Project & { image?: string }) => (
        <div className="size-12 overflow-hidden rounded-lg bg-navy/5">{p.image && <img src={p.image} alt={p.title} className="h-full w-full object-cover" />}</div>
      ),
    },
    { key: "title", header: "Tên công trình", render: (p: Project) => <p className="font-medium text-navy">{p.title}</p> },
    { key: "location", header: "Địa điểm", render: (p: Project) => <span className="text-sm text-navy/60">{p.location}</span> },
    { key: "capacity", header: "Công suất", render: (p: Project) => <span className="font-mono text-sm text-sunrise-copper">{p.capacity}</span> },
    { key: "completedYear", header: "Năm", render: (p: Project) => <span className="text-sm text-navy/50">{p.completedYear}</span> },
    {
      key: "actions",
      header: "",
      render: (p: Project & { image?: string }) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => openEdit(p)}>
            <Pencil size={13} /> Sửa
          </Button>
          <Button variant="ghost" className="px-3 py-2 text-xs text-red-500" onClick={() => setDeleteTarget(p)}>
            <Trash2 size={13} /> Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Quản lý dự án" description={`${data.length} công trình`} action="Thêm dự án" onAction={openCreate} />
      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-navy/5" /> : <DataTable columns={columns} data={data} keyExtractor={(p) => p.id} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa dự án" : "Thêm dự án mới"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Ảnh đại diện</label>
            <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} category="project" />
          </div>
          {[
            { key: "title", label: "Tên công trình", placeholder: "Hệ thống áp mái..." },
            { key: "slug", label: "Slug", placeholder: "he-thong-ap-mai-..." },
            { key: "location", label: "Địa điểm", placeholder: "Bình Dương" },
            { key: "capacity", label: "Công suất", placeholder: "850 kWp" },
            { key: "completedYear", label: "Năm hoàn thành", placeholder: "2025" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">{label}</label>
              <input className={inputClass} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
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
        title="Xoá dự án?"
        description={`Dự án "${deleteTarget?.title}" sẽ bị xoá.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

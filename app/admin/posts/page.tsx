"use client";

import { useState } from "react";
import { Post } from "@/types/post";
import { postsMock } from "@/mocks/posts.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const EMPTY: Omit<Post, "id" | "publishedAt"> = { title: "", slug: "", excerpt: "", isPublished: false };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminPostsPage() {
  const [data, setData] = useState<Post[]>(postsMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Post | null>(null);
  const [form, setForm] = useState<Omit<Post, "id" | "publishedAt">>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(item: Post) {
    setEditTarget(item);
    setForm({ title: item.title, slug: item.slug, excerpt: item.excerpt, isPublished: item.isPublished });
    setModalOpen(true);
  }
  function handleSave() {
    if (editTarget) {
      setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form, publishedAt: form.isPublished ? (editTarget.publishedAt ?? new Date().toISOString()) : null } : p)));
    } else {
      setData((prev) => [...prev, { id: `p-${Date.now()}`, ...form, publishedAt: form.isPublished ? new Date().toISOString() : null }]);
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
      header: "Tiêu đề",
      render: (p: Post) => <p className="font-medium text-navy">{p.title}</p>,
    },
    {
      key: "excerpt",
      header: "Tóm tắt",
      className: "max-w-xs",
      render: (p: Post) => <span className="line-clamp-1 text-sm text-navy/60">{p.excerpt}</span>,
    },
    {
      key: "isPublished",
      header: "Trạng thái",
      render: (p: Post) => (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", p.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-navy/10 text-navy/50")}>
          {p.isPublished ? "Đã đăng" : "Bản nháp"}
        </span>
      ),
    },
    {
      key: "publishedAt",
      header: "Ngày đăng",
      render: (p: Post) => <span className="text-sm text-navy/50">{formatDate(p.publishedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p: Post) => (
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
      <AdminPageHeader
        title="Bài viết / Tin tức"
        description={`${data.filter((p) => p.isPublished).length} đã đăng · ${data.filter((p) => !p.isPublished).length} bản nháp`}
        action="Viết bài mới"
        onAction={openCreate}
      />
      <DataTable columns={columns} data={data} keyExtractor={(p) => p.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa bài viết" : "Bài viết mới"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Tiêu đề</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Tiêu đề bài viết..." />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Slug</label>
            <input className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="tieu-de-bai-viet" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Tóm tắt</label>
            <textarea rows={3} className={inputClass + " resize-none"} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <div className={cn("relative h-5 w-9 rounded-full transition-colors", form.isPublished ? "bg-sunrise-amber" : "bg-navy/20")}>
              <div className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", form.isPublished ? "translate-x-4" : "translate-x-0.5")} />
            </div>
            <span className="text-sm text-navy/70">Đăng ngay</span>
            <input type="checkbox" className="sr-only" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
          </label>
          <p className="text-xs text-navy/40">Rich text editor (nội dung đầy đủ) sẽ tích hợp khi nối backend.</p>
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
        title="Xoá bài viết?"
        description={`Bài "${deleteTarget?.title}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import * as api from "@/lib/api/posts.api";
import { postsMock } from "@/mocks/posts.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import Link from "next/link";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const EMPTY = { title: "", slug: "", excerpt: "", isPublished: false, thumbnail: "" };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminPostsPage() {
  const [data, setData] = useState<(Post & { thumbnail?: string })[]>(USE_MOCK ? postsMock : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Post | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (USE_MOCK) return;
    setLoading(true);
    const res = await api.getPosts({ limit: 100 });
    setData(res.data);
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
  function openEdit(item: Post & { thumbnail?: string }) {
    setEditTarget(item);
    setForm({ title: item.title, slug: item.slug, excerpt: item.excerpt ?? "", isPublished: item.isPublished, thumbnail: item.thumbnail ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (USE_MOCK) {
        if (editTarget) setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form } : p)));
        else setData((prev) => [...prev, { id: `p-${Date.now()}`, ...form, publishedAt: form.isPublished ? new Date().toISOString() : null }]);
      } else {
        if (editTarget) {
          const updated = await api.updatePost(editTarget.id, form);
          setData((prev) => prev.map((p) => (p.id === editTarget.id ? updated : p)));
        } else {
          const created = await api.createPost(form);
          setData((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!USE_MOCK) await api.deletePost(deleteTarget.id);
    setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "thumbnail",
      header: "",
      render: (p: Post & { thumbnail?: string }) => (
        <div className="size-12 overflow-hidden rounded-lg bg-navy/5">{p.thumbnail && <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />}</div>
      ),
    },
    { key: "title", header: "Tiêu đề", render: (p: Post) => <p className="font-medium text-navy">{p.title}</p> },
    { key: "excerpt", header: "Tóm tắt", className: "max-w-xs", render: (p: Post) => <span className="line-clamp-1 text-sm text-navy/60">{p.excerpt}</span> },
    {
      key: "isPublished",
      header: "Trạng thái",
      render: (p: Post) => (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", p.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-navy/10 text-navy/50")}>
          {p.isPublished ? "Đã đăng" : "Bản nháp"}
        </span>
      ),
    },
    { key: "publishedAt", header: "Ngày đăng", render: (p: Post) => <span className="text-sm text-navy/50">{formatDate(p.publishedAt)}</span> },
    {
      key: "actions",
      header: "",
      render: (p: Post) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/posts/${p.id}`}>
            <Button variant="ghost" className="px-3 py-2 text-xs">
              <ExternalLink size={13} /> Mở
            </Button>
          </Link>
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
      <AdminPageHeader
        title="Bài viết / Tin tức"
        description={`${data.filter((p) => p.isPublished).length} đã đăng · ${data.filter((p) => !p.isPublished).length} bản nháp`}
        action="Viết bài mới"
        onAction={openCreate}
      />
      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-navy/5" /> : <DataTable columns={columns} data={data} keyExtractor={(p) => p.id} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa bài viết" : "Bài viết mới"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Ảnh đại diện</label>
            <ImageUploader value={form.thumbnail} onChange={(url) => setForm((f) => ({ ...f, thumbnail: url }))} category="other" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Tiêu đề</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => {
                const value = e.target.value;
                setForm((f) => ({
                  ...f,
                  title: value,
                  ...(f.slug === "" || f.slug === slugify(f.title) ? { slug: slugify(value) } : {}),
                }));
              }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Slug</label>
            <input className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
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
        title="Xoá bài viết?"
        description={`Bài "${deleteTarget?.title}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

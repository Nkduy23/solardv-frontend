"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import * as api from "@/lib/api/products.api";
import { productsMock } from "@/mocks/products.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const CATEGORIES = ["Tấm pin", "Biến tần", "Lưu trữ", "Phụ kiện"];
const EMPTY = { name: "", slug: "", category: CATEGORIES[0], description: "", image: "" };

export default function AdminProductsPage() {
  const [data, setData] = useState<Product[]>(USE_MOCK ? productsMock : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (USE_MOCK) return;
    setLoading(true);
    const res = await api.getProducts({ limit: 100 });
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
  function openEdit(item: Product) {
    setEditTarget(item);
    setForm({ name: item.name, slug: item.slug, category: item.category, description: item.description, image: item.image ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        category: form.category,
        description: form.description,
        images: form.image ? [form.image] : [], // ← map image (string) -> images (array)
      };
      if (USE_MOCK) {
        if (editTarget) setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form } : p)));
        else setData((prev) => [...prev, { id: `prod-${Date.now()}`, ...form }]);
      } else {
        if (editTarget) {
          const updated = await api.updateProduct(editTarget.id, payload);
          setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...updated, image: form.image } : p)));
        } else {
          const created = await api.createProduct(payload as any);
          setData((prev) => [...prev, { ...created, image: form.image }]);
        }
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (!USE_MOCK) await api.deleteProduct(deleteTarget.id);
    setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "image",
      header: "",
      render: (p: Product) => <div className="size-12 overflow-hidden rounded-lg bg-navy/5">{p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}</div>,
    },
    { key: "name", header: "Sản phẩm", render: (p: Product) => <p className="font-medium text-navy">{p.name}</p> },
    { key: "category", header: "Danh mục", render: (p: Product) => <span className="rounded-full bg-sunrise-amber/10 px-2.5 py-1 text-xs font-medium text-sunrise-copper">{p.category}</span> },
    { key: "description", header: "Mô tả", className: "max-w-xs", render: (p: Product) => <span className="line-clamp-1 text-sm text-navy/60">{p.description}</span> },
    {
      key: "actions",
      header: "",
      render: (p: Product) => (
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
      <AdminPageHeader title="Quản lý sản phẩm" description={`${data.length} sản phẩm`} action="Thêm sản phẩm" onAction={openCreate} />
      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-navy/5" /> : <DataTable columns={columns} data={data} keyExtractor={(p) => p.id} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Ảnh sản phẩm</label>
            <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} category="product" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Tên sản phẩm</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Slug</label>
            <input className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Danh mục</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Mô tả</label>
            <textarea rows={3} className={inputClass + " resize-none"} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.name || saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá sản phẩm?"
        description={`Sản phẩm "${deleteTarget?.name}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

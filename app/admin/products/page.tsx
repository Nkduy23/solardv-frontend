"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { productsMock } from "@/mocks/products.mock";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";
const CATEGORIES = ["Tấm pin", "Biến tần", "Lưu trữ", "Phụ kiện"];
const EMPTY: Omit<Product, "id" | "image"> = { name: "", slug: "", category: CATEGORIES[0], description: "" };

export default function AdminProductsPage() {
  const [data, setData] = useState<Product[]>(productsMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id" | "image">>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(item: Product) {
    setEditTarget(item);
    setForm({ name: item.name, slug: item.slug, category: item.category, description: item.description });
    setModalOpen(true);
  }
  function handleSave() {
    if (editTarget) {
      setData((prev) => prev.map((p) => (p.id === editTarget.id ? { ...editTarget, ...form } : p)));
    } else {
      setData((prev) => [...prev, { id: `prod-${Date.now()}`, image: "", ...form }]);
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
      key: "name",
      header: "Sản phẩm",
      render: (p: Product) => <p className="font-medium text-navy">{p.name}</p>,
    },
    {
      key: "category",
      header: "Danh mục",
      render: (p: Product) => <span className="rounded-full bg-sunrise-amber/10 px-2.5 py-1 text-xs font-medium text-sunrise-copper">{p.category}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      className: "max-w-xs",
      render: (p: Product) => <span className="line-clamp-1 text-sm text-navy/60">{p.description}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p: Product) => (
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
      <AdminPageHeader title="Quản lý sản phẩm" description={`${data.length} sản phẩm`} action="Thêm sản phẩm" onAction={openCreate} />
      <DataTable columns={columns} data={data} keyExtractor={(p) => p.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Tên sản phẩm</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Tấm pin Mono PERC 550W" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Slug</label>
            <input className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="tam-pin-mono-perc-550w" />
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
          <p className="text-xs text-navy/40">Upload ảnh sẽ khả dụng khi nối backend (module media).</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.name}>
              Lưu
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

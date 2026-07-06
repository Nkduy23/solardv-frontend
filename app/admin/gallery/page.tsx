"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadMedia, getMediaFiles, deleteMedia, MediaFile } from "@/lib/api/media.api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Upload, X, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const CATEGORIES = ["handover", "project", "product"] as const;
const CATEGORY_LABEL: Record<string, string> = { handover: "bàn giao", project: "công trình", product: "sản phẩm", other: "khác" };
type Category = (typeof CATEGORIES)[number] | "tất cả";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("tất cả");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function load() {
    if (USE_MOCK) return;
    const files = await getMediaFiles();
    setItems(files);
  }
  useEffect(() => {
    load();
  }, []);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map((f) => uploadMedia(f, { category: "handover" })));
      setItems((prev) => [...uploaded, ...prev]);
      toast("Đã thêm ảnh thành công", "success");
    } catch (err: any) {
      toast(err?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMedia(deleteTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const filtered = activeCategory === "tất cả" ? items : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <AdminPageHeader title="Thư viện ảnh" description={`${items.length} ảnh`} />

      <div
        className={cn(
          "mb-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors",
          dragging ? "border-sunrise-amber bg-sunrise-amber/5" : "border-navy/15 hover:border-navy/30",
          uploading && "pointer-events-none opacity-60",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={28} className={cn("transition-colors", dragging ? "text-sunrise-amber" : "text-navy/30")} />
        <p className="text-sm font-medium text-navy/70">{uploading ? "Đang upload..." : "Kéo thả ảnh hoặc click để chọn"}</p>
        <p className="text-xs text-navy/40">PNG, JPG, WEBP — tối đa 10MB</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["tất cả", ...CATEGORIES] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors",
              activeCategory === cat ? "border-sunrise-amber bg-sunrise-amber text-navy" : "border-navy/15 text-navy/60 hover:border-navy/30",
            )}
          >
            {cat === "tất cả" ? cat : CATEGORY_LABEL[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-navy/10 bg-white py-20 text-navy/30">
          <Images size={40} />
          <p className="mt-3 text-sm">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-navy-light to-navy"
              >
                <img src={item.url} alt={item.originalName} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-navy/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => setDeleteTarget(item)} className="ml-auto flex size-7 items-center justify-center rounded-full bg-red-500/90 text-white">
                    <X size={13} />
                  </button>
                  <p className="truncate text-xs text-paper/80">{item.originalName}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá ảnh?"
        description={`Ảnh "${deleteTarget?.originalName}" sẽ bị xoá vĩnh viễn khỏi Cloudinary.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

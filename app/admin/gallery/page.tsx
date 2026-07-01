"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Upload, X, Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  name: string;
  /** URL tạm (object URL từ FileReader) — thay bằng URL thật từ backend sau */
  previewUrl: string;
  category: "bàn giao" | "công trình" | "sản phẩm";
}

const CATEGORIES: GalleryItem["category"][] = ["bàn giao", "công trình", "sản phẩm"];

// Mock: 6 ảnh placeholder
const initialItems: GalleryItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `img-${i + 1}`,
  name: `Ảnh mẫu ${i + 1}`,
  previewUrl: "",
  category: CATEGORIES[i % 3],
}));

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState<GalleryItem["category"] | "tất cả">("tất cả");
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = activeCategory === "tất cả" ? items : items.filter((i) => i.category === activeCategory);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newItems: GalleryItem[] = Array.from(files).map((file) => ({
      id: `img-${Date.now()}-${Math.random()}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      category: "bàn giao",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <AdminPageHeader title="Thư viện ảnh" description={`${items.length} ảnh · bàn giao, công trình, sản phẩm`} />

      {/* Upload dropzone */}
      <div
        className={cn(
          "mb-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors",
          dragging ? "border-sunrise-amber bg-sunrise-amber/5" : "border-navy/15 hover:border-navy/30",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <Upload size={28} className={cn("transition-colors", dragging ? "text-sunrise-amber" : "text-navy/30")} />
        <div className="text-center">
          <p className="text-sm font-medium text-navy/70">Kéo thả ảnh vào đây hoặc click để chọn</p>
          <p className="mt-1 text-xs text-navy/40">PNG, JPG, WEBP — tối đa 10MB mỗi ảnh</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["tất cả", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors",
              activeCategory === cat ? "border-sunrise-amber bg-sunrise-amber text-navy" : "border-navy/15 text-navy/60 hover:border-navy/30",
            )}
          >
            {cat}
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
                transition={{ duration: 0.2 }}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-navy-light to-navy"
              >
                {item.previewUrl && <img src={item.previewUrl} alt={item.name} className="absolute inset-0 h-full w-full object-cover" />}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-navy/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => setDeleteTarget(item)} className="ml-auto flex size-7 items-center justify-center rounded-full bg-red-500/90 text-white">
                    <X size={13} />
                  </button>
                  <div>
                    <span className="rounded-full bg-paper/20 px-2 py-0.5 text-[10px] capitalize text-paper backdrop-blur-sm">{item.category}</span>
                    <p className="mt-1 truncate text-xs text-paper/80">{item.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá ảnh?"
        description={`Ảnh "${deleteTarget?.name}" sẽ bị xoá vĩnh viễn.`}
        confirmLabel="Xoá"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

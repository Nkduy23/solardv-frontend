"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { postsMock } from "@/mocks/posts.mock";
import { Post } from "@/types/post";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";

export default function AdminPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Tìm bài viết từ mock — khi nối backend thay bằng GET /posts/:id
  const existing = postsMock.find((p) => p.id === id) ?? null;

  const [form, setForm] = useState<Omit<Post, "id" | "publishedAt">>({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    excerpt: existing?.excerpt ?? "",
    isPublished: existing?.isPublished ?? false,
  });

  // Nội dung bài viết đầy đủ — sẽ dùng rich text editor khi nối backend
  const [content, setContent] = useState("(Nội dung bài viết đầy đủ sẽ viết tại đây...)");

  const [saved, setSaved] = useState(false);

  function handleSave() {
    // TODO: gọi PATCH /posts/:id với { ...form, content } khi nối backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!existing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-navy/40">
        <p className="text-sm">Không tìm thấy bài viết.</p>
        <Button variant="ghost" className="mt-4 text-xs" onClick={() => router.back()}>
          <ArrowLeft size={14} /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex size-9 items-center justify-center rounded-full border border-navy/10 text-navy/50 hover:border-navy/30 hover:text-navy">
          <ArrowLeft size={16} />
        </button>
        <AdminPageHeader title={existing.title} description={`ID: ${existing.id}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Vùng soạn nội dung chính */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-navy/60">Tiêu đề</label>
                <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Tiêu đề bài viết..." />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-navy/60">Slug (URL)</label>
                <input className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="tieu-de-bai-viet" />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-navy/60">Tóm tắt</label>
                <textarea
                  rows={3}
                  className={cn(inputClass, "resize-none")}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Một đoạn ngắn mô tả bài viết..."
                />
              </div>
            </div>
          </div>

          {/* Khu vực nội dung đầy đủ — placeholder cho rich text editor */}
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-medium text-navy/60">Nội dung bài viết</label>
              <span className="rounded-full bg-sunrise-amber/10 px-2.5 py-1 text-[10px] font-medium text-sunrise-copper">Rich text editor — tích hợp khi nối backend</span>
            </div>
            <textarea rows={16} className={cn(inputClass, "resize-y font-mono text-xs leading-relaxed")} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </div>

        {/* Sidebar phải: publish & meta */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-navy/10 bg-white p-5">
            <p className="mb-4 text-xs font-medium text-navy/60">Xuất bản</p>

            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm text-navy/70">Đăng công khai</span>
              <div className={cn("relative h-5 w-9 rounded-full transition-colors", form.isPublished ? "bg-sunrise-amber" : "bg-navy/20")}>
                <div className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", form.isPublished ? "translate-x-4" : "translate-x-0.5")} />
              </div>
              <input type="checkbox" className="sr-only" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
            </label>

            <div className="mt-5 space-y-2">
              <Button variant="primary" className="w-full" onClick={handleSave} disabled={!form.title}>
                <Save size={14} />
                Lưu bài viết
              </Button>

              {saved && <p className="text-center text-xs text-emerald-600">Đã lưu thành công!</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-navy/10 bg-white p-5 text-xs text-navy/50">
            <p className="mb-2 font-medium text-navy/60">Thông tin</p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>ID</span>
                <span className="font-mono">{existing.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái</span>
                <span className={existing.isPublished ? "text-emerald-600" : "text-navy/40"}>{existing.isPublished ? "Đã đăng" : "Bản nháp"}</span>
              </div>
              {existing.publishedAt && (
                <div className="flex justify-between">
                  <span>Ngày đăng</span>
                  <span>{new Date(existing.publishedAt).toLocaleDateString("vi-VN")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

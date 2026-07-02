"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPostBySlug, updatePost } from "@/lib/api/posts.api";
import { postsMock } from "@/mocks/posts.mock";
import { Post } from "@/types/post";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none focus:border-sunrise-amber";

export default function AdminPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", isPublished: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let found: Post | undefined;
      if (USE_MOCK) {
        found = postsMock.find((p) => p.id === id);
      } else {
        // BE không có GET by id, dùng id làm slug tạm hoặc fetch list rồi find
        // TODO: thêm GET /posts/:id endpoint ở BE sau
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?limit=100`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("solardv_access_token")}` },
          });
          const json = await res.json();
          found = json.data?.find((p: Post) => p.id === id);
        } catch {
          found = undefined;
        }
      }
      if (found) {
        setPost(found);
        setContent((found as any).content ?? "");
        setForm({ title: found.title, slug: found.slug, excerpt: found.excerpt ?? "", isPublished: found.isPublished });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave() {
    if (!post) return;
    setSaving(true);
    try {
      if (!USE_MOCK) {
        await updatePost(post.id, { ...form, content });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-navy/5" />;
  if (!post)
    return (
      <div className="flex flex-col items-center py-20 text-navy/40">
        <p>Không tìm thấy bài viết.</p>
        <Button variant="ghost" className="mt-4 text-xs" onClick={() => router.back()}>
          <ArrowLeft size={14} /> Quay lại
        </Button>
      </div>
    );

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex size-9 items-center justify-center rounded-full border border-navy/10 text-navy/50 hover:border-navy/30 hover:text-navy">
          <ArrowLeft size={16} />
        </button>
        <AdminPageHeader title={post.title} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-navy/10 bg-white p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Tiêu đề</label>
              <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Slug</label>
              <input className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-navy/60">Tóm tắt</label>
              <textarea rows={3} className={inputClass + " resize-none"} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
            </div>
          </div>

          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-medium text-navy/60">Nội dung bài viết</label>
              <span className="rounded-full bg-sunrise-amber/10 px-2.5 py-1 text-[10px] font-medium text-sunrise-copper">Rich text editor — tích hợp sau</span>
            </div>
            <textarea
              rows={16}
              className={inputClass + " resize-y font-mono text-xs leading-relaxed"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung bài viết..."
            />
          </div>
        </div>

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
              <Button variant="primary" className="w-full" onClick={handleSave} disabled={saving || !form.title}>
                <Save size={14} /> {saving ? "Đang lưu..." : "Lưu bài viết"}
              </Button>
              {saved && <p className="text-center text-xs text-emerald-600">Đã lưu thành công!</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-navy/10 bg-white p-5 text-xs text-navy/50 space-y-1.5">
            <p className="mb-2 font-medium text-navy/60">Thông tin</p>
            <div className="flex justify-between">
              <span>ID</span>
              <span className="font-mono">{post.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái</span>
              <span className={post.isPublished ? "text-emerald-600" : "text-navy/40"}>{post.isPublished ? "Đã đăng" : "Bản nháp"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

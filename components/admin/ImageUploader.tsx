"use client";

import { useRef, useState } from "react";
import { uploadMedia, deleteMedia, MediaFile } from "@/lib/api/media.api";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  /** URL ảnh hiện tại (nếu đang sửa item đã có ảnh) */
  value?: string;
  /** Gọi khi upload xong, trả về URL để lưu vào form cha */
  onChange: (url: string) => void;
  category: "product" | "project" | "handover" | "other";
}

export function ImageUploader({ value, onChange, category }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const media: MediaFile = await uploadMedia(file, { category });
      setUploadedId(media.id);
      onChange(media.url);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (uploadedId) {
      try {
        await deleteMedia(uploadedId);
      } catch {
        /* ignore */
      }
    }
    setUploadedId(null);
    onChange("");
  }

  return (
    <div>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy/10">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <button type="button" onClick={handleRemove} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-600">
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy/15 text-navy/40 transition-colors hover:border-sunrise-amber hover:text-sunrise-copper",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs">{uploading ? "Đang upload..." : "Click để chọn ảnh"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

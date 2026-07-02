"use client";

import { useState } from "react";
import { createConsultation } from "@/lib/api/consultations.api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none transition-colors focus:border-sunrise-amber";

export function ConsultationFormQuick() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    const fd = new FormData(e.currentTarget);
    try {
      await createConsultation({
        fullName: fd.get("fullName") as string,
        phone: fd.get("phone") as string,
        message: (fd.get("message") as string) || undefined,
      });
      setStatus("success");
      form.reset();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center">
        <p className="font-display text-lg font-semibold text-navy">Đã gửi đăng ký thành công!</p>
        <p className="mt-2 text-sm text-navy/60">Đội ngũ SolarDV sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-navy/10 bg-white p-6">
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-navy/70">
          Họ và tên
        </label>
        <input id="fullName" name="fullName" required className={inputClass} placeholder="Nguyễn Văn A" />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-navy/70">
          Số điện thoại
        </label>
        <input id="phone" name="phone" required className={inputClass} placeholder="09xx xxx xxx" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-navy/70">
          Nhu cầu lắp đặt
        </label>
        <textarea id="message" name="message" rows={3} className={cn(inputClass, "resize-none")} placeholder="Mái nhà, công suất mong muốn..." />
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Gửi đăng ký"}
      </Button>

      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}

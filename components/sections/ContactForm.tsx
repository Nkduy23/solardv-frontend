"use client";

import { useState } from "react";
import { createConsultation } from "@/lib/api/consultations.api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none transition-colors focus:border-sunrise-amber";

export function ContactForm() {
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
        email: (fd.get("email") as string) || undefined,
        address: (fd.get("address") as string) || undefined,
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
      <div className="rounded-2xl border border-navy/10 bg-white p-10 text-center">
        <p className="font-display text-lg font-semibold text-navy">Cảm ơn bạn đã liên hệ!</p>
        <p className="mt-2 text-sm text-navy/60">SolarDV sẽ phản hồi trong vòng 24 giờ làm việc.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-navy/10 bg-white p-8">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-navy/70">
          Email
        </label>
        <input id="email" name="email" type="email" className={inputClass} placeholder="ban@email.com" />
      </div>
      <div>
        <label htmlFor="address" className="mb-1.5 block text-xs font-medium text-navy/70">
          Địa chỉ lắp đặt
        </label>
        <input id="address" name="address" className={inputClass} placeholder="Số nhà, đường, quận/huyện..." />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-navy/70">
          Nội dung cần tư vấn
        </label>
        <textarea id="message" name="message" rows={4} className={cn(inputClass, "resize-none")} placeholder="Mô tả nhu cầu, công suất mong muốn..." />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>
      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}

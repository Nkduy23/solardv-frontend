"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createConsultation } from "@/lib/api/consultations.api";
import { consultationQuickSchema, ConsultationQuickInput } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none transition-colors focus:border-sunrise-amber";
const errorInputClass = "border-red-300 focus:border-red-400";

export function ConsultationFormQuick() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationQuickInput>({
    resolver: zodResolver(consultationQuickSchema),
    mode: "onBlur", // báo lỗi ngay khi rời khỏi field, không cần đợi submit
  });

  async function onSubmit(data: ConsultationQuickInput) {
    setStatus("submitting");
    try {
      await createConsultation({
        fullName: data.fullName,
        phone: data.phone,
        message: data.message || undefined,
      });
      setStatus("success");
      reset();
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border border-navy/10 bg-white p-6">
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-navy/70">
          Họ và tên
        </label>
        <input id="fullName" className={cn(inputClass, errors.fullName && errorInputClass)} placeholder="Nguyễn Văn A" maxLength={100} {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-navy/70">
          Số điện thoại
        </label>
        <input id="phone" type="tel" inputMode="tel" className={cn(inputClass, errors.phone && errorInputClass)} placeholder="0912345678" maxLength={12} {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-navy/70">
          Nhu cầu lắp đặt
        </label>
        <textarea
          id="message"
          rows={3}
          maxLength={500}
          className={cn(inputClass, "resize-none", errors.message && errorInputClass)}
          placeholder="Mái nhà, công suất mong muốn..."
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Gửi đăng ký"}
      </Button>

      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}

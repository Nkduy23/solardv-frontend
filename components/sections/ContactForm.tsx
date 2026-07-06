"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createConsultation } from "@/lib/api/consultations.api";
import { contactFormSchema, ContactFormInput } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 outline-none transition-colors focus:border-sunrise-amber";
const errorInputClass = "border-red-300 focus:border-red-400";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: ContactFormInput) {
    setStatus("submitting");
    try {
      await createConsultation({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
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
      <div className="rounded-2xl border border-navy/10 bg-white p-10 text-center">
        <p className="font-display text-lg font-semibold text-navy">Cảm ơn bạn đã liên hệ!</p>
        <p className="mt-2 text-sm text-navy/60">SolarDV sẽ phản hồi trong vòng 24 giờ làm việc.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border border-navy/10 bg-white p-8">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-navy/70">
          Email
        </label>
        <input id="email" type="email" className={cn(inputClass, errors.email && errorInputClass)} placeholder="ban@email.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="address" className="mb-1.5 block text-xs font-medium text-navy/70">
          Địa chỉ lắp đặt
        </label>
        <input id="address" className={cn(inputClass, errors.address && errorInputClass)} placeholder="Số nhà, đường, quận/huyện..." maxLength={200} {...register("address")} />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-navy/70">
          Nội dung cần tư vấn
        </label>
        <textarea
          id="message"
          rows={4}
          maxLength={500}
          className={cn(inputClass, "resize-none", errors.message && errorInputClass)}
          placeholder="Mô tả nhu cầu, công suất mong muốn..."
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>

      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}

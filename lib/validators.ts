import { z } from "zod";

// Số điện thoại VN: bắt đầu 0 hoặc +84, đầu số di động hợp lệ (3/5/7/8/9), đúng 10 số (0xxxxxxxxx)
const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// Cho phép chữ cái (kể cả có dấu tiếng Việt) và khoảng trắng, không cho số/ký tự đặc biệt
const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

export const consultationQuickSchema = z.object({
  fullName: z.string().trim().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(100, "Họ và tên không được vượt quá 100 ký tự").regex(nameRegex, "Họ và tên chỉ được chứa chữ cái"),
  phone: z.string().trim().regex(phoneRegex, "Số điện thoại không hợp lệ (vd: 0912345678)"),
  message: z.string().max(500, "Nội dung không được vượt quá 500 ký tự").optional().or(z.literal("")),
});

export const contactFormSchema = consultationQuickSchema.extend({
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().trim().max(200, "Địa chỉ không được vượt quá 200 ký tự").optional().or(z.literal("")),
});

export type ConsultationQuickInput = z.infer<typeof consultationQuickSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;

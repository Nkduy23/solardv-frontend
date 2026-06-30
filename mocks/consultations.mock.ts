import { Consultation } from "@/types/consultation";

export const consultationsMock: Consultation[] = [
  {
    id: "c-1",
    fullName: "Trần Văn Bình",
    phone: "0901 234 567",
    message: "Muốn lắp hệ 8kWp cho nhà phố 2 tầng",
    status: "NEW",
    createdAt: "2026-06-29T08:30:00Z",
  },
  {
    id: "c-2",
    fullName: "Nguyễn Thị Hoa",
    phone: "0938 112 233",
    message: "Cần báo giá hệ thống cho xưởng may 500m²",
    status: "CONTACTED",
    createdAt: "2026-06-28T14:10:00Z",
  },
  {
    id: "c-3",
    fullName: "Lê Quốc Huy",
    phone: "0912 998 877",
    message: "Tư vấn gói lưu trữ pin cho hộ gia đình",
    status: "NEW",
    createdAt: "2026-06-28T09:05:00Z",
  },
  {
    id: "c-4",
    fullName: "Phạm Minh Đức",
    phone: "0977 445 566",
    message: "Đã lắp 1 hệ, cần báo giá mở rộng thêm",
    status: "DONE",
    createdAt: "2026-06-27T16:45:00Z",
  },
];

import path from "path";
import { AppError } from "../exceptions/AppError.js";

export const getMediaTypeFromUrl = (url) => {
  // 1. Dùng class URL để bóc tách pathname, loại bỏ các tham số ?width=500...
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname; // Kết quả luôn sạch, dạng: "/images/avatar.jpg"

  // 2. Lấy phần mở rộng từ pathname sạch
  const ext = path.extname(pathname).toLowerCase();

  // 3. Mở rộng danh sách các file phổ biến trên mạng xã hội
  const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv"];
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

  if (videoExtensions.includes(ext)) {
    return "video";
  }

  if (imageExtensions.includes(ext)) {
    return "image";
  }

  // 4. Nếu có đuôi file nhưng không nằm trong danh sách hỗ trợ
  throw new AppError("Định dạng file media không được hỗ trợ", 400);
};

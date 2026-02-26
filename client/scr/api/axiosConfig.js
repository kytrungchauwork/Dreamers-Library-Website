import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL của backend server
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout sau 10 giây
});

// Interceptor: Tự động thêm token vào header của mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý response và lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu token hết hạn (401)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔥 FIX: Chỉ reload nếu KHÔNG phải đang ở trang đăng nhập
      if (window.location.pathname !== "/dang-nhap") {
        window.location.href = "/dang-nhap";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

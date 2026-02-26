import React, { createContext, useState, useEffect } from "react";
import { authService } from "@/api/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- DERIVED STATE ---
  const isLoggedIn = !!user;
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isModerator = user?.role?.toLowerCase() === "moderator";

  // 1. Kiểm tra token khi app khởi động
  useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Không có token → chưa login (bình thường)
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();

      if (response?.success && response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        // Token không hợp lệ (backend xác nhận)
        logout();
      }
    } catch (error) {
      // ❗ CHỈ logout khi backend trả 401
      if (error.response?.status === 401) {
        logout();
      } else {
        console.warn("⚠️ Temporary auth error, keep session", error);
        // KHÔNG logout → tránh đá user khi reload
      }
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

  // 2. Hàm login
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      if (data.success || data.token) {
        // Lưu vào LocalStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "Đăng nhập thất bại.",
        };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi kết nối server.",
      };
    }
  };

  // 3. Hàm register
  const register = async (newUserData) => {
    try {
      const data = await authService.register(newUserData);

      if (data.success || data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Đăng ký thất bại" };
      }
    } catch (error) {
      console.error("❌ Register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng ký thất bại.",
      };
    }
  };

  // 4. Hàm social login
  const socialLogin = async (userData) => {
    try {
      const data = await authService.socialLogin(userData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        // Lưu ý: data.user phải được backend trả về
        const userObj = data.user || { ...userData, role: "user" };

        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);

        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      console.error("❌ Social login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập thất bại.",
      };
    }
  };

  // 5. Hàm logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Xóa các key cũ nếu có
    localStorage.removeItem("CURRENT_USER");

    setUser(null);
  };

  const value = {
    isLoggedIn,
    isAdmin,
    isModerator,
    user,
    loading,
    login,
    register,
    logout,
    socialLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "@/contexts/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, socialLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        provider: "google",
        providerId: user.uid,
      };

      const loginResult = await socialLogin(userData);

      if (loginResult.success) {
        navigate("/");
      } else {
        setError(loginResult.message);
      }
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setError("Đăng nhập Google thất bại.");
      }
    }
  };

  return (
    // Container chính, căn giữa nội dung
    <div className="w-full max-w-[400px] px-4 font-['Quicksand'] text-[#333]">
      <h2 className="text-[32px] font-bold text-center mb-[30px]">Đăng nhập</h2>

      {/* Social Login Buttons */}
      <div className="flex flex-col gap-[15px] mb-[25px]">
        <button
          className="flex items-center justify-center gap-[12px] w-full p-[12px] text-[16px] font-medium rounded-[8px] border border-[#ccc] bg-white hover:bg-[#f9f9f9] transition-colors"
          onClick={handleGoogleLogin}
          type="button"
        >
          <FcGoogle size={22} /> <span>Đăng nhập bằng Google</span>
        </button>
        <button
          className="flex items-center justify-center gap-[12px] w-full p-[12px] text-[16px] font-medium rounded-[8px] border border-[#ccc] bg-white hover:bg-[#f9f9f9] transition-colors"
          type="button"
        >
          <FaApple size={22} /> <span>Đăng nhập bằng Apple</span>
        </button>
      </div>

      {/* Divider OR */}
      <div className="flex items-center text-center my-[25px] text-[#aaa]">
        <div className="flex-1 border-b border-[#ddd]"></div>
        <span className="px-[15px] text-[14px]">HOẶC</span>
        <div className="flex-1 border-b border-[#ddd]"></div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-[20px]">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block mb-[8px] font-semibold text-[14px]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-[12px] border border-[#ccc] rounded-[8px] text-[16px] outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff]"
            placeholder="Nhập email của bạn"
          />
        </div>

        {/* Password Input - Sửa lỗi icon mắt */}
        <div>
          <label
            htmlFor="password"
            class="block mb-[8px] font-semibold text-[14px]"
          >
            Mật khẩu
          </label>
          <div className="relative">
            {" "}
            {/* Quan trọng: relative để icon absolute theo div này */}
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-[12px] pr-[45px] border border-[#ccc] rounded-[8px] text-[16px] outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff]"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#888] hover:text-[#333] cursor-pointer bg-transparent border-none flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot Password */}
        <div className="flex justify-between items-center text-[14px]">
          <label className="flex items-center gap-[6px] cursor-pointer select-none">
            <input type="checkbox" className="accent-[#007bff] w-4 h-4" />
            <span>Ghi nhớ tôi</span>
          </label>
          <Link
            to="/quen-mat-khau"
            className="text-[#007bff] hover:underline font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-[#dc3545] text-[14px] p-3 rounded-[8px] text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-[14px] text-[16px] font-bold text-white bg-[#007bff] border-none rounded-[8px] cursor-pointer hover:bg-[#0056b3] transition-colors shadow-sm active:scale-[0.99]"
        >
          Đăng nhập
        </button>
      </form>

      <p className="text-center mt-[25px] text-[14px] text-[#666]">
        Chưa có tài khoản?{" "}
        <Link
          to="/dang-ky"
          className="text-[#007bff] font-semibold hover:underline"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

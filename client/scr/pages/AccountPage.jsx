import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Thêm Link vào đây
import { AuthContext } from "@/contexts/AuthContext";

const AccountPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(user);

  if (!user) return null;

  // Lấy chữ cái đầu tiên của tên
  const getInitial = () => {
    const name = user.fullName || user.username || "U";
    return name.charAt(0).toUpperCase();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đã lưu thông tin:", formData);
    alert("Thông tin đã được cập nhật (giả lập)!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-[1100px] mx-auto my-[40px] font-['Quicksand'] px-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[60px] items-start">
        {/* CỘT TRÁI: FORM THÔNG TIN (Giữ nguyên) */}
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-[8px] font-semibold text-[14px]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full p-[14px] border border-[#ccc] rounded-[12px] text-[16px] bg-[#f0f0f0] cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="mb-[8px] font-semibold text-[14px]"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-[14px] border border-[#ccc] rounded-[12px] text-[16px] bg-white outline-none focus:border-[#007bff]"
              />
            </div>
            <div className="flex gap-[20px]">
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="birthDate"
                  className="mb-[8px] font-semibold text-[14px]"
                >
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full p-[14px] border border-[#ccc] rounded-[12px] text-[16px] bg-white"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="gender"
                  className="mb-[8px] font-semibold text-[14px]"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-[14px] border border-[#ccc] rounded-[12px] text-[16px] bg-white"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-[150px] p-[14px] text-[16px] font-bold text-white bg-[#007bff] border-none rounded-[8px] cursor-pointer mt-[10px] hover:bg-[#0056b3] transition-colors"
            >
              Xác nhận
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: AVATAR & ACTIONS */}
        <div className="flex flex-col items-center gap-[20px] bg-white p-8 rounded-2xl shadow-sm border border-[#eee]">
          <div className="w-[150px] h-[150px] mb-[10px]">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#007bff] flex items-center justify-center text-white text-[64px] font-bold shadow-inner select-none">
                {getInitial()}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="font-bold text-xl text-[#333]">
              {user.fullName || user.username}
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase text-blue-600 bg-blue-50 rounded-full italic">
              {user.role || "Thành viên"}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full mt-4">
            {/* NÚT ĐĂNG TRUYỆN MỚI */}
            <Link
              to="/upload-story"
              className="w-full p-[12px] text-[15px] font-bold text-white bg-[#28a745] border-none rounded-[8px] cursor-pointer hover:bg-[#218838] transition-colors text-center no-underline shadow-sm"
            >
              Đăng truyện mới
            </Link>

            <button
              className="w-full p-[12px] text-[15px] font-bold text-white bg-[#dc3545] border-none rounded-[8px] cursor-pointer hover:bg-[#c82333] transition-colors shadow-sm"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

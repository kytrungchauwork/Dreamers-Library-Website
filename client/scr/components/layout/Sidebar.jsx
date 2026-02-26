import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Kết hợp từ main
import logo from "@/assets/logo.png"; // Ưu tiên alias từ ĐAnh (hoặc dùng '../../' nếu dự án không cấu hình alias)
import { AiFillHome } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { BiLibrary } from "react-icons/bi";
import { BsGridFill } from "react-icons/bs";

import { AuthContext } from "@/contexts/AuthContext";
import { MdAdminPanelSettings } from "react-icons/md";


const Sidebar = () => {
  // Lấy thêm user từ context
  const { isLoggedIn, user, isAdmin, isModerator } = useContext(AuthContext);
  const location = useLocation(); // Khai báo nếu bạn muốn dùng location để làm gì đó khác

  const navItemClass = ({ isActive }) =>
    `text-[24px] no-underline p-[10px] rounded-[8px] transition-colors duration-200 ${
      isActive
        ? "text-[#007bff] bg-[#e6f2ff]"
        : "text-[#a0a0a0] hover:bg-[#f0f0f0]"
    }`;

  return (
    <aside className="w-[80px] h-full bg-transparent border-r border-[#e0e0e0] flex flex-col items-center pt-[20px]">
      <div>
        <NavLink to="/">
          <img src={logo} alt="Book Online Logo" className="w-[80px] h-auto" />
        </NavLink>
      </div>

      <nav className="mt-[40px] flex flex-col language-javascript gap-[25px]">
        <NavLink to="/" className={navItemClass}>
          <AiFillHome />
        </NavLink>

        <NavLink to="/history" className={navItemClass}>
          <FaHistory />
        </NavLink>

        <NavLink to="/library" className={navItemClass}>
          <BiLibrary />
        </NavLink>

        {/* 🔒 USER đã đăng nhập */}
        {isLoggedIn && (
          <NavLink to="/account" className={navItemClass}>
            <BsGridFill />
          </NavLink>
        )}

        {/* 🔒 ADMIN ONLY – KHÔNG hiện với USER */}
        {isLoggedIn && isAdmin && (
          <NavLink to="/admin" className={navItemClass}>
            <MdAdminPanelSettings />
          </NavLink>
        )}

        {/* 🔒 MODERATOR ONLY – KHÔNG hiện với USER */}
        {isLoggedIn && isModerator && (
          <NavLink to="/moderator" className={navItemClass}>
            <MdAdminPanelSettings />
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

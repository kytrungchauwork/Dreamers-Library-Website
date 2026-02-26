import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// Xóa FaUserCircle nếu bạn không dùng đến nữa
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoLogInOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { AuthContext } from "@/contexts/AuthContext";
import { removeVietnameseTones } from "@/string/stringHandle";
import { getAllStories } from "@/services/storyAPI";

const Header = () => {
  /* ===== NOTIFICATION ===== */
  const [showNotifications, setShowNotifications] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: "Truyện 'Lão Hạc' vừa được cập nhật chương mới",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      content: "Admin đã duyệt truyện của bạn",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      content: "Bạn có bình luận mới",
      time: "Hôm qua",
      read: true,
    },
    {
      id: 4,
      content: "Truyện bạn theo dõi có chương mới",
      time: "2 ngày trước",
      read: true,
    },
    {
      id: 5,
      content: "Hệ thống bảo trì lúc 23:00 hôm nay",
      time: "3 ngày trước",
      read: true,
    },
    {
      id: 6,
      content: "Bạn được gợi ý truyện mới phù hợp",
      time: "1 tuần trước",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  /* ===== HANDLERS ===== */
  const handleReadNotification = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
        setVisibleCount(5); // reset số lượng khi đóng
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { user, logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Logic lấy chữ cái đầu
  const getInitial = () => {
    const name = user?.fullName || user?.username || "U";
    return name.charAt(0).toUpperCase();
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      try {
        const res = await getAllStories({ limit: 100 });

        if (res.data.success) {
          const allStories = res.data.data;
          const normalizedSearch = removeVietnameseTones(value.toLowerCase());

          const filtered = allStories
            .filter((story) => {
              const normalizedTitle = removeVietnameseTones(
                story.title.toLowerCase()
              );
              const normalizedAuthor = removeVietnameseTones(
                story.author.toLowerCase()
              );
              return (
                normalizedTitle.includes(normalizedSearch) ||
                normalizedAuthor.includes(normalizedSearch)
              );
            })
            .slice(0, 5);

          setSuggestions(filtered);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleSuggestionClick = (storyId) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/truyen/${storyId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-[60px] bg-transparent border-b border-[#e0e0e0] flex items-center justify-between px-[20px]">
      {/* SEARCH BAR */}
      <div
        className="flex items-center bg-[#f5f5f5] rounded-[20px] px-[15px] py-[5px] relative w-[300px]"
        ref={searchRef}
      >
        <IoSearchOutline
          size={20}
          color="#555"
          className="cursor-pointer"
          onClick={handleSearchSubmit}
        />
        <input
          type="text"
          placeholder="Tìm kiếm sách, tác giả..."
          className="border-none outline-none bg-transparent pl-[10px] font-['Quicksand'] text-[14px] w-[250px]"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setShowSuggestions(true)}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-[#ddd] border-t-0 rounded-b-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] z-[1000] max-h-[300px] overflow-y-auto mt-[5px]">
            {suggestions.map((story) => (
              <div
                key={story.id}
                className="px-[15px] py-[10px] cursor-pointer border-b border-[#f0f0f0] flex flex-col last:border-none hover:bg-[#f9f9f9]"
                onClick={() => handleSuggestionClick(story.id)}
              >
                <span className="font-semibold text-[14px] text-[#333]">
                  {story.title}
                </span>
                <span className="text-[12px] text-[#888]">{story.author}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-[20px]">
        {/* LANGUAGE ICON */}
        <div className="flex items-center gap-[6px] cursor-pointer border border-[#eee] px-[8px] py-[4px] rounded-[15px] hover:bg-[#f9f9f9] transition-colors">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
            alt="Vietnam Flag"
            className="w-[20px] h-auto object-cover rounded-[2px] shadow-sm"
          />
          <span className="font-['Quicksand'] font-medium text-[14px] text-[#555]">
            VN
          </span>
        </div>

        {isLoggedIn ? (
          <>
            {/* ===== NOTIFICATION ===== */}
            <div className="relative" ref={notificationRef}>
              <div
                className="relative cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <IoNotificationsOutline size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-[6px] -right-[6px] bg-red-500 text-white text-[10px] px-[6px] rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {showNotifications && (
                <div className="absolute right-0 top-[35px] w-[320px] bg-white border rounded-[10px] shadow-lg z-[1000]">
                  <div className="px-[15px] py-[10px] border-b font-bold">
                    Thông báo
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications
                      .slice(0, visibleCount)
                      .map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleReadNotification(n.id)}
                          className={`px-[15px] py-[10px] border-b cursor-pointer hover:bg-[#f5f5f5]
                          ${!n.read ? 'bg-[#eef3ff]' : ''}`}
                        >
                          <div className="text-[14px]">{n.content}</div>
                          <div className="text-[12px] text-[#888] mt-[4px]">
                            {n.time}
                          </div>
                        </div>
                      ))}
                  </div>

                  {visibleCount < notifications.length && (
                    <div
                      onClick={() => setVisibleCount(notifications.length)}
                      className="text-center py-[10px] text-blue-600 cursor-pointer hover:bg-[#f9f9f9]"
                    >
                      Xem tất cả
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* USER INFO SECTION */}
            <Link to="/account" className="no-underline text-inherit">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-[36px] h-[36px] rounded-full mr-[10px] object-cover border border-[#ddd]"
                  />
                ) : (
                  /* KHUNG TRÒN CHỮ CÁI ĐẦU MẶC ĐỊNH */
                  <div className="w-[36px] h-[36px] rounded-full bg-[#007bff] mr-[10px] flex items-center justify-center text-white text-[14px] font-bold uppercase shadow-sm select-none">
                    {getInitial()}
                  </div>
                )}
                <span className="font-['Quicksand'] font-bold text-[14px] max-w-[100px] truncate">
                  {user ? user.fullName || user.username : "User"}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-[5px] bg-transparent border-none cursor-pointer font-['Quicksand'] text-[#555] hover:text-red-500 transition-colors"
            >
              <IoLogOutOutline size={22} />
            </button>
          </>
        ) : (
          <Link
            to="/dang-nhap"
            className="flex items-center gap-[8px] px-[16px] py-[8px] border border-[#ccc] rounded-[20px] no-underline text-[#333] font-['Quicksand'] font-medium hover:bg-[#f0f0f0] transition-colors duration-200"
          >
            <IoLogInOutline size={22} />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

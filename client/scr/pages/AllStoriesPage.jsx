import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa"; // Import icon Filter
import { IoChevronDown } from "react-icons/io5"; // Import icon mũi tên
import StoryCard from "@/components/StoryCard";
import Pagination from "@/components/common/Pagination";
import { getStoriesByFilter, getGenres } from "@/services/storyAPI";

const AllStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 = Tất cả
  const [loading, setLoading] = useState(true);

  // State cho Dropdown
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref để xử lý click ra ngoài thì đóng

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 1. Lấy danh sách thể loại
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await getGenres();
        if (res.data.success) {
          setGenres(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy thể loại:", err);
      }
    };
    fetchGenres();
  }, []);

  // 2. Lấy danh sách truyện
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await getStoriesByFilter({
          genreId: selectedGenre,
          limit: ITEMS_PER_PAGE,
          page: currentPage,
        });

        if (res.data.success) {
          const normalizedData = res.data.data.map((s) => ({
            ...s,
            coverImage: s.cover_image,
          }));
          setStories(normalizedData);

          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchStories();
  }, [currentPage, selectedGenre]);

  // 3. Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler chọn thể loại
  const handleGenreSelect = (id) => {
    setSelectedGenre(id);
    setCurrentPage(1);
    setIsFilterOpen(false); // Đóng menu sau khi chọn
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tìm tên thể loại đang chọn để hiển thị lên nút
  const currentGenreName =
    selectedGenre === 0
      ? "Tất cả"
      : genres.find((g) => g.id === selectedGenre)?.name || "Tất cả";

  return (
    <div className="max-w-[1200px] mx-auto my-[20px] px-[20px] font-['Quicksand'] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-[30px]">
        <h1 className="text-[28px] font-bold text-[#333] mb-4 md:mb-0">
          Khám phá truyện
        </h1>

        {/* --- NÚT FILTER DROPDOWN --- */}
        <div className="relative z-20" ref={dropdownRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              <span className="text-gray-600 text-sm">Thể loại:</span>
              <span className="font-bold text-[#333]">{currentGenreName}</span>
            </div>
            <IoChevronDown
              className={`text-gray-400 transition-transform duration-200 ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* MENU XỔ XUỐNG */}
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-[250px] bg-white border border-gray-100 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {/* Option: Tất cả */}
                <button
                  onClick={() => handleGenreSelect(0)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                    selectedGenre === 0
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  🌐 Tất cả
                </button>

                <div className="border-t my-1 border-gray-100"></div>

                {/* List thể loại từ API */}
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGenreSelect(g.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                      selectedGenre === g.id
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- DANH SÁCH TRUYỆN --- */}
      {loading ? (
        <div className="p-20 text-center text-gray-500">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p>Đang tải truyện...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-lg text-gray-500 font-medium">
            Chưa có truyện nào thuộc thể loại{" "}
            <span className="text-blue-600">"{currentGenreName}"</span>.
          </p>
          <button
            onClick={() => handleGenreSelect(0)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Quay lại xem tất cả
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[30px]">
            {stories.map((story) => (
              <Link
                key={story.id}
                to={`/truyen/${story.id}`}
                className="no-underline text-inherit transform hover:-translate-y-1 transition-transform duration-300"
              >
                <StoryCard story={story} />
              </Link>
            ))}
          </div>

          <div className="mt-10 mb-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AllStoriesPage;

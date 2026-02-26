import React, { useState } from "react";
import LibraryStoryCard from "../components/LibraryStoryCard";
import { useLibrary } from "@/contexts/libraryAPIContext";
import Pagination from "@/components/common/Pagination"; // Import Pagination

export default function LibraryPage() {
  const { libraryStories, removeFromLibrary, loading } = useLibrary();

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Tính toán dữ liệu cho trang hiện tại
  const totalPages = Math.ceil(libraryStories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStories = libraryStories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-['Quicksand']">
        Đang tải thư viện...
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto my-[20px] px-[20px] font-['Quicksand']">
      <h1 className="text-[28px] font-bold mb-[30px] text-[#333]">
        Kho truyện của tôi
      </h1>

      {libraryStories.length === 0 ? (
        <p className="text-[16px] text-[#666] mt-[20px]">
          Bạn chưa lưu truyện nào vào thư viện.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[30px]">
            {currentStories.map((story) => (
              <LibraryStoryCard
                key={story.id}
                story={story}
                onDelete={() => removeFromLibrary(story.id)}
              />
            ))}
          </div>

          {/* Thanh phân trang */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

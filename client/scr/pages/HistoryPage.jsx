import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import StoryCardHorizontal from "@/components/StoryCardHorizontal";
import Button from "@/components/button/Button";
import { getStoryById } from "@/services/storyAPI";

// Helper để lấy lịch sử từ LocalStorage (Giả sử bạn lưu dạng mảng ID: [1, 2, 3])
const getHistoryIds = () => {
  try {
    // Bạn cần đảm bảo khi đọc truyện, bạn đã lưu ID vào key này
    const history = JSON.parse(localStorage.getItem("READ_HISTORY") || "[]");
    return history;
  } catch {
    return [];
  }
};

const HistoryPage = () => {
  const [historyStories, setHistoryStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const ids = getHistoryIds(); // Lấy danh sách ID
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Gọi API lấy thông tin cho từng ID (Chạy song song)
        const promises = ids.map((id) => getStoryById(id));
        const responses = await Promise.all(promises);

        // Lọc những request thành công và map dữ liệu
        const validStories = responses
          .filter((res) => res.data.success)
          .map((res) => ({
            ...res.data.data,
            coverImage: res.data.data.cover_image, // Map lại ảnh
          }));

        setHistoryStories(validStories);
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleRemove = (id) => {
    // 1. Xóa khỏi state
    const newHistory = historyStories.filter((s) => s.id !== id);
    setHistoryStories(newHistory);

    // 2. Xóa khỏi LocalStorage
    const currentIds = getHistoryIds();
    const newIds = currentIds.filter((i) => i !== id);
    localStorage.setItem("READ_HISTORY", JSON.stringify(newIds));
  };

  if (loading)
    return (
      <div className="p-10 text-center font-['Quicksand']">
        Đang tải lịch sử...
      </div>
    );

  return (
    <div className="p-[60px] bg-[#e9fbfb] min-h-screen font-['Quicksand']">
      <h1 className="text-[24px] font-bold mb-[20px] text-[#333]">
        LỊCH SỬ ĐỌC
      </h1>

      {historyStories.length === 0 ? (
        <p className="text-center text-gray-500">Bạn chưa đọc truyện nào.</p>
      ) : (
        historyStories.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-[12px] p-[16px] shadow-sm border border-[#e0e0e0] mb-[24px]"
          >
            <StoryCardHorizontal story={book}>
              <div className="w-full flex flex-col gap-[12px] min-w-0">
                <div className="text-[20px] font-bold truncate text-[#333]">
                  {book.title}
                </div>

                {/* Các thông tin khác */}
                <div className="flex items-center gap-[8px] text-[14px] text-[#555]">
                  <span className="font-bold">{book.rating || 0}</span>
                  <AiFillStar className="text-yellow-400" />
                </div>

                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-600">{book.author}</div>
                  <button
                    onClick={() => handleRemove(book.id)}
                    className="p-2 hover:bg-gray-100 rounded text-gray-500"
                  >
                    <RxCross2 size={20} />
                  </button>
                </div>

                <Button to={`/truyen/${book.id}`} size="small">
                  Đọc tiếp
                </Button>
              </div>
            </StoryCardHorizontal>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPage;

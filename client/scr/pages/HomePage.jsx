import React, { useEffect, useState } from "react";
import StoryRow from "@/components/home/StoryRow";
import { getAllStories } from "@/services/storyAPI";

const HomePage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy 100 truyện về để lọc (Vì Backend chưa có chức năng sort, ta sort tạm ở FE)
        const res = await getAllStories({ limit: 100, page: 1 });

        if (res && res.data && res.data.success) {
          const normalizedData = res.data.data.map((story) => ({
            ...story,
            coverImage: story.cover_image, // Chuẩn hóa key ảnh
            rating: story.rating || 0,
            views: story.views || 0,
            // Giả sử có trường createdAt hoặc dùng id để xác định độ mới
            id: story.id,
          }));
          setStories(normalizedData);
        } else {
          setStories([]);
        }
      } catch (err) {
        console.error("HomePage Error:", err);
        setError("Không thể tải danh sách truyện.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= SORTING LOGIC (LẤY TOP 10) ================= */

  // 1. Truyện mới cập nhật: Sắp xếp theo ID giảm dần (ID lớn là mới tạo)
  const newUpdateStories = [...stories]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  // 2. Truyện xem nhiều: Sắp xếp theo views giảm dần
  const topViewedStories = [...stories]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // 3. Truyện đánh giá cao: Sắp xếp theo rating giảm dần
  const topRatedStories = [...stories]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  /* ================= RENDER ================= */

  if (loading)
    return (
      <div className="p-10 text-center font-['Quicksand']">
        Đang tải thư viện sách...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-['Quicksand'] font-bold">
        {error}
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto px-[20px] py-[20px]">
      {stories.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Chưa có truyện nào trong hệ thống.
        </div>
      ) : (
        <>
          {/* Mục 1: Mới cập nhật */}
          <StoryRow title="✨ Truyện mới cập nhật" stories={newUpdateStories} />

          {/* Mục 2: Xem nhiều nhất */}
          <StoryRow
            title="🔥 Truyện được xem nhiều"
            stories={topViewedStories}
          />

          {/* Mục 3: Đánh giá cao */}
          <StoryRow
            title="⭐ Truyện được đánh giá cao"
            stories={topRatedStories}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;

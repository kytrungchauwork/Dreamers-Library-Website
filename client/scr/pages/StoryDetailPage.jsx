import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

// Components
import StoryInfo from "@/components/detail/StoryInfo";
import ChapterList from "@/components/detail/ChapterList";
import StoryRow from "@/components/home/StoryRow";

// API Services
import { getStoryById } from "@/services/storyAPI";
import { getChaptersByStory } from "@/services/chapterAPI";
import { getRecommendations } from "@/services/recommendationAPI"; // <--- 2. Import Service mới
import { getBookmarkOfStory } from "@/services/bookmarkAPI";


const StoryDetailPage = () => {
  const { storyId } = useParams();
  const { user } = useContext(AuthContext);
  const isModerator = user?.role === "moderator";

  // State
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markedChapterId, setMarkedChapterId] = useState(null);
  const [error, setError] = useState(false); // Thêm state lỗi

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        window.scrollTo(0, 0);

        // Gọi song song 3 API (Truyện, Chương, Gợi ý) để tối ưu tốc độ
        const [storyRes, chaptersRes, recRes, bookmarkRes] = await Promise.all([
          getStoryById(storyId),
          getChaptersByStory(storyId),
          getRecommendations(storyId),
          user ? getBookmarkOfStory(storyId) : Promise.resolve(null),
        ]);

        if (bookmarkRes?.data?.success) {
          setMarkedChapterId(bookmarkRes.data.data?.chapter_id || null);
        }

        // Xử lý dữ liệu Truyện
        if (storyRes.data && storyRes.data.success) {
          const rawStory = storyRes.data.data;
          setStory({
            ...rawStory,
            coverImage: rawStory.cover_image, // Map field ảnh bìa
            rating: rawStory.rating || 0,
            reviewCount: 0,
            genres: rawStory.genres || [],
            source: "Sưu tầm",
          });
        }

        // Xử lý dữ liệu Chương
        if (chaptersRes.data && chaptersRes.data.success) {
          setChapters(chaptersRes.data.data);
        }

        // Xử lý dữ liệu Gợi ý (Recommendations)
        if (recRes.data && recRes.data.success) {
          // Map dữ liệu để khớp với StoryCard (cover_image -> coverImage)
          const recStories = recRes.data.data.map((s) => ({
            ...s,
            coverImage: s.cover_image || s.coverImage,
          }));
          setRecommendations(recStories); // <--- 5. Lưu vào state
        }
      } catch (error) {
        console.error("Lỗi tải trang chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId]);

  if (loading)
    return (
      <div className="p-10 text-center font-['Quicksand']">Đang tải...</div>
    );

  if (error || !story)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy truyện hoặc có lỗi xảy ra.
      </div>
    );

  if (story.status === "hidden" && !isModerator) {
    return (
      <div className="p-10 text-center text-gray-600">
        Truyện này hiện không khả dụng.
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto my-[40px] px-[20px] font-['Quicksand']">
      {/* Phần thông tin truyện */}
      <StoryInfo story={{ ...story, chapters: chapters }} markedChapterId={markedChapterId} />

      {chapters.length > 0 ? (
        <ChapterList chapters={chapters} storyId={story.id} markedChapterId={markedChapterId} />
      ) : (
        <div className="mt-10 text-center text-gray-500 bg-gray-50 p-5 rounded-lg border">
          Chưa có chương nào được đăng.
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <StoryRow
            title={
              <span className="flex items-center gap-2 text-purple-600">
                Có thể bạn sẽ thích
              </span>
            }
            stories={recommendations.slice(0, 4)}
            showViewAll={false}
          />
        </div>
      )}
    </div>
  );
};

export default StoryDetailPage;

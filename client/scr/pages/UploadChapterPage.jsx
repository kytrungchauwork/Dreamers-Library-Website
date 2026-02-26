import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getStoryById } from "@/services/storyAPI"; // API lấy truyện thật
import { createChapter as apiCreateChapter } from "@/services/chapterAPI"; // Đổi tên để tránh trùng

const UploadChapterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storyId = searchParams.get("storyId");

  const [story, setStory] = useState(null);
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy thông tin truyện để hiển thị
  useEffect(() => {
    if (storyId) {
      getStoryById(storyId).then((res) => {
        if (res.data.success) {
          setStory(res.data.data);
          // (Tạm thời chưa có API đếm số chương, nên cứ để user tự nhập số chương hoặc mặc định 1)
        }
      });
    }
  }, [storyId]);

  const handleSubmit = async () => {
    if (!content.trim() || !chapterTitle.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const chapterData = {
        story_id: storyId,
        title: chapterTitle,
        chapter_number: chapterNumber,
        content: content,
      };

      const res = await apiCreateChapter(chapterData);

      if (res.data.success) {
        alert("Đăng chương thành công!");
        // Reset form để đăng chương tiếp theo
        setChapterNumber((prev) => Number(prev) + 1);
        setChapterTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Lỗi đăng chương:", error);
      alert("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  if (!storyId) return <div className="p-10">Vui lòng chọn truyện trước.</div>;
  if (!story) return <div className="p-10">Đang tải thông tin truyện...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 font-['Quicksand']">
      <h1 className="text-2xl font-bold mb-6">
        Đăng chương mới cho:{" "}
        <span className="text-blue-600">{story.title}</span>
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Số chương
        </label>
        <input
          type="number"
          className="w-full bg-white text-black p-3 border rounded-lg"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Tiêu đề chương
        </label>
        <input
          type="text"
          className="w-full bg-white text-black p-3 border rounded-lg"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          placeholder="Ví dụ: Sự khởi đầu"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Nội dung</label>
        <textarea
          rows={12}
          className="w-full bg-white text-black p-3 border rounded-lg"
          placeholder="Nhập nội dung chương..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-white bg-green-600 font-bold text-lg px-6 py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Đang đăng..." : "Đăng chương"}
        </button>
      </div>
    </div>
  );
};

export default UploadChapterPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStory } from "@/services/storyAPI";

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    cover_image: "", // Hiện tại nhập URL ảnh
    status: "ongoing", // Mặc định
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mock upload ảnh (vì chưa có API upload file thật)
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạm thời dùng Blob URL để preview
      // Khi làm thật: Cần upload file lên server -> lấy URL -> set vào formData.cover_image
      const fakeUrl = "https://via.placeholder.com/220x330";
      setFormData({ ...formData, cover_image: fakeUrl });
      alert("Tính năng upload ảnh thật chưa có, đang dùng ảnh mẫu.");
    }
  };

  const handleContinue = async () => {
    if (!formData.title || !formData.author) {
      alert("Vui lòng nhập tên truyện và tác giả");
      return;
    }

    setLoading(true);
    try {
      const res = await createStory(formData);
      if (res.data.success) {
        const newStoryId = res.data.data.id;
        alert("Tạo truyện thành công!");
        // Chuyển sang trang đăng chương
        navigate(`/upload-chapter?storyId=${newStoryId}`);
      }
    } catch (error) {
      console.error("Lỗi tạo truyện:", error);
      alert("Có lỗi xảy ra khi tạo truyện.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-['Quicksand']">
      <h2 className="text-2xl font-bold mb-6">Đăng truyện mới</h2>

      <div className="flex gap-8">
        {/* COVER IMAGE */}
        <div className="flex flex-col items-center">
          <label className="w-56 h-80 bg-white border-2 border-dashed rounded-lg flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-100 transition overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            {formData.cover_image ? (
              <img
                src={formData.cover_image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-center px-2">Thêm ảnh bìa</span>
            )}
          </label>
        </div>

        {/* FIELDS */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Tiêu đề</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="Nhập tiêu đề truyện..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Giới thiệu</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="Mô tả ngắn về truyện..."
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tác giả</label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="Tên tác giả"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              URL Ảnh bìa (hoặc upload ở bên trái)
            </label>
            <input
              name="cover_image"
              value={formData.cover_image}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tình trạng</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white text-black"
            >
              <option value="ongoing">Đang tiến hành</option>
              <option value="completed">Hoàn thành</option>
              <option value="stopped">Tạm ngừng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="text-white bg-blue-600 font-bold text-lg px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Đang tạo..." : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
}

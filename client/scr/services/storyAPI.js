// Thay đổi import: dùng api từ axiosConfig thay vì axios từ utils
import api from "@/api/axiosConfig";

// Lấy danh sách truyện
// Xóa "/api" ở đường dẫn vì axiosConfig đã có baseURL là .../api
export const getAllStories = (params) => api.get("/stories", { params });

// Lấy chi tiết truyện
export const getStoryById = (id) => api.get(`/stories/${id}`);

// Tạo truyện
export const createStory = (data) => api.post("/stories", data);

export const updateStory = (id, data) => api.put(`/stories/${id}`, data);

export const deleteStory = (id) => api.delete(`/stories/${id}`);
export const getGenres = () => api.get("/stories/genres");

// 2. Lấy truyện theo bộ lọc (genreId, page, limit)
export const getStoriesByFilter = (params) =>
  api.get("/stories/filter", { params });

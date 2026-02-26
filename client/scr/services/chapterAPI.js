import api from "@/api/axiosConfig";

export const getChaptersByStory = (storyId) =>
  api.get(`/chapters/story/${storyId}`);

export const getChapterById = (id) => api.get(`/chapters/${id}`);

export const increaseChapterView = (id) => api.post(`/chapters/${id}/view`);

export const createChapter = (data) => api.post("/chapters", data);

export const updateChapter = (id, data) => api.put(`/chapters/${id}`, data);

export const deleteChapter = (id) => api.delete(`/chapters/${id}`);

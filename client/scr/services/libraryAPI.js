import api from "@/api/axiosConfig";

export const toggleLikeStory = (storyId) =>
  api.post(`/stories/${storyId}/like`);

export const getMyLibrary = () =>
  api.get("/me/library");

export const removeStoryFromLibrary = (storyId) =>
  api.delete(`/stories/${storyId}/library`);
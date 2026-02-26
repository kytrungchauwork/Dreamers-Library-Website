import api from "@/api/axiosConfig";

export const getRecommendations = (storyId) => {
  return api.get(`/stories/${storyId}/recommendations`);
};

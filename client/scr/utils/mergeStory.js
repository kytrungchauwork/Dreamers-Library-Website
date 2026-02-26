import { getStoryData } from "@/utils/storage";

export const mergeStoryData = (story) => {
  const stored = getStoryData(story.id) || {};

  return {
    ...story,
    ratingDetail: stored.ratingDetail || story.ratingDetail,
    views: stored.views ?? story.views
  };
};

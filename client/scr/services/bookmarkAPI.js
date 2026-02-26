// src/services/bookmarkAPI.js
import api from "@/api/axiosConfig";

/**
 * Bookmark / update chapter của 1 truyện
 * - Backend sẽ tự upsert (mỗi truyện chỉ 1 chapter)
 */
export const bookmarkChapter = ({ storyId, chapterId }) => api.post("/bookmarks", {
    storyId,
    chapterId,
  });

/**
 * Lấy bookmark của 1 truyện
 * - Dùng cho ReadingPage, StoryDetail
 */
export const getBookmarkOfStory = (storyId) => api.get(`/bookmarks/${storyId}`);

/**
 * Lấy toàn bộ bookmark của user
 * - Dùng cho Library / Continue Reading
 */
export const getMyBookmarks = () => api.get("/bookmarks");

/**
 * Bỏ bookmark của 1 truyện
 */
export const removeBookmark = (storyId) => api.delete(`/bookmarks/${storyId}`);

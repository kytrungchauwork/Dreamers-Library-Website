// controllers/bookmark.controller.js
import BookmarkModel from "../models/bookmarkModel.js";

export const bookmarkChapter = async (req, res) => {
  const userId = req.user.id;
  const { storyId, chapterId } = req.body;

  await BookmarkModel.upsert({ userId, storyId, chapterId });

  res.json({
    success: true,
    message: "Bookmark updated",
  });
};

export const getBookmarkOfStory = async (req, res) => {
  const userId = req.user.id;
  const { storyId } = req.params;

  const bookmark = await BookmarkModel.findByUserAndStory(
    userId,
    storyId
  );

  res.json({
    success: true,
    data: bookmark || null,
  });
};

export const getMyBookmarks = async (req, res) => {
  const userId = req.user.id;

  const bookmarks = await BookmarkModel.findAllByUser(userId);

  res.json({
    success: true,
    data: bookmarks,
  });
};

export const removeBookmark = async (req, res) => {
  const userId = req.user.id;
  const { storyId } = req.params;

  await BookmarkModel.remove(userId, storyId);

  res.json({
    success: true,
    message: "Bookmark removed",
  });
};
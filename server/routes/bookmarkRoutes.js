// routes/bookmark.route.js
import express from "express";
import {
  bookmarkChapter,
  getBookmarkOfStory,
  getMyBookmarks,
  removeBookmark,
} from "../controllers/bookmarkController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, bookmarkChapter);
router.get("/", authMiddleware, getMyBookmarks);
router.get("/:storyId", authMiddleware, getBookmarkOfStory);
router.delete("/:storyId", authMiddleware, removeBookmark);

export default router;

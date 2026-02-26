import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  toggleLikeStory,
  getMyLibrary,
  removeFromLibrary,
} from "../controllers/LibraryController.js";

const router = express.Router();

/** Toggle like (LIKE = ADD TO LIBRARY) */
router.post(
  "/stories/:storyId/like",
  authMiddleware,
  toggleLikeStory
);

/** Kho truyện cá nhân */
router.get(
  "/me/library",
  authMiddleware,
  getMyLibrary
);

/** Xóa hoàn toàn khỏi library (optional) */
router.delete(
  "/stories/:storyId/library",
  authMiddleware,
  removeFromLibrary
);

export default router;
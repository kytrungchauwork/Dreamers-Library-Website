import express from "express";
import {
  createChapter,
  getChapterById,
  getChaptersByStory,
  updateChapter,
  deleteChapter,
  increaseChapterView
} from "../controllers/chapterController.js";

const router = express.Router();

router.post("/", createChapter);
router.get("/:id", getChapterById);
router.get("/story/:storyId", getChaptersByStory);
router.put("/:id", updateChapter);
router.delete("/:id", deleteChapter);
router.post("/:id/view", increaseChapterView);

export default router;

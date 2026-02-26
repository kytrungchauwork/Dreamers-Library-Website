import express from "express";
import * as storyController from "../controllers/storyController.js";
import * as recommendationController from "../controllers/recommendationController.js"; // Import Controller mới
import * as filterController from "../controllers/filterController.js";

const router = express.Router();

// 1. CÁC ROUTE TĨNH PHẢI ĐẶT TRÊN CÙNG
router.get("/genres", filterController.getGenres);
router.get("/filter", filterController.filterStories);

// 2. ROUTE CÓ THAM SỐ CỤ THỂ
router.get(
  "/:id/recommendations",
  recommendationController.getStoryRecommendations
);

// 3. CÁC ROUTE CRUD
router.post("/", storyController.createStory);
router.get("/", storyController.getAllStories);

// 4. ROUTE DYNAMIC (/:id) PHẢI ĐẶT DƯỚI CÙNG
// Nếu đặt cái này lên đầu, nó sẽ tưởng "genres" là một cái "id" -> Lỗi
router.get("/:id", storyController.getStoryById);
router.put("/:id", storyController.updateStory);
router.delete("/:id", storyController.deleteStory);
router.get("/rating", storyController.getStoryRatingByUser);
router.post("/rating", storyController.rateStory);
router.get("/:id/rating", storyController.getStoryRating);
router.post("/:id/comments", storyController.addCommentToStory);
router.get("/:id/comments", storyController.getCommentsByStory);
router.post("/:id/hide-comment", storyController.hideComment);


export default router;

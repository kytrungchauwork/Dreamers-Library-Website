import StoryModel from "../models/storyModel.js";

// POST /api/stories
export const createStory = async (req, res) => {
  try {
    const id = await StoryModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: { id },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET /api/stories
export const getAllStories = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = Number(limit);
    page = Number(page);

    if (!Number.isInteger(limit) || limit <= 0) limit = 10;
    if (!Number.isInteger(page) || page <= 0) page = 1;

    const offset = (page - 1) * limit;

    // 1. Lấy danh sách truyện phân trang
    const stories = await StoryModel.findAll(limit, offset);

    // 2. 🔥 Lấy tổng số lượng truyện trong DB (Bạn cần thêm hàm này trong Model)
    // Giả sử StoryModel.countAll() trả về số nguyên (VD: "SELECT COUNT(*) FROM stories")
    const totalCount = await StoryModel.countAll();

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: stories,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET /api/stories/:id
export const getStoryById = async (req, res) => {
  try {
    const story = await StoryModel.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      data: story,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// PUT /api/stories/:id
export const updateStory = async (req, res) => {
  try {
    const affected = await StoryModel.update(req.params.id, req.body);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      message: "Story updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// DELETE /api/stories/:id
export const deleteStory = async (req, res) => {
  try {
    const affected = await StoryModel.delete(req.params.id);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getStoryRatingByUser = async (req, res) => {
  try {
    const storyId = req.body.storyId;
    const userId = req.body.userId;
    const rating = await RatingModel.getUserRating(storyId, userId);
    res.json({
      success: true,
      data: rating,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const rateStory = async (req, res) => {
  try {
    const storyId = req.body.storyId;
    const userId = req.body.userId;
    const { rating } = req.body;
    console.log('userId, storyId, rating', userId, storyId, rating);

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(rating)
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }
    const oldStar = await RatingModel.getUserRating(storyId, userId);
    console.log('oldStar', oldStar);
    if (oldStar && oldStar.rating) {
      // Cập nhật lại tổng điểm và tổng đánh giá
      await RatingModel.subRateStory(storyId, oldStar.rating);
    } 
    await RatingModel.rateStoryByUser(storyId, userId, rating);
    await RatingModel.rateStory(storyId, rating);
    res.json({
      success: true,
      message: "Rating submitted successfully",
    });
    console.log('Rated successfully');
    // await RatingModel
  } catch (err) {
    console.error('Error in rateStory controller:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
export const getStoryRating = async (req, res) => {
  try {
    const storyId = req.params.id;
    const ratingData = await RatingModel.getStoryRating(storyId);
    let rating = 0;
    if (ratingData.total_review > 0) {
      rating = ratingData.sum_review / ratingData.total_review;
    }
    ratingData.rating = rating;
    console.log('ratingData', ratingData);
    res.json({
      success: true,
      data: ratingData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
export const addCommentToStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const { userId, comment } = req.body;
    if (!userId || !comment) {
      return res.status(400).json({ success: false, message: 'userId and comment are required' });
    }
    await CommentModel.addComment(storyId, userId, comment);
    res.json({ success: true, message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
} 
export const getCommentsByStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const comments = await CommentModel.getComments(storyId);
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
export const hideComment = async (req, res) => {
  try {
    const storyId = req.params.id;
    const { commentId, isHidden } = req.body;
    if (!commentId || typeof isHidden !== 'boolean') {
      return res.status(400).json({ success: false, message: 'commentId and isHidden are required' });
    }
    await CommentModel.hideComment(commentId, isHidden);
    res.json({ success: true, message: 'Comment visibility updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
import { UserLibraryModel } from "../models/LibraryModel.js";

export const toggleLikeStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const liked = await UserLibraryModel.isLiked(userId, storyId);

    if (liked) {
      await UserLibraryModel.unlike(userId, storyId);
    } else {
      await UserLibraryModel.like(userId, storyId);
    }

    const totalLikes = await UserLibraryModel.countLikes(storyId);

    res.json({
      success: true,
      liked: !liked,
      totalLikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
};

/** Lấy kho truyện cá nhân */
export const getMyLibrary = async (req, res) => {
  try {
    const userId = req.user.id;

    const library = await UserLibraryModel.getLibraryByUser(userId);

    res.json({
      success: true,
      data: library,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get library",
    });
  }
};

/** Xóa hẳn khỏi library (nếu cần) */
export const removeFromLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    await UserLibraryModel.remove(userId, storyId);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to remove story from library",
    });
  }
};

import ChapterModel from "../models/chapterModel.js";

// CREATE
export const createChapter = async (req, res) => {
  try {
    const chapterId = await ChapterModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: { id: chapterId }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Create chapter failed",
      error: err.message
    });
  }
};

// GET BY ID
export const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await ChapterModel.findById(id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    res.json({
      success: true,
      data: chapter
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get chapter failed",
      error: err.message
    });
  }
};

// GET BY STORY
export const getChaptersByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const chapters = await ChapterModel.findByStoryId(storyId);

    res.json({
      success: true,
      data: chapters
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get chapters failed",
      error: err.message
    });
  }
};

// UPDATE
export const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const affected = await ChapterModel.update(id, req.body);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    res.json({
      success: true,
      message: "Chapter updated successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update chapter failed",
      error: err.message
    });
  }
};

// DELETE
export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const affected = await ChapterModel.delete(id);

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    res.json({
      success: true,
      message: "Chapter deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete chapter failed",
      error: err.message
    });
  }
};

// INCREASE VIEWS
export const increaseChapterView = async (req, res) => {
  try {
    const { id } = req.params;
    await ChapterModel.increaseViews(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

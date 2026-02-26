import FilterModel from "../models/filterModel.js";

// Lấy danh sách thể loại
export const getGenres = async (req, res) => {
  try {
    const genres = await FilterModel.getAllGenres();
    res.json({ success: true, data: genres });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Lọc truyện
export const filterStories = async (req, res) => {
  try {
    let { genreId, limit, page } = req.query;

    limit = Number(limit) || 10;
    page = Number(page) || 1;
    genreId = genreId && genreId !== "0" ? Number(genreId) : null; // Nếu genreId = 0 hoặc null thì lấy tất cả

    const offset = (page - 1) * limit;

    const stories = await FilterModel.findStoriesByGenre(
      genreId,
      limit,
      offset
    );
    const totalCount = await FilterModel.countStoriesByGenre(genreId);
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
    res.status(500).json({ success: false, error: err.message });
  }
};

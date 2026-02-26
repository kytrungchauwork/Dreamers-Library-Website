import db from "../config/db.js";

class FilterModel {
  // 1. Lấy tất cả thể loại để hiển thị lên Menu
  static async getAllGenres() {
    const [rows] = await db.execute("SELECT * FROM genres ORDER BY name ASC");
    return rows;
  }

  // 2. Lọc truyện theo thể loại (có phân trang)
  static async findStoriesByGenre(genreId, limit = 10, offset = 0) {
    let query = "";
    let params = [];

    if (genreId) {
      // Nếu có chọn thể loại -> JOIN với bảng story_genres
      query = `
        SELECT s.*, COUNT(c.id) as total_chapters
        FROM stories s
        JOIN story_genres sg ON s.id = sg.story_id
        LEFT JOIN chapters c ON s.id = c.story_id
        WHERE sg.genre_id = ?
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      params = [genreId];
    } else {
      // Nếu chọn "Tất cả" (genreId = null/0) -> Dùng logic cũ
      query = `
        SELECT s.*, COUNT(c.id) as total_chapters
        FROM stories s
        LEFT JOIN chapters c ON s.id = c.story_id
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      params = [];
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // 3. Đếm tổng số truyện theo thể loại (để làm phân trang)
  static async countStoriesByGenre(genreId) {
    let query = "";
    let params = [];

    if (genreId) {
      query = `
        SELECT COUNT(DISTINCT s.id) as total
        FROM stories s
        JOIN story_genres sg ON s.id = sg.story_id
        WHERE sg.genre_id = ?
      `;
      params = [genreId];
    } else {
      query = "SELECT COUNT(*) as total FROM stories";
    }

    const [rows] = await db.execute(query, params);
    return rows[0].total;
  }
}

export default FilterModel;

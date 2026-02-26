import db from "../config/db.js";

class StoryModel {
  // Create
  static async create(data) {
    const { title, author, description, cover_image, status } = data;
    const [result] = await db.execute(
      `INSERT INTO stories (title, author, description, cover_image, status)
       VALUES (?, ?, ?, ?, ?)`,
      [title, author, description, cover_image, status]
    );
    return result.insertId;
  }

  // Read all (pagination)
  static async findAll(limit = 10, offset = 0) {
    // Lưu ý: Đảm bảo limit và offset là số để tránh SQL Injection khi nối chuỗi
    // Hoặc dùng tham số ? nếu driver mysql2 cho phép (thường limit/offset hay bị lỗi quote '10')
    const query = `SELECT * FROM stories ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query);
    return rows;
  }

  // 🔥 ĐÃ SỬA LẠI CÚ PHÁP ĐÚNG
  static async countAll() {
    // Đếm tổng số dòng trong bảng stories
    const [rows] = await db.execute("SELECT COUNT(*) as total FROM stories");
    return rows[0].total;
  }

  // Read by id
  static async findById(id) {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT g.name SEPARATOR ',') AS genres
      FROM stories s
      LEFT JOIN story_genres sg ON s.id = sg.story_id
      LEFT JOIN genres g ON sg.genre_id = g.id
      WHERE s.id = ?
      GROUP BY s.id
    `;

    const [rows] = await db.execute(query, [id]);

    if (!rows[0]) return null;

    return {
      ...rows[0],
      // Kiểm tra kỹ genres trước khi split để tránh lỗi null
      genres: rows[0].genres ? rows[0].genres.split(",") : [],
    };
  }

  // Update
  static async update(id, data) {
    // 1. Lấy dữ liệu cũ trước để giữ nguyên những cái không gửi lên
    const [existing] = await db.execute("SELECT * FROM stories WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) return 0;
    const oldStory = existing[0];

    // 2. Merge dữ liệu mới vào dữ liệu cũ
    const title = data.title || oldStory.title;
    const author = data.author || oldStory.author;
    const description = data.description || oldStory.description;
    const cover_image = data.cover_image || oldStory.cover_image;
    const status = data.status || oldStory.status;

    // 3. Update
    const [result] = await db.execute(
      `UPDATE stories
       SET title=?, author=?, description=?, cover_image=?, status=?
       WHERE id=?`,
      [title, author, description, cover_image, status, id]
    );
    return result.affectedRows;
  }

  // Delete
  static async delete(id) {
    const [result] = await db.execute(`DELETE FROM stories WHERE id=?`, [id]);
    return result.affectedRows;
  }
}

export default StoryModel;

import db from "../config/db.js";

export class UserLibraryModel {
  /** Like = add to library */
  static async like(userId, storyId) {
    const sql = `
      INSERT INTO user_library (user_id, story_id, is_liked)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE is_liked = 1
    `;
    await db.execute(sql, [userId, storyId]);
  }

  /** Unlike = set is_liked = 0 (không xóa record) */
  static async unlike(userId, storyId) {
    const sql = `
      UPDATE user_library
      SET is_liked = 0
      WHERE user_id = ? AND story_id = ?
    `;
    await db.execute(sql, [userId, storyId]);
  }

  /** Check liked */
  static async isLiked(userId, storyId) {
    const sql = `
      SELECT is_liked
      FROM user_library
      WHERE user_id = ? AND story_id = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(sql, [userId, storyId]);
    return rows.length > 0 && rows[0].is_liked === 1;
  }

  /** Count like của 1 truyện */
  static async countLikes(storyId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM user_library
      WHERE story_id = ? AND is_liked = 1
    `;
    const [[row]] = await db.execute(sql, [storyId]);
    return row.total;
  }

  /** Lấy kho truyện cá nhân (chỉ is_liked = 1) */
  static async getLibraryByUser(userId) {
    const sql = `
      SELECT
        s.id,
        s.title,
        s.author,
        s.cover_image,
        s.status,
        ul.updated_at AS liked_at
      FROM user_library ul
      JOIN stories s ON s.id = ul.story_id
      WHERE ul.user_id = ?
        AND ul.is_liked = 1
      ORDER BY ul.updated_at DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  /** Xóa hoàn toàn khỏi library (optional) */
  static async remove(userId, storyId) {
    const sql = `
      DELETE FROM user_library
      WHERE user_id = ? AND story_id = ?
    `;
    await db.execute(sql, [userId, storyId]);
  }
}

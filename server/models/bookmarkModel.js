// models/BookmarkModel.js
import db from "../config/db.js";

export default class BookmarkModel {
  static async upsert({ userId, storyId, chapterId }) {
    const sql = `
      INSERT INTO bookmarks (user_id, story_id, chapter_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        chapter_id = VALUES(chapter_id),
        updated_at = CURRENT_TIMESTAMP
    `;
    await db.execute(sql, [userId, storyId, chapterId]);
  }

  static async findByUserAndStory(userId, storyId) {
    const [rows] = await db.execute(
      `SELECT * FROM bookmarks WHERE user_id = ? AND story_id = ?`,
      [userId, storyId]
    );
    return rows[0];
  }

  static async findAllByUser(userId) {
    const [rows] = await db.execute(
      `
      SELECT 
        b.*, 
        s.title, s.cover_image,
        c.title AS chapter_title, c.chapter_number
      FROM bookmarks b
      JOIN stories s ON s.id = b.story_id
      JOIN chapters c ON c.id = b.chapter_id
      WHERE b.user_id = ?
      ORDER BY b.updated_at DESC
      `,
      [userId]
    );
    return rows;
  }

  static async remove(userId, storyId) {
    await db.execute(
      `DELETE FROM bookmarks WHERE user_id = ? AND story_id = ?`,
      [userId, storyId]
    );
  }
}
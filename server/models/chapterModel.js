import db from "../config/db.js";

const ChapterModel = {
  async create(data) {
    const { story_id, title, chapter_number, content } = data;

    const [result] = await db.query(
      `INSERT INTO chapters (story_id, title, chapter_number, content)
       VALUES (?, ?, ?, ?)`,
      [story_id, title, chapter_number, content]
    );

    return result.insertId;
  },

  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM chapters WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async findByStoryId(storyId) {
    const [rows] = await db.query(
      `SELECT * FROM chapters 
       WHERE story_id = ?
       ORDER BY chapter_number ASC`,
      [storyId]
    );
    return rows;
  },

  async update(id, data) {
    const { title, chapter_number, content } = data;

    const [result] = await db.query(
      `UPDATE chapters
       SET title = ?, chapter_number = ?, content = ?
       WHERE id = ?`,
      [title, chapter_number, content, id]
    );

    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.query(
      "DELETE FROM chapters WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },

  async increaseViews(id) {
    await db.query(
      "UPDATE chapters SET views = views + 1 WHERE id = ?",
      [id]
    );
  }
};

export default ChapterModel;

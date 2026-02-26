import { db } from '../config/db.js';

class History {
    // Lưu lịch sử đọc truyện
    static async saveHistory(userId, storyId) {
        // Nếu đã có thì cập nhật updated_at, chưa có thì insert mới
        await db.execute(
            `INSERT INTO history (user_id, story_id, updated_at) VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE updated_at = NOW()`,
            [userId, storyId]
        );
    }

    // Lấy lịch sử đọc của user
    static async getUserHistory(userId) {
        const [rows] = await db.execute(
            `SELECT * FROM history WHERE user_id = ? ORDER BY updated_at DESC`,
            [userId]
        );
        return rows;
    }
}

export default History;
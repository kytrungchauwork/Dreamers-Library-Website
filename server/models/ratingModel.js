import { db } from '../config/db.js';

class Rating {
    // Lấy đánh giá của truyện
    // static async re
    static async subRateStory(storyId, rating) {
        return db.execute(
            `UPDATE stories
                SET total_review = total_review - 1, sum_review = sum_review - ?
                WHERE id = ?`,
            [rating, storyId]
        );
    }
    static async getStoryRating(storyId) {
        const [rows] = await db.execute(
            `SELECT total_review, sum_review 
             FROM stories   
                WHERE id = ?`,  
            [storyId]
        );
        return rows[0];
    }
    static async getUserRating(storyId, userId) {
        const [rows] = await db.execute(
            `SELECT rating
                FROM rating
                WHERE story_id = ? AND user_id = ?`,
            [storyId, userId]
        );
        return rows[0];
    }
    // Đánh giá truyện
    static async rateStoryByUser(storyId, userId, rating) {
        // Lưu đánh giá của user vào bảng ratings
        await db.execute(
            `INSERT INTO rating (story_id, user_id, rating, created_at) VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE rating = ?, created_at = NOW()`,
            [storyId, userId, rating, rating]
        );
    }
    static async rateStory(storyId, rating) {
        // Cập nhật tổng số đánh giá và tổng điểm đánh giá
        return db.execute(
            `UPDATE stories 
             SET total_review = total_review + 1, sum_review = sum_review + ?
                WHERE id = ?`,
            [rating, storyId]
        );
    }
}
export default Rating;
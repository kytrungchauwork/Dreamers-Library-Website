import { db } from '../config/db.js';
class Comment {
    // Thêm bình luận cho truyện
    static async addComment(storyId, userId, content) { 
        return db.execute(
            `INSERT INTO comments (story_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`,
            [storyId, userId, content]
        );
    }   
    // Lấy bình luận của truyện
    static async getCommentsByStory(storyId) {
        const [rows] = await db.execute(
            `SELECT c.id, c.story_id, c.user_id, c.content, c.created_at, u.username, u.avatar
             FROM comments c
             JOIN users u ON c.user_id = u.id
                WHERE c.story_id = ?
                AND c.is_hidden = false
                ORDER BY c.created_at DESC`,
            [storyId]
        );
        return rows;
    }
    // Backwards-compatible alias expected by controllers
    static async getComments(storyId) {
        return this.getCommentsByStory(storyId);
    }
    static async hideComment(commentId, isHidden) {
        return db.execute(
            `UPDATE comments SET is_hidden = ? WHERE id = ?`,
            [isHidden, commentId]
        );
    }
}
export default Comment;
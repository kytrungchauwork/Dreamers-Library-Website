    // Ban user (nếu chưa bị ban)

// models/userModel.js
import { db } from '../config/db.js';

class User {
    // Tìm user bằng email
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    // Tạo user mới (Sign Up)
    static async create({ username, email, password_hash }) {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );
        return result.insertId;
    }

    // Tìm thông tin Social Login
    static async findSocialLogin(provider, provider_id) {
        const [rows] = await db.execute(
            'SELECT * FROM social_logins WHERE provider = ? AND provider_id = ?',
            [provider, provider_id]
        );
        return rows[0];
    }

    // Tạo liên kết Social Login
    static async createSocialLogin(userId, provider, providerId) {
        return db.execute(
            'INSERT INTO social_logins (user_id, provider, provider_id) VALUES (?, ?, ?)',
            [userId, provider, providerId]
        );
    }

    // Xử lý Logic Khóa tài khoản (Account Lock)
    static async incrementFailedAttempts(userId) {
        // Tăng số lần sai
        await db.execute(
            'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?',
            [userId]
        );
        
        // Check xem đã quá 5 lần chưa, nếu quá thì khóa 30 phút
        const [rows] = await db.execute('SELECT failed_login_attempts FROM users WHERE id = ?', [userId]);
        if (rows[0].failed_login_attempts >= 5) {
            const lockTime = new Date(Date.now() + 30 * 60 * 1000); // +30 phút
            await db.execute(
                'UPDATE users SET lockout_until = ? WHERE id = ?',
                [lockTime, userId]
            );
        }
    }

    static async resetFailedAttempts(userId) {
        return db.execute(
            'UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = ?',
            [userId]
        );
    }

    // Lưu reset token
    static async saveResetToken(email, token, expiresAt) {
        return db.execute(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
            [token, expiresAt, email]
        );
    }

    // Tìm user bằng reset token
    static async findByResetToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
            [token]
        );
        return rows[0];
    }

    // Xóa reset token sau khi dùng
    static async clearResetToken(userId) {
        return db.execute(
            'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [userId]
        );
    }

    // Cập nhật mật khẩu
    static async updatePassword(userId, newPasswordHash) {
        return db.execute(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [newPasswordHash, userId]
        );
    }
    static async banUser(userId) {
        // Kiểm tra đã bị ban chưa
        const [rows] = await db.execute('SELECT is_banned FROM users WHERE id = ?', [userId]);
        if (!rows.length) return { success: false, message: 'User không tồn tại' };
        if (rows[0].is_banned) return { success: false, message: 'User đã bị ban' };
        await db.execute('UPDATE users SET is_banned = 1 WHERE id = ?', [userId]);
        return { success: true, message: 'Ban user thành công' };
    }

    static async updateProfile(userId, profileData) {
        const fields = [];
        const values = [];
        for (const key in profileData) {
            fields.push(`${key} = ?`);
            values.push(profileData[key]);
        }
        values.push(userId); // Keep this line as part of the robust version
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`; // Keep this line as part of the robust version
        try { // Keep this line as part of the robust version
            console.log('Executing SQL:', sql, 'with values:', values); // Keep this line as part of the robust version
            const [result] = await db.execute(sql, values); // Keep this line as part of the robust version
            return { success: true, affectedRows: result.affectedRows }; // Keep this line as part of the robust version
        } catch (error) { // Keep this line as part of the robust version
            console.error('Error executing updateProfile SQL:', error?.message || error); // Keep this line as part of the robust version
            return { success: false, message: error?.message || String(error) }; // Keep this line as part of the robust version
        } // Keep this line as part of the robust version
    }
}

export default User;
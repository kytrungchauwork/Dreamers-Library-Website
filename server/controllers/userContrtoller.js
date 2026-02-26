// Ban user

import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { sendResetPasswordEmail } from '../utils/emailService.js';
import History from '../models/historyModel.js';


// Lưu lịch sử đọc truyện
export const saveHistory = async (req, res) => {
	try {
		const { userId, storyId } = req.body;
		if (!userId || !storyId) {
			return res.status(400).json({ message: 'userId và storyId là bắt buộc' });
		}
		await History.saveHistory(userId, storyId);
		res.status(200).json({ message: 'Lưu lịch sử thành công' });
	} catch (error) {
		res.status(500).json({ message: 'Lỗi server', error: error.message });
	}
};
export const banUser = async (req, res) => {
	console.log("bann ")
	try {
		// Support receiving userId from params, query or body
		const userId = req.params?.userId || req.query?.userId || req.body?.userId;
		console.log('userID', userId);
		if (!userId) {
			return res.status(400).json({ message: 'userId là bắt buộc' });
		}
		const result = await User.banUser(userId);
		if (result.success) {
			res.status(200).json({ message: result.message });
		} else {
			res.status(400).json({ message: result.message });
		}
	} catch (error) {
		res.status(500).json({ message: 'Lỗi server', error: error.message });
	}
};


// Lấy lịch sử đọc của user kèm thông tin truyện (title, cover_image, author, description)
export const getHistory = async (req, res) => {
	try {
		const userId = req.params.userId || req.query.userId;
		if (!userId) {
			return res.status(400).json({ message: 'userId là bắt buộc' });
		}

		const [rows] = await db.execute(
			`SELECT h.story_id
			 FROM history h
			 WHERE h.user_id = ?
			 ORDER BY h.updated_at DESC`,
			[userId]
		);

		// Chuẩn hóa thành mảng ID: [{story_id: 1}, ...] => [1, ...]
		const ids = (rows || [])
			.map(r => (r && (r.story_id ?? r.id) != null ? Number(r.story_id ?? r.id) : null))
			.filter(Number.isFinite);

		// Trả về wrapper để client dễ xử lý
		console.log('ids', ids);
		res.status(200).json( ids );
	} catch (error) {
		res.status(500).json({ message: 'Lỗi server', error: error.message });
	}
};
export const updateProfile = async (req, res) => {
	try {
		const { id, fullName,gender,birthDate } = req.body;
		console.log('updateProfile called with:', id, fullName);
		if (!id) {
			return res.status(400).json({ message: 'ID là bắt buộc' });
		}
		
		const result = await User.updateProfile(id, { full_name: fullName, gender, birth_date: birthDate });
		if (result.success) {
			res.status(200).json({ message: result.message });
			console.log('Profile updated successfully for user ID:', id);
		}
		else {
			res.status(400).json({ message: result.message });
			console.log('Failed to update profile for user ID:', id);
		}
	} catch (error) {
		res.status(500).json({ message: 'Lỗi server', error: error.message });
		console.error('Error updating profile:', error);
	}
};
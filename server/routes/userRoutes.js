import express from 'express';
import { saveHistory, banUser, getHistory, updateProfile } from '../controllers/userContrtoller.js';

const router = express.Router();

// Lưu lịch sử đọc truyện
router.post('/history', saveHistory);

// Lấy lịch sử đọc kèm thông tin truyện
router.get('/history/:userId', getHistory);

// Ban user
router.post('/ban/:userId', banUser);

router.put('/profile', updateProfile);

export default router;

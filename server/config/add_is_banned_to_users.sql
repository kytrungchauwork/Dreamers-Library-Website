-- Thêm trường is_banned vào bảng users nếu chưa có
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned TINYINT(1) NOT NULL DEFAULT 0;
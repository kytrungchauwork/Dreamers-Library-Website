-- Tạo bảng history lưu lịch sử đọc truyện
CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    story_id INT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_story (user_id, story_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- Giả sử có bảng stories, nếu không có thì bỏ dòng dưới
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);
-- Create `stories` table
-- Based on provided schema screenshot
CREATE TABLE IF NOT EXISTS `stories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(150) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('ongoing','completed') NOT NULL DEFAULT 'ongoing',
  `source` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional indexes (uncomment if needed)
-- CREATE INDEX `idx_stories_title` ON `stories` (`title`(191));
-- CREATE INDEX `idx_stories_author` ON `stories` (`author`(100));

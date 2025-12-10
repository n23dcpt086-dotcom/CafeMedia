-- Tạo database
DROP DATABASE IF EXISTS CafeMedia;
CREATE DATABASE CafeMedia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE CafeMedia;

-- ============================================
-- 1. BẢNG TÀI KHOẢN
-- ============================================
CREATE TABLE accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================
-- 2. BẢNG BÀI VIẾT
-- ============================================
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    image MEDIUMBLOB,
    image_url VARCHAR(500),
    video MEDIUMBLOB,
    video_url VARCHAR(500),
    type ENUM('article', 'image', 'video') DEFAULT 'article',
    account_id INT NOT NULL,
    status ENUM('draft', 'pending', 'published') DEFAULT 'draft',
    category VARCHAR(50),
    tags JSON,
    likes INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    views INT DEFAULT 0,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_account (account_id),
    INDEX idx_status (status),
    INDEX idx_time (time),
    INDEX idx_type (type)
) ENGINE=InnoDB;

-- ============================================
-- 3. BẢNG BÌNH LUẬN
-- ============================================
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    account_id INT NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_post (post_id),
    INDEX idx_account (account_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- 4. BẢNG CHIẾN DỊCH
-- ============================================
CREATE TABLE campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    channel ENUM('Facebook', 'YouTube', 'TikTok', 'Instagram', 'Website') NOT NULL,
    status ENUM('Chuẩn bị', 'Đang chạy', 'Hoàn thành') DEFAULT 'Chuẩn bị',
    goal TEXT,
    progress INT DEFAULT 0,
    participants VARCHAR(50),
    achievement VARCHAR(100),
    account_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_account (account_id),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- 5. BẢNG LỊCH XUẤT BẢN
-- ============================================
CREATE TABLE schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    publish_date DATE NOT NULL,
    channel ENUM('fb', 'yt', 'tt', 'web') NOT NULL,
    note TEXT,
    post_id INT,
    account_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_date (publish_date),
    INDEX idx_account (account_id),
    INDEX idx_channel (channel)
) ENGINE=InnoDB;

-- ============================================
-- 6. BẢNG LIVESTREAM
-- ============================================
CREATE TABLE livestreams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stream_url VARCHAR(500),
    stream_key VARCHAR(255),
    channels JSON,
    status ENUM('scheduled', 'live', 'ended') DEFAULT 'scheduled',
    scheduled_time TIMESTAMP NULL,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    viewers INT DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    account_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_account (account_id),
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_time)
) ENGINE=InnoDB;
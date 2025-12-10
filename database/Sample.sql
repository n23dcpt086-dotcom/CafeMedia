USE CafeMedia;

-- ============================================
-- DỮ LIỆU MẪU - TÀI KHOẢN
-- ============================================
INSERT INTO accounts (name, email, password, role, date_of_birth, phone, avatar) VALUES
('Admin Nguyễn', 'admin@cafemedia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '1990-01-15', '0901234567', 'https://i.pravatar.cc/150?img=1'),
('Trần Văn A', 'trana@cafemedia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', '1995-05-20', '0987654321', 'https://i.pravatar.cc/150?img=2'),
('Lê Thị B', 'lethib@cafemedia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', '1998-08-10', '0912345678', 'https://i.pravatar.cc/150?img=3'),
('Phạm Minh C', 'phamc@cafemedia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', '1992-12-25', '0923456789', 'https://i.pravatar.cc/150?img=4');

-- ============================================
-- DỮ LIỆU MẪU - BÀI VIẾT
-- ============================================
INSERT INTO posts (title, body, type, image_url, video_url, account_id, status, category, tags, likes, comments_count, views, time, published_at) VALUES
-- Bài viết text
('5 Bí quyết pha cà phê ngon tại nhà', 
'Khám phá những bí mật để pha một ly cà phê hoàn hảo ngay tại nhà của bạn. Từ việc chọn hạt cà phê chất lượng đến nhiệt độ nước lý tưởng, mọi chi tiết đều quan trọng.', 
'article', NULL, NULL, 1, 'published', 'Công thức', 
'["#CàPhê", "#CôngThức", "#TựLàm"]', 
245, 18, 1240, 
DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Bài có hình ảnh
('Menu mùa đông 2025 - Ấm áp và thơm ngon', 
'Khám phá menu mùa đông đặc biệt của chúng tôi với các loại cà phê nóng, trà sữa và bánh ngọt tuyệt vời.', 
'image', 
'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800', 
NULL, 2, 'published', 'Tin tức', 
'["#MenuMới", "#MùaĐông", "#ĂnUống"]', 
412, 32, 2180, 
DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- Bài có video
('Hướng dẫn Latte Art cho người mới bắt đầu', 
'Video hướng dẫn chi tiết cách tạo những họa tiết đẹp mắt trên ly cà phê của bạn. Phù hợp cho cả người mới bắt đầu.', 
'video', NULL, 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 
1, 'published', 'Hướng dẫn', 
'["#LatteArt", "#Tutorial", "#Barista"]', 
589, 45, 3520, 
DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),

-- Bài nháp
('Cà phê phin vs Espresso - Đâu là sự lựa chọn của bạn?', 
'So sánh chi tiết giữa hai phương pháp pha cà phê truyền thống Việt Nam và hiện đại từ Ý.', 
'article', NULL, NULL, 2, 'draft', 'Công thức', 
'["#SoSánh", "#CàPhê"]', 
0, 0, 0, NOW(), NULL),

-- Bài chờ duyệt
('Khuyến mãi đặc biệt - Giáng sinh 2025', 
'Chương trình khuyến mãi lớn nhất trong năm với giảm giá lên đến 50% cho các sản phẩm yêu thích.', 
'image', 
'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800', 
NULL, 3, 'pending', 'Ưu đãi', 
'["#KhuyếnMãi", "#GiángSinh", "#Sale"]', 
0, 0, 0, NOW(), NULL),

-- Thêm bài viết
('Cold Brew - Xu hướng cà phê mùa hè', 
'Tìm hiểu về phương pháp pha cà phê lạnh đang được yêu thích trên toàn thế giới và cách tự làm tại nhà.', 
'article', NULL, NULL, 1, 'published', 'Công thức', 
'["#ColdBrew", "#MùaHè", "#CàPhêLạnh"]', 
324, 28, 1890, 
DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),

('Top 5 quán cà phê view đẹp tại Hà Nội', 
'Khám phá những quán cà phê có view đẹp nhất thủ đô, lý tưởng cho những buổi hẹn hò hoặc làm việc.', 
'image', 
'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', 
NULL, 3, 'published', 'Tin tức', 
'["#HàNội", "#QuánCàPhê", "#Review"]', 
567, 41, 2940, 
DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),

('Bí quyết chọn hạt cà phê ngon', 
'Hướng dẫn chi tiết cách nhận biết và chọn lựa hạt cà phê chất lượng cao cho từng loại đồ uống.', 
'article', NULL, NULL, 2, 'published', 'Công thức', 
'["#ChọnCàPhê", "#HạtCàPhê", "#TipsBarista"]', 
198, 15, 980, 
DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),

('Live: Trực tiếp pha chế Cappuccino', 
'Ghi lại buổi livestream hướng dẫn pha chế Cappuccino chuẩn Ý với tỷ lệ vàng.', 
'video', NULL, 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 
1, 'published', 'Hướng dẫn', 
'["#Cappuccino", "#Livestream", "#PhaChe"]', 
432, 38, 2150, 
DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

('Khuyến mãi tháng 12 - Mua 1 tặng 1', 
'Chương trình ưu đãi đặc biệt: Mua 1 tặng 1 cho tất cả đồ uống trong tháng 12.', 
'image', 
'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 
NULL, 1, 'published', 'Ưu đãi', 
'["#KhuyếnMãi", "#Tháng12", "#Mua1Tặng1"]', 
789, 52, 4280, 
DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ============================================
-- DỮ LIỆU MẪU - BÌNH LUẬN
-- ============================================
INSERT INTO comments (post_id, account_id, author, text, created_at) VALUES
-- Comments cho bài 1
(1, 2, 'Trần Văn A', 'Bài viết rất hữu ích! Tôi đã thử và thành công rồi.', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 3, 'Lê Thị B', 'Có thể cho tôi biết tỉ lệ cà phê/nước chính xác được không?', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 1, 'Admin Nguyễn', 'Tỉ lệ phù hợp là 1:15 (1g cà phê : 15ml nước). Cảm ơn bạn đã quan tâm!', DATE_SUB(NOW(), INTERVAL 23 HOUR)),

-- Comments cho bài 2
(2, 4, 'Phạm Minh C', 'Menu trông rất hấp dẫn, khi nào ra mắt vậy?', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 1, 'Admin Nguyễn', 'Menu sẽ có mặt từ tuần sau. Hãy ghé thăm nhé!', DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Comments cho bài 3
(3, 2, 'Trần Văn A', 'Video rất chi tiết, cảm ơn admin!', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 3, 'Lê Thị B', 'Mình đã tập theo và vẽ được hình trái tim rồi 😊', DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- Comments cho bài 6
(6, 4, 'Phạm Minh C', 'Cold brew uống rất mát và thơm, nhưng ủ 16 tiếng có hợp lý không?', DATE_SUB(NOW(), INTERVAL 9 DAY)),
(6, 1, 'Admin Nguyễn', 'Đúng rồi bạn! 12-18 tiếng là thời gian lý tưởng.', DATE_SUB(NOW(), INTERVAL 9 DAY)),

-- Comments cho bài 7
(7, 2, 'Trần Văn A', 'Quán số 3 view đẹp nhất! Mình đã đến rồi.', DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Comments cho bài 8
(8, 3, 'Lê Thị B', 'Cảm ơn tips này, rất hữu ích cho người mới!', DATE_SUB(NOW(), INTERVAL 7 DAY)),

-- Comments cho bài 9
(9, 4, 'Phạm Minh C', 'Live stream hay quá, có lưu lại không admin?', DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- Comments cho bài 10
(10, 2, 'Trần Văn A', 'Chương trình tuyệt vời! Mình sẽ ghé mua sắm ngay.', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, 3, 'Lê Thị B', 'Áp dụng cho tất cả size không ạ?', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, 1, 'Admin Nguyễn', 'Có áp dụng cho tất cả size nhé bạn!', DATE_SUB(NOW(), INTERVAL 23 HOUR));

-- ============================================
-- DỮ LIỆU MẪU - CHIẾN DỊCH
-- ============================================
INSERT INTO campaigns (name, description, start_date, end_date, channel, status, goal, progress, participants, achievement, account_id) VALUES
('Noel 2025 – "Ấm cùng Cà phê"', 
'Chiến dịch lan toả thương hiệu dịp Giáng sinh, kết hợp minigame và livestream hướng dẫn pha chế.', 
'2025-12-01', '2025-12-25', 'Facebook', 'Đang chạy', 
'Mục tiêu: +25% tương tác', 68, '12.4K lượt tham gia', NULL, 1),

('Tháng cà phê Việt', 
'Chuỗi video ngắn chia sẻ hành trình hạt cà phê từ nông trại đến ly cà phê hoàn hảo.', 
'2025-10-01', '2025-10-31', 'YouTube', 'Hoàn thành', 
'Mục tiêu: 100K lượt xem', 100, NULL, 'Đạt: 112K', 1),

('Ra mắt Cold Brew mới', 
'Chiến dịch teaser sản phẩm mới, kết hợp video hậu trường và bài PR trên web.', 
'2026-01-05', '2026-02-15', 'Instagram', 'Chuẩn bị', 
'Chuẩn bị nội dung', 25, NULL, NULL, 1),

('Livestream hướng dẫn Latte Art', 
'Series livestream hướng dẫn pha chế và trang trí cà phê mỗi tuần.', 
'2025-11-15', '2025-12-20', 'Facebook', 'Đang chạy', 
'Mục tiêu: 5000 người xem/buổi', 45, '3.2K người xem TB', NULL, 2),

('Tết 2026 - Hương vị đoàn viên', 
'Chiến dịch Tết với các combo quà tặng và voucher đặc biệt.', 
'2026-01-20', '2026-02-10', 'TikTok', 'Chuẩn bị', 
'Tăng 40% doanh số dịp Tết', 15, NULL, NULL, 1),

('Summer Drinks Festival', 
'Lễ hội đồ uống mùa hè với nhiều sản phẩm mới và ưu đãi hấp dẫn.', 
'2025-06-01', '2025-06-30', 'Instagram', 'Hoàn thành', 
'Tăng 30% doanh số tháng 6', 100, '8.5K khách hàng mới', 'Đạt: +35% doanh số', 2),

('Back to School 2025', 
'Chiến dịch học đường với combo tiết kiệm cho sinh viên.', 
'2025-09-01', '2025-09-15', 'TikTok', 'Hoàn thành', 
'Thu hút 5000 sinh viên', 100, '6.2K sinh viên đăng ký', 'Vượt mục tiêu 24%', 1);

-- ============================================
-- DỮ LIỆU MẪU - LỊCH XUẤT BẢN
-- ============================================
INSERT INTO schedules (title, publish_date, channel, note, post_id, account_id) VALUES
('FB: Giới thiệu menu Noel', '2025-12-02', 'fb', 'Post kèm hình ảnh menu và video giới thiệu', 2, 1),
('YouTube: Video Cold Brew', '2025-12-15', 'yt', 'Upload video hướng dẫn pha Cold Brew chi tiết', 6, 1),
('TikTok: Trend Latte Art', '2025-12-18', 'tt', 'Video ngắn 60s trend Latte Art', NULL, 2),
('Website: Bài blog tips cà phê', '2025-12-20', 'web', 'Publish bài viết 5 tips pha cà phê', 1, 1),
('FB: Livestream pha chế', '2025-12-10', 'fb', 'Livestream hướng dẫn pha chế cà phê phin', NULL, 1),
('Instagram: Story khuyến mãi', '2025-12-12', 'fb', 'Đăng story về chương trình giảm giá', 5, 3),
('YouTube: Review quán mới', '2025-12-22', 'yt', 'Video review top quán cà phê Hà Nội', 7, 3),
('TikTok: Behind the scene', '2025-12-25', 'tt', 'Hậu trường pha chế trong mùa Noel', NULL, 2),
('Website: Bài viết chọn hạt', '2025-12-13', 'web', 'Hướng dẫn chọn hạt cà phê cho người mới', 8, 1),
('FB: Khuyến mãi tháng 12', '2025-12-01', 'fb', 'Thông báo chương trình Mua 1 Tặng 1', 10, 1);

-- ============================================
-- DỮ LIỆU MẪU - LIVESTREAM
-- ============================================
INSERT INTO livestreams (title, description, stream_url, stream_key, channels, status, scheduled_time, start_time, end_time, viewers, engagement_rate, account_id) VALUES
('Hướng dẫn pha cà phê phin truyền thống', 
'Livestream hướng dẫn chi tiết cách pha cà phê phin Việt Nam, tips chọn hạt và nhiệt độ nước.', 
'rtmp://live.example.com/stream1', 'stream_key_001', 
'["Facebook", "YouTube"]', 
'ended', 
DATE_SUB(NOW(), INTERVAL 5 DAY), 
DATE_SUB(NOW(), INTERVAL 5 DAY), 
DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 1 HOUR, 
1240, 8.5, 1),

('Giới thiệu menu mùa đông 2025', 
'Ra mắt menu mùa đông với các món đồ uống ấm áp và bánh ngọt mới.', 
'rtmp://live.example.com/stream2', 'stream_key_002', 
'["Facebook", "TikTok"]', 
'ended', 
DATE_SUB(NOW(), INTERVAL 2 DAY), 
DATE_SUB(NOW(), INTERVAL 2 DAY), 
DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 45 MINUTE, 
890, 7.2, 2),

('Q&A về cà phê - Hỏi đáp cùng Barista', 
'Buổi livestream trả lời các câu hỏi về cà phê từ cộng đồng.', 
'rtmp://live.example.com/stream3', 'stream_key_003', 
'["YouTube"]', 
'scheduled', 
NOW() + INTERVAL 2 DAY, NULL, NULL, 
0, 0, 1),

('Workshop Latte Art cơ bản', 
'Hướng dẫn các kỹ thuật Latte Art từ cơ bản đến nâng cao.', 
'rtmp://live.example.com/stream4', 'stream_key_004', 
'["Facebook", "YouTube", "TikTok"]', 
'scheduled', 
NOW() + INTERVAL 5 DAY, NULL, NULL, 
0, 0, 2),

('Bí mật pha Espresso hoàn hảo', 
'Livestream chia sẻ kỹ thuật pha Espresso chuẩn Ý từ chuyên gia.', 
'rtmp://live.example.com/stream5', 'stream_key_005', 
'["Facebook", "YouTube"]', 
'scheduled', 
NOW() + INTERVAL 7 DAY, NULL, NULL, 
0, 0, 1);
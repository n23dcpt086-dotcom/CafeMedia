'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ACCOUNTS
    await queryInterface.bulkInsert('accounts', [
      {
        name: 'Trần Thị Thuận Kiều',
        email: 'n23dcpt086@gmail.com',
        password: '$2a$12$pakdV6AaYgNDyB9SADVrZeNo7laY/Y2XBTkGxDZac4O0TfaHjsHGe', // password: n23dcpt086
        role: 'admin',
        phone: '0901234567',
        date_of_birth: '2005-11-01',
        avatar: 'https://i.pravatar.cc/150?img=1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nguyễn Văn A',
        email: 'user001@gmail.com',
        password: '$2a$12$2IqmMivBOqC58.5t8324OeqaSdzeTO5Ey4vyMG8dWS0qtKSF7BtOC', // password: user001
        role: 'user',
        phone: '0912345678',
        date_of_birth: '1995-05-20',
        avatar: 'https://i.pravatar.cc/150?img=2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Trần Thị B',
        email: 'user002@gmail.com',
        password: '$2a$12$HXXmHuXIgZ1ecVe2tlDVC.8MZedpJTj.HoMl2WDCMlOGDFGEnNJJO', // password: user002
        role: 'user',
        phone: '0923456789',
        date_of_birth: '1992-08-10',
        avatar: 'https://i.pravatar.cc/150?img=3',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Lê Văn C',
        email: 'user003@gmail.com',
        password: '$2a$12$01DTJ3vRC9yhAD65a0PkZ.3h.VtTnlhHrtEA6SahY5t93yYqeENOq', // password: user003
        role: 'user',
        phone: '0934567890',
        date_of_birth: '1988-12-25',
        avatar: 'https://i.pravatar.cc/150?img=4',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Phạm Thị D',
        email: 'user004d@gmail.com',
        password: '$2a$12$oEPc1GZARCySggV2L7SEv.XBQxUVjnv1XZwqF33ZvLg0u.4WCTERW', // password: user004
        role: 'user',
        phone: '0945678901',
        date_of_birth: '1997-03-15',
        avatar: 'https://i.pravatar.cc/150?img=5',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nguyễn Thị Khánh An',
        email: 'n23dcpt059@gmail.com',
        password: '$2a$12$T60tve7iXqaAHydDq/p3M.CuUiF1eGczhwisi0pdNnbCYEAioJRhe', // password: n23dcpt059
        role: 'admin',
        phone: '0901234565',
        date_of_birth: '2005-01-01',
        avatar: 'https://i.pravatar.cc/150?img=1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Trần Mai Chi',
        email: 'n23dcpt067@gmail.com',
        password: '$2a$12$/r9cuMvQ2.8gAUs6kpnIzO1ln1y5TfU7gh26yjX3vlAO3atJfyAwa', // password: n23dcpt067
        role: 'admin',
        phone: '0901234564',
        date_of_birth: '2005-01-01',
        avatar: 'https://i.pravatar.cc/150?img=1',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // POSTS
    await queryInterface.bulkInsert('posts', [
      {
        title: 'Giới thiệu về CafeMedia Platform',
        body: 'CafeMedia là nền tảng quản lý nội dung đa phương tiện hiện đại, giúp bạn dễ dàng quản lý và xuất bản nội dung trên nhiều kênh khác nhau.',
        account_id: 1,
        status: 'published',
        tag: 'Giới thiệu',
        image_url: 'https://picsum.photos/800/600?random=1',
        published_at: new Date('2024-11-01 09:00:00')
      },
      {
        title: '10 Tips để tạo nội dung thu hút trên Social Media',
        body: 'Trong thời đại số, việc tạo nội dung thu hút là chìa khóa để thành công trên mạng xã hội. Dưới đây là 10 tips hữu ích...',
        account_id: 1,
        status: 'published',
        tag: 'Marketing',
        published_at: new Date('2024-11-15 14:30:00')
      },
      {
        title: 'Hướng dẫn Live Stream chuyên nghiệp',
        body: 'Live streaming đang ngày càng phổ biến. Hãy cùng tìm hiểu cách livestream chuyên nghiệp với những công cụ và kỹ thuật tốt nhất.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        account_id: 1,
        status: 'published',
        tag: 'Video',
        published_at: new Date('2024-11-20 16:00:00')
      },
      {
        title: 'Chiến lược Content Marketing 2024',
        body: 'Xu hướng content marketing năm 2024 đang thay đổi nhanh chóng. Hãy cập nhật những chiến lược mới nhất để không bị bỏ lại phía sau.',
        account_id: 1,
        status: 'published',
        tag: 'Marketing',
        published_at: new Date('2024-11-25 10:00:00')
      },
      {
        title: 'Bài viết đang soạn thảo',
        body: 'Đây là bài viết đang được soạn thảo và chưa xuất bản...',
        account_id: 1,
        status: 'draft',
        tag: 'Chưa có',
        published_at: null
      },
      {
        title: 'Ảnh đẹp về thiên nhiên Việt Nam',
        body: 'Bộ sưu tập những hình ảnh tuyệt đẹp về thiên nhiên Việt Nam.',
        image_url: 'https://picsum.photos/800/600?random=2',
        account_id: 1,
        status: 'published',
        tag: 'Photography',
        published_at: new Date('2024-11-28 08:00:00')
      },
      {
        title: 'Review sản phẩm mới nhất 2024',
        body: 'Cùng xem những sản phẩm công nghệ mới nhất và đánh giá chi tiết về chúng.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        account_id: 1,
        status: 'published',
        tag: 'Review',
        published_at: new Date('2024-12-01 15:00:00')
      },
      {
        title: 'Tutorial: Chỉnh sửa video với Premiere Pro',
        body: 'Hướng dẫn chi tiết cách chỉnh sửa video chuyên nghiệp với Adobe Premiere Pro.',
        account_id: 1,
        status: 'draft',
        tag: 'Tutorial',
        published_at: null
      }
    ], {});

    // COMMENTS
    await queryInterface.bulkInsert('comments', [
      {
        post_id: 1,
        account_id: 2,
        text: 'Bài viết rất hay và hữu ích! Cảm ơn admin đã chia sẻ.',
        created_at: new Date('2024-11-01 10:00:00')
      },
      {
        post_id: 1,
        account_id: 3,
        text: 'Mình đã áp dụng và thấy rất hiệu quả. Thanks!',
        created_at: new Date('2024-11-01 11:30:00')
      },
      {
        post_id: 1,
        account_id: 4,
        text: 'Có thể hướng dẫn chi tiết hơn được không ạ?',
        created_at: new Date('2024-11-01 14:00:00')
      },
      {
        post_id: 2,
        account_id: 1,
        text: 'Bài viết chất lượng! Keep up the good work!',
        created_at: new Date('2024-11-15 15:00:00')
      },
      {
        post_id: 2,
        account_id: 5,
        text: 'Mình đã thử theo các tips này và thấy engagement tăng lên rõ rệt.',
        created_at: new Date('2024-11-15 16:30:00')
      },
      {
        post_id: 3,
        account_id: 2,
        text: 'Video rất chi tiết và dễ hiểu. Cảm ơn bạn!',
        created_at: new Date('2024-11-20 17:00:00')
      },
      {
        post_id: 3,
        account_id: 4,
        text: 'Mình có thể dùng những thiết bị nào để livestream?',
        created_at: new Date('2024-11-20 18:00:00')
      },
      {
        post_id: 3,
        account_id: 1,
        text: 'Bạn có thể dùng smartphone, webcam hoặc camera chuyên nghiệp đều được.',
        created_at: new Date('2024-11-20 18:30:00')
      },
      {
        post_id: 4,
        account_id: 3,
        text: 'Xu hướng 2024 thật sự rất thú vị. Mình sẽ thử áp dụng.',
        created_at: new Date('2024-11-25 11:00:00')
      },
      {
        post_id: 4,
        account_id: 5,
        text: 'Bài viết rất insightful. Có thêm case study được không ạ?',
        created_at: new Date('2024-11-25 13:00:00')
      },
      {
        post_id: 6,
        account_id: 1,
        text: 'Những bức ảnh tuyệt đẹp! Việt Nam mình đẹp quá!',
        created_at: new Date('2024-11-28 09:00:00')
      },
      {
        post_id: 6,
        account_id: 2,
        text: 'Chụp ở đâu vậy bạn? Mình muốn đi thăm.',
        created_at: new Date('2024-11-28 10:30:00')
      },
      {
        post_id: 6,
        account_id: 3,
        text: 'Góc chụp và màu sắc rất ấn tượng!',
        created_at: new Date('2024-11-28 14:00:00')
      },
      {
        post_id: 7,
        account_id: 2,
        text: 'Review chi tiết và khách quan. Thanks!',
        created_at: new Date('2024-12-01 16:00:00')
      },
      {
        post_id: 7,
        account_id: 4,
        text: 'Mình đang cân nhắc mua sản phẩm này. Review giúp mình quyết định rồi.',
        created_at: new Date('2024-12-01 17:30:00')
      }
    ], {});

    // CAMPAIGNS
    await queryInterface.bulkInsert('campaigns', [
      {
        name: 'Chiến dịch Tết 2024',
        description: 'Chiến dịch quảng bá sản phẩm và nội dung đặc biệt cho dịp Tết Nguyên Đán',
        start_date: '2024-01-15',
        end_date: '2024-02-15',
        channel: 'Facebook',
        status: 'Hoàn thành',
        goal: 'Tăng 50% lượt tương tác và 30% followers mới',
        progress: 100,
        participants: '5 người',
        achievement: 'Đạt 60% tăng trưởng tương tác',
        account_id: 1,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-02-16')
      },
      {
        name: 'Content Marketing Q2 2024',
        description: 'Chiến dịch xuất bản nội dung chất lượng cao trong quý 2',
        start_date: '2024-04-01',
        end_date: '2024-06-30',
        channel: 'Website',
        status: 'Hoàn thành',
        goal: 'Xuất bản 50 bài viết chất lượng',
        progress: 100,
        participants: '3 người',
        achievement: 'Hoàn thành 52 bài viết',
        account_id: 1,
        created_at: new Date('2024-03-15'),
        updated_at: new Date('2024-07-01')
      },
      {
        name: 'Summer Video Series',
        description: 'Chuỗi video về mùa hè trên YouTube',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        channel: 'YouTube',
        status: 'Hoàn thành',
        goal: 'Tăng 10,000 subscribers',
        progress: 100,
        participants: '4 người',
        achievement: 'Đạt 12,500 subscribers mới',
        account_id: 2,
        created_at: new Date('2024-05-15'),
        updated_at: new Date('2024-09-01')
      },
      {
        name: 'Back to School Campaign',
        description: 'Chiến dịch marketing cho mùa khai trường',
        start_date: '2024-08-15',
        end_date: '2024-09-30',
        channel: 'TikTok',
        status: 'Hoàn thành',
        goal: 'Đạt 1 triệu views',
        progress: 100,
        participants: '6 người',
        achievement: 'Đạt 1.5 triệu views',
        account_id: 3,
        created_at: new Date('2024-08-01'),
        updated_at: new Date('2024-10-01')
      },
      {
        name: 'Holiday Season 2024',
        description: 'Chiến dịch cuối năm với nhiều nội dung đặc biệt',
        start_date: '2024-11-15',
        end_date: '2024-12-31',
        channel: 'Instagram',
        status: 'Đang chạy',
        goal: 'Tăng 40% engagement rate',
        progress: 65,
        participants: '5 người',
        achievement: 'Đang thực hiện',
        account_id: 1,
        created_at: new Date('2024-11-01'),
        updated_at: new Date()
      },
      {
        name: 'New Year 2025 Launch',
        description: 'Ra mắt sản phẩm mới đầu năm 2025',
        start_date: '2024-12-15',
        end_date: '2025-01-31',
        channel: 'Facebook',
        status: 'Đang chạy',
        goal: 'Đạt 50,000 impressions',
        progress: 30,
        participants: '7 người',
        achievement: 'Đang thực hiện',
        account_id: 2,
        created_at: new Date('2024-12-01'),
        updated_at: new Date()
      },
      {
        name: 'Q1 2025 Video Strategy',
        description: 'Chiến lược video cho quý 1 năm 2025',
        start_date: '2025-01-01',
        end_date: '2025-03-31',
        channel: 'YouTube',
        status: 'Chuẩn bị',
        goal: 'Xuất bản 20 video chất lượng cao',
        progress: 0,
        participants: '4 người',
        achievement: 'Chưa bắt đầu',
        account_id: 3,
        created_at: new Date('2024-12-10'),
        updated_at: new Date('2024-12-10')
      }
    ], {});

    // SCHEDULES
    await queryInterface.bulkInsert('schedules', [
      {
        title: 'Đăng bài về Chiến dịch Tết',
        publish_date: '2024-12-20',
        channel: 'fb',
        note: 'Đăng vào 9h sáng, tag các pages liên quan',
        post_id: 1,
        account_id: 1,
        created_at: new Date('2024-12-01')
      },
      {
        title: 'Video hướng dẫn livestream',
        publish_date: '2024-12-22',
        channel: 'yt',
        note: 'Upload lên YouTube, thêm subtitle tiếng Anh',
        post_id: 3,
        account_id: 3,
        created_at: new Date('2024-12-05')
      },
      {
        title: 'Đăng ảnh thiên nhiên Việt Nam',
        publish_date: '2024-12-25',
        channel: 'tt',
        note: 'Đăng vào 18h tối để tối ưu engagement',
        post_id: 6,
        account_id: 4,
        created_at: new Date('2024-12-10')
      },
      {
        title: 'Bài viết về Content Marketing',
        publish_date: '2024-12-28',
        channel: 'web',
        note: 'Publish lên website chính, SEO optimize',
        post_id: 4,
        account_id: 1,
        created_at: new Date('2024-12-12')
      },
      {
        title: 'Review sản phẩm mới',
        publish_date: '2024-12-30',
        channel: 'fb',
        note: 'Share lên group và page, tag brands',
        post_id: 7,
        account_id: 5,
        created_at: new Date('2024-12-15')
      },
      {
        title: 'Bài viết về 10 Tips Social Media',
        publish_date: '2025-01-05',
        channel: 'web',
        note: 'Featured post trên trang chủ',
        post_id: 2,
        account_id: 2,
        created_at: new Date('2024-12-18')
      },
      {
        title: 'Video tutorial Premiere Pro',
        publish_date: '2025-01-08',
        channel: 'yt',
        note: 'Series video part 1, khoảng 15 phút',
        post_id: null,
        account_id: 3,
        created_at: new Date('2024-12-20')
      },
      {
        title: 'Livestream giới thiệu sản phẩm',
        publish_date: '2025-01-10',
        channel: 'fb',
        note: 'Chuẩn bị demo, Q&A session 30 phút',
        post_id: null,
        account_id: 1,
        created_at: new Date('2024-12-22')
      },
      {
        title: 'Bài viết tổng kết năm 2024',
        publish_date: '2025-01-15',
        channel: 'web',
        note: 'Infographic + statistics, SEO keywords: year in review',
        post_id: null,
        account_id: 2,
        created_at: new Date('2024-12-25')
      },
      {
        title: 'Câu chuyện thành công từ khách hàng',
        publish_date: '2025-01-18',
        channel: 'tt',
        note: 'Short video format, dưới 60 giây',
        post_id: null,
        account_id: 4,
        created_at: new Date('2024-12-28')
      },
      {
        title: 'Behind the scenes - Quay phim',
        publish_date: '2025-01-20',
        channel: 'fb',
        note: 'Stories + post, tag team members',
        post_id: null,
        account_id: 5,
        created_at: new Date('2024-12-30')
      },
      {
        title: 'Webinar về Digital Marketing 2025',
        publish_date: '2025-01-25',
        channel: 'yt',
        note: 'Live webinar, 2 tiếng, mở registration trước',
        post_id: null,
        account_id: 1,
        created_at: new Date('2025-01-02')
      }
    ], {});

    // LIVESTREAMS
    await queryInterface.bulkInsert('livestreams', [
      {
        title: 'Livestream Ra mắt sản phẩm mới 2024',
        description: 'Giới thiệu dòng sản phẩm mới nhất của chúng tôi với nhiều tính năng đột phá',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_abc123xyz456',
        channels: JSON.stringify(['Facebook', 'YouTube']),
        status: 'ended',
        scheduled_time: new Date('2024-11-15 19:00:00'),
        start_time: new Date('2024-11-15 19:05:00'),
        end_time: new Date('2024-11-15 21:30:00'),
        viewers: 2543,
        engagement_rate: 8.5,
        account_id: 1,
        created_at: new Date('2024-11-01')
      },
      {
        title: 'Q&A Session với CEO',
        description: 'Buổi trò chuyện trực tiếp với CEO về chiến lược phát triển công ty',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_def789ghi012',
        channels: JSON.stringify(['YouTube']),
        status: 'ended',
        scheduled_time: new Date('2024-11-28 20:00:00'),
        start_time: new Date('2024-11-28 20:02:00'),
        end_time: new Date('2024-11-28 21:45:00'),
        viewers: 1876,
        engagement_rate: 12.3,
        account_id: 1,
        created_at: new Date('2024-11-15')
      },
      {
        title: 'Workshop: Content Creation 101',
        description: 'Hướng dẫn tạo nội dung chất lượng cho người mới bắt đầu',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_jkl345mno678',
        channels: JSON.stringify(['Facebook', 'TikTok']),
        status: 'ended',
        scheduled_time: new Date('2024-12-05 15:00:00'),
        start_time: new Date('2024-12-05 15:03:00'),
        end_time: new Date('2024-12-05 17:30:00'),
        viewers: 3421,
        engagement_rate: 15.7,
        account_id: 2,
        created_at: new Date('2024-11-25')
      },
      {
        title: 'Live Shopping - Flash Sale',
        description: 'Mua sắm trực tuyến với giảm giá lên tới 50%',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_pqr901stu234',
        channels: JSON.stringify(['Facebook', 'TikTok']),
        status: 'ended',
        scheduled_time: new Date('2024-12-08 18:00:00'),
        start_time: new Date('2024-12-08 18:00:00'),
        end_time: new Date('2024-12-08 20:15:00'),
        viewers: 5672,
        engagement_rate: 22.4,
        account_id: 3,
        created_at: new Date('2024-12-01')
      },
      {
        title: 'Unboxing & Review Sản phẩm công nghệ',
        description: 'Đánh giá chi tiết các sản phẩm công nghệ hot nhất tháng 12',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_vwx567yza890',
        channels: JSON.stringify(['YouTube']),
        status: 'ended',
        scheduled_time: new Date('2024-12-10 19:30:00'),
        start_time: new Date('2024-12-10 19:32:00'),
        end_time: new Date('2024-12-10 21:00:00'),
        viewers: 2134,
        engagement_rate: 9.8,
        account_id: 4,
        created_at: new Date('2024-12-05')
      },
      {
        title: 'Giao lưu với Influencer',
        description: 'Trò chuyện cùng các influencer nổi tiếng về xu hướng social media',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_bcd123efg456',
        channels: JSON.stringify(['Instagram', 'Facebook']),
        status: 'live',
        scheduled_time: new Date('2024-12-11 20:00:00'),
        start_time: new Date('2024-12-11 20:05:00'),
        end_time: null,
        viewers: 1543,
        engagement_rate: 11.2,
        account_id: 5,
        created_at: new Date('2024-12-08')
      },
      {
        title: 'Webinar: Digital Marketing 2025',
        description: 'Xu hướng marketing số năm 2025 và cách áp dụng hiệu quả',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_hij789klm012',
        channels: JSON.stringify(['YouTube', 'Facebook']),
        status: 'scheduled',
        scheduled_time: new Date('2024-12-18 14:00:00'),
        start_time: null,
        end_time: null,
        viewers: 0,
        engagement_rate: 0,
        account_id: 1,
        created_at: new Date('2024-12-10')
      },
      {
        title: 'Cooking Show - Món ăn Giáng sinh',
        description: 'Hướng dẫn nấu các món ăn đặc biệt cho dịp Giáng sinh',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_nop345qrs678',
        channels: JSON.stringify(['Facebook', 'TikTok']),
        status: 'scheduled',
        scheduled_time: new Date('2024-12-24 10:00:00'),
        start_time: null,
        end_time: null,
        viewers: 0,
        engagement_rate: 0,
        account_id: 2,
        created_at: new Date('2024-12-11')
      },
      {
        title: 'Countdown Chào năm mới 2025',
        description: 'Đêm nhạc và countdown cùng nghệ sĩ',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_tuv901wxy234',
        channels: JSON.stringify(['Facebook', 'YouTube', 'TikTok']),
        status: 'scheduled',
        scheduled_time: new Date('2024-12-31 22:00:00'),
        start_time: null,
        end_time: null,
        viewers: 0,
        engagement_rate: 0,
        account_id: 1,
        created_at: new Date('2024-12-10')
      },
      {
        title: 'Gaming Tournament - PUBG Mobile',
        description: 'Giải đấu PUBG Mobile với tổng giải thưởng 100 triệu',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_zab567cde890',
        channels: JSON.stringify(['YouTube', 'Facebook']),
        status: 'scheduled',
        scheduled_time: new Date('2025-01-05 18:00:00'),
        start_time: null,
        end_time: null,
        viewers: 0,
        engagement_rate: 0,
        account_id: 3,
        created_at: new Date('2024-12-11')
      },
      {
        title: 'Fitness Challenge 2025',
        description: 'Thử thách 30 ngày tập luyện cùng HLV chuyên nghiệp',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_fgh123ijk456',
        channels: JSON.stringify(['Instagram', 'TikTok']),
        status: 'scheduled',
        scheduled_time: new Date('2025-01-10 06:00:00'),
        start_time: null,
        end_time: null,
        viewers: 0,
        engagement_rate: 0,
        account_id: 4,
        created_at: new Date('2024-12-11')
      },
      {
        title: 'Music Unplugged Session',
        description: 'Đêm nhạc acoustic với các ca sĩ indie',
        stream_url: 'rtmp://live.example.com/app',
        stream_key: 'live_lmn789opq012',
        channels: JSON.stringify(['YouTube']),
        status: 'scheduled',
        scheduled_time: new Date('2025-01-15 20:00:00'),
        start_time: null,
        end_time: null,
        viewers: 0,
        engagement_rate: 0,
        account_id: 5,
        created_at: new Date('2024-12-11')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('livestreams', null, {});
    await queryInterface.bulkDelete('schedules', null, {});
    await queryInterface.bulkDelete('campaigns', null, {});
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('posts', null, {});
    await queryInterface.bulkDelete('accounts', null, {});
  }
};
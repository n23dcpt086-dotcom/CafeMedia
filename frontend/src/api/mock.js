// src/api/mock.js

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardData() {
  await delay(300);

  return {
    posts: 124,
    postsChange: "+12% so với tháng trước",

    livestreams: 18,
    campaignsActive: 3,

    views: 48200,
    viewsChange: "+3.5% tuần qua",

    seoScore: 87,
    seoNote: "Core Web Vitals đạt chuẩn",
  };
}

export async function getTodayEvents() {
  await delay(200);

  return [
    {
      type: "live",
      emoji: "🎬",
      title: 'Livestream “Giới thiệu sản phẩm mới”',
      time: "09:00 • YouTube + TikTok",
    },
    {
      type: "post",
      emoji: "📰",
      title: 'Bài viết “5 công thức cà phê mùa đông”',
      time: "10:00 • Web + Facebook",
    },
    {
      type: "campaign",
      emoji: "📢",
      title: 'Chiến dịch “Tháng 12 – Ấm áp”',
      time: "Cả ngày • Theo dõi KPI",
    },
  ];
}

export async function getRecentActivities() {
  await delay(200);

  return [
    {
      icon: "👤",
      text: 'Trần Chi đã duyệt bài “Ưu đãi Giáng sinh” – 09:15',
    },
    {
      icon: "☕",
      text: 'Khánh An lên lịch livestream “Cà phê sáng tạo” – 08:45',
    },
    {
      icon: "📢",
      text: 'Ngọc Linh tạo chiến dịch “Tháng 12 – Ấm áp” – Hôm qua',
    },
  ];
}

export async function getHomePosts() {
  await delay(300);

  return [
    {
      id: 1,
      type: "text",
      author: "Barista Linh",
      avatar: "☕",
      title: "Câu chuyện ly cà phê sáng",
      body:
        "Một ly cà phê buổi sáng không chỉ giúp tỉnh táo, mà còn là khoảnh khắc bạn tạm dừng, hít thở và chuẩn bị cho một ngày mới.",
      createdAt: "Hôm nay · 08:30",
      stats: { likes: 120, comments: 8 },
    },
    {
      id: 2,
      type: "image",
      author: "Studio Café",
      avatar: "📸",
      title: "Góc chill cuối tuần",
      body: "Góc cửa kính mới setup cho bạn nào thích chụp hình check-in.",
      imageUrl:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
      createdAt: "Hôm nay · 07:45",
      stats: { likes: 210, comments: 15 },
    },
    {
      id: 3,
      type: "video",
      author: "Team Content",
      avatar: "🎬",
      title: "Video: Hướng dẫn pha Cold Brew tại nhà",
      body: "Cold Brew không khó như bạn nghĩ. Xem video hướng dẫn chi tiết bên dưới.",
      videoUrl: "https://www.youtube.com/embed/Z1Yd7upQsXY",
      createdAt: "Hôm qua · 21:10",
      stats: { likes: 340, comments: 27 },
    },
    {
      id: 4,
      type: "text",
      author: "Admin Café",
      avatar: "👨‍💼",
      title: "Thông báo nhỏ",
      body:
        "Tuần này có chương trình tích điểm nhân đôi cho tất cả đồ uống mang đi. Đừng quên quét mã thành viên.",
      createdAt: "Hôm qua · 10:05",
      stats: { likes: 89, comments: 4 },
    },
  ];
}
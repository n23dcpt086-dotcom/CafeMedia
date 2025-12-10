// src/components/Campaign.jsx
import { useState, useEffect, useCallback } from "react";
import "../styles.css";

const API_BASE = "http://localhost:5000/api";

// Mock data mẫu
const mockCampaigns = [
  {
    id: 1,
    name: "Noel 2025 – \"Ấm cùng Cà phê\"",
    start: "2025-12-01",
    end: "2025-12-25",
    channel: "Facebook",
    status: "Đang chạy",
    desc: "Chiến dịch lan toả thương hiệu dịp Giáng sinh, kết hợp minigame và livestream hướng dẫn pha chế.",
    goal: "Mục tiêu: +25% tương tác",
    progress: 68,
    participants: "12.4K lượt tham gia"
  },
  {
    id: 2,
    name: "Tháng cà phê Việt",
    start: "2025-10-01",
    end: "2025-10-31",
    channel: "YouTube",
    status: "Hoàn thành",
    desc: "Chuỗi video ngắn chia sẻ hành trình hạt cà phê từ nông trại đến ly cà phê hoàn hảo.",
    goal: "Mục tiêu: 100K lượt xem",
    progress: 100,
    achievement: "Đạt: 112K"
  },
  {
    id: 3,
    name: "Ra mắt Cold Brew mới",
    start: "2026-01-05",
    end: "2026-02-15",
    channel: "Instagram",
    status: "Chuẩn bị",
    desc: "Chiến dịch teaser sản phẩm mới, kết hợp video hậu trường và bài PR trên web.",
    goal: "Chuẩn bị nội dung",
    progress: 25
  }
];

export default function Campaign({ navigate }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/campaign.html";
  const isCampaignActive = path === "/campaign";

  // State
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    start: "",
    end: "",
    channel: "Facebook",
    goal: ""
  });

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/campaigns`);
      if (!res.ok) throw new Error("Không tải được campaigns");

      const data = await res.json();
      if (data && data.length > 0) {
        setCampaigns([...data, ...mockCampaigns]);
      }
    } catch (err) {
      console.error("API error:", err);
      setCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Tạo chiến dịch mới
  const handleCreateCampaign = async () => {
    const { name, start, end, channel, goal } = formData;

    if (!name || !start || !end) {
      alert("Vui lòng nhập đầy đủ tên chiến dịch, ngày bắt đầu và kết thúc.");
      return;
    }

    // Tạo campaign object mới
    const newCampaign = {
      id: Date.now(),
      name,
      start,
      end,
      channel,
      goal,
      desc: goal,
      status: "Chuẩn bị",
      progress: 10
    };

    try {
      // Thử gọi API
      const res = await fetch(`${API_BASE}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCampaign),
      });

      if (res.ok) {
        const savedCampaign = await res.json();
        // Thêm campaign từ API vào đầu danh sách
        setCampaigns([savedCampaign, ...campaigns]);
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error("API error, adding locally:", err);
      // Nếu API fail, vẫn thêm vào local state
      setCampaigns([newCampaign, ...campaigns]);
    }

    alert("Tạo chiến dịch thành công!");

    // Reset form
    setFormData({
      name: "",
      start: "",
      end: "",
      channel: "Facebook",
      goal: ""
    });
  };

  return (
    <div className="app campaign-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">📢</div>
          <span><strong>Chiến dịch</strong></span>
        </div>

        <nav className="nav">
          <a
            href="/dashboard"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            📊 <span>Dashboard</span>
          </a>
          <a
            href="/editor"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/editor");
            }}
          >
            📝 <span>Nội dung</span>
          </a>
          <a
            href="/schedule"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/schedule");
            }}
          >
            📅 <span>Lịch xuất bản</span>
          </a>
          <a
            href="/livestream"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/livestream");
            }}
          >
            🎥 <span>Livestream</span>
          </a>
          <a
            href="/campaign"
            className={`nav-link ${isCampaignActive ? "active" : ""}`}
          >
            📢 <span>Chiến dịch</span>
          </a>
          <a href="/seo" className="nav-link">
            ⚙️ <span>SEO & Hiệu năng</span>
          </a>
          <a
            href="/profile"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/profile");
            }}
          >
            👤 <span>Người dùng</span>
          </a>
        </nav>

        <div className="spacer" />

        <div className="user">
          <div className="avatar">👤</div>
          <div className="meta"></div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-inner">
            <div className="crumbs">Chiến dịch</div>
          </div>
        </div>

        <section className="workspace">
          {/* Left: Campaign List */}
          <div>
            <div className="card">
              <h3>Danh sách chiến dịch hiện tại</h3>

              {loading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-2)" }}>
                  Đang tải chiến dịch...
                </div>
              ) : (
                <div className="campaign-list">
                  {campaigns.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-2)" }}>
                      Chưa có chiến dịch nào. Tạo chiến dịch mới bên phải.
                    </div>
                  ) : (
                    campaigns.map((campaign, idx) => (
                      <div key={campaign.id || idx} className="campaign">
                        <div className="campaign-header">
                          <h4>{campaign.name}</h4>
                          <div className="tags">
                            <div className="tag">{campaign.status || "Đang chạy"}</div>
                            <div className="tag">{campaign.channel || "Facebook"}</div>
                          </div>
                        </div>

                        <p>{campaign.desc || campaign.goal || "Không có mô tả"}</p>

                        <div className="metrics">
                          <div>📅 {campaign.start} – {campaign.end}</div>
                          <div>
                            🎯 {campaign.goal
                              ? campaign.goal.length > 50
                                ? campaign.goal.substring(0, 50) + "..."
                                : campaign.goal
                              : "Không có mục tiêu"}
                          </div>
                          {campaign.participants && (
                            <div>👥 {campaign.participants}</div>
                          )}
                          {campaign.achievement && (
                            <div>📈 {campaign.achievement}</div>
                          )}
                        </div>

                        <div className="progress">
                          <span style={{
                            width: `${campaign.progress || 10}%`,
                            background: campaign.status === "Hoàn thành"
                              ? "var(--blue-500)"
                              : campaign.status === "Chuẩn bị"
                                ? "var(--red-500)"
                                : "var(--teal-600)"
                          }}></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Create Form + Analytics */}
          <aside className="right">
            <div className="card">
              <h3>Tạo chiến dịch mới</h3>

              <div className="form-row">
                <label>Tên chiến dịch</label>
                <input
                  className="input"
                  placeholder="VD: Tết 2026 – Hương vị đoàn viên"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  className="input"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                />
              </div>

              <div className="form-row">
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  className="input"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                />
              </div>

              <div className="form-row">
                <label>Kênh triển khai</label>
                <select
                  className="input"
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                >
                  <option>Facebook</option>
                  <option>YouTube</option>
                  <option>TikTok</option>
                  <option>Website</option>
                  <option>Instagram</option>
                </select>
              </div>

              <div className="form-row">
                <label>Mục tiêu</label>
                <textarea
                  rows="3"
                  className="input"
                  placeholder="VD: Tăng 30% lượt tương tác, 10K lượt xem livestream..."
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
              </div>

              <button
                className="btn primary"
                style={{ width: "100%" }}
                onClick={handleCreateCampaign}
              >
                Tạo chiến dịch
              </button>
            </div>

            <div className="card">
              <h3>Phân tích hiệu quả</h3>
              <div className="chart">
                <svg viewBox="0 0 320 200">
                  <rect x="0" y="0" width="320" height="200" fill="#fff" rx="12" />
                  <line x1="40" y1="160" x2="280" y2="160" stroke="#E2E8F0" strokeWidth="2" />
                  <rect x="60" y="100" width="36" height="60" fill="#3B82F6" rx="4" />
                  <rect x="120" y="60" width="36" height="100" fill="#0E7C66" rx="4" />
                  <rect x="180" y="80" width="36" height="80" fill="#FF0000" rx="4" />
                  <rect x="240" y="120" width="36" height="40" fill="#FFB703" rx="4" />
                  <text x="78" y="180" fontSize="12" textAnchor="middle">FB</text>
                  <text x="138" y="180" fontSize="12" textAnchor="middle">YT</text>
                  <text x="198" y="180" fontSize="12" textAnchor="middle">TT</text>
                  <text x="258" y="180" fontSize="12" textAnchor="middle">IG</text>
                </svg>
              </div>
              <p style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                Tổng tương tác: <strong>240K</strong> • CTR trung bình: <strong>5.2%</strong>
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
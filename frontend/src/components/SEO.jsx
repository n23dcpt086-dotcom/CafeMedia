// src/components/SEO.jsx
import { useState } from "react";
import "../styles.css";

// Mock data
const mockPages = [
  {
    name: 'Trang chủ',
    url: '/',
    type: 'landing',
    seo: 88,
    speed: 1.1,
    issues: ['Thiếu heading H2 chứa từ khoá'],
    issuesCount: 1,
    lastAudit: '2025-11-10'
  },
  {
    name: 'Menu Noel 2025',
    url: '/menu/noel-2025',
    type: 'landing',
    seo: 79,
    speed: 1.5,
    issues: ['Ảnh dung lượng lớn', 'Thiếu mô tả ALT cho hình ảnh'],
    issuesCount: 2,
    lastAudit: '2025-11-09'
  },
  {
    name: 'Blog: 5 tips gọi món nhanh',
    url: '/blog/5-tips-goi-mon-nhanh',
    type: 'blog',
    seo: 84,
    speed: 1.3,
    issues: ['Meta description hơi ngắn'],
    issuesCount: 1,
    lastAudit: '2025-11-08'
  },
  {
    name: 'Landing: Đăng ký thành viên',
    url: '/membership',
    type: 'landing',
    seo: 72,
    speed: 2.0,
    issues: ['Thời gian phản hồi server cao', 'Nhiều script chưa tối ưu'],
    issuesCount: 2,
    lastAudit: '2025-11-07'
  },
  {
    name: 'Trang liên hệ',
    url: '/contact',
    type: 'other',
    seo: 90,
    speed: 1.0,
    issues: [],
    issuesCount: 0,
    lastAudit: '2025-11-06'
  }
];

const mockIssues = [
  {
    title: 'Ảnh chưa nén / dung lượng lớn',
    severity: 'high',
    count: 5,
    desc: 'Ảnh lớn làm tăng thời gian tải trang trên mobile, ảnh hưởng Core Web Vitals.',
    tip: 'Nén ảnh xuống dưới 200KB, dùng định dạng WebP nơi có thể.'
  },
  {
    title: 'Thiếu meta description',
    severity: 'medium',
    count: 3,
    desc: 'Một số trang chưa có meta description tối ưu cho SEO.',
    tip: 'Thêm đoạn mô tả 120–160 ký tự, có chứa từ khóa chính.'
  },
  {
    title: 'Không có heading H1 duy nhất',
    severity: 'low',
    count: 2,
    desc: 'Cấu trúc heading chưa rõ ràng trên một số bài blog.',
    tip: 'Đảm bảo mỗi trang có đúng 1 thẻ H1, các thẻ H2/H3 phân cấp nội dung.'
  }
];

export default function SEO({ navigate }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/seo.html";
  const isSEOActive = path === "/seo.html" || path === "/seo";

  // State
  const [pages] = useState(mockPages);
  const [issues] = useState(mockIssues);
  const [currentType, setCurrentType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('30');

  // KPI data (có thể thay đổi theo timeRange nếu cần)
  const kpiData = {
    seo: { value: 82, trend: '▲ +6 điểm so với kỳ trước', type: 'positive' },
    speed: { value: '1.2s', trend: '▲ Cần tối ưu thêm trên mobile', type: 'warning' },
    issues: { value: 12, trend: '⚠ Ưu tiên khắc phục trong tuần', type: 'danger' },
    keywords: { value: 18, trend: '▲ +4 từ khóa mới', type: 'positive' }
  };

  // Helper functions
  const badgeClass = (score) => {
    if (score >= 85) return 'good';
    if (score >= 70) return 'warn';
    return 'bad';
  };

  const speedBadgeClass = (sec) => {
    if (sec <= 1.3) return 'good';
    if (sec <= 1.8) return 'warn';
    return 'bad';
  };

  const severityLabel = (severity) => {
    if (severity === 'high') return 'Cao';
    if (severity === 'medium') return 'Trung bình';
    return 'Thấp';
  };

  // Filter pages
  const filteredPages = pages
    .filter(p => currentType === 'all' || p.type === currentType)
    .filter(p => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(term) || p.url.toLowerCase().includes(term);
    });

  return (
    <div className="app seo-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">📈</div>
          <span><strong>Cổng nội dung số</strong></span>
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
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/campaign");
            }}
          >
            📢 <span>Chiến dịch</span>
          </a>
          <a 
            href="/seo" 
            className={`nav-link ${isSEOActive ? "active" : ""}`}
          >
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
      </aside>

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-inner">
            <div className="crumbs">SEO & Hiệu năng</div>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <select 
                className="input" 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
              </select>
            </div>
          </div>
        </div>

        <div className="main-inner">
          {/* KPIs */}
          <section className="kpi-grid">
            <div className="card">
              <h3>Điểm SEO trung bình</h3>
              <div className="kpi-value">{kpiData.seo.value}</div>
              <div className="kpi-sub">Trên tổng số trang đang theo dõi</div>
              <div className={`pill ${kpiData.seo.type}`}>{kpiData.seo.trend}</div>
            </div>

            <div className="card">
              <h3>Tốc độ tải trang (TTFB)</h3>
              <div className="kpi-value">{kpiData.speed.value}</div>
              <div className="kpi-sub">Giá trị trung bình trên desktop & mobile</div>
              <div className={`pill ${kpiData.speed.type}`}>{kpiData.speed.trend}</div>
            </div>

            <div className="card">
              <h3>Lỗi kỹ thuật</h3>
              <div className="kpi-value">{kpiData.issues.value}</div>
              <div className="kpi-sub">Lỗi quan trọng cần xử lý</div>
              <div className={`pill ${kpiData.issues.type}`}>{kpiData.issues.trend}</div>
            </div>

            <div className="card">
              <h3>Từ khóa Top 10</h3>
              <div className="kpi-value">{kpiData.keywords.value}</div>
              <div className="kpi-sub">Số từ khóa đang nằm Top 10 Google</div>
              <div className={`pill ${kpiData.keywords.type}`}>{kpiData.keywords.trend}</div>
            </div>
          </section>

          {/* Main Content: Table & Issues */}
          <section className="two-cols">
            {/* LEFT: Pages Table */}
            <div className="card">
              <div className="toolbar">
                <span className="toolbar-title">Hiệu năng theo trang</span>
                <button 
                  className={`btn ${currentType === 'all' ? 'active' : ''}`}
                  onClick={() => setCurrentType('all')}
                >
                  Tất cả
                </button>
                <button 
                  className={`btn ${currentType === 'landing' ? 'active' : ''}`}
                  onClick={() => setCurrentType('landing')}
                >
                  Landing page
                </button>
                <button 
                  className={`btn ${currentType === 'blog' ? 'active' : ''}`}
                  onClick={() => setCurrentType('blog')}
                >
                  Blog
                </button>
                <button 
                  className={`btn ${currentType === 'other' ? 'active' : ''}`}
                  onClick={() => setCurrentType('other')}
                >
                  Khác
                </button>
                <div style={{ flex: 1 }}></div>
                <input 
                  className="input" 
                  placeholder="Tìm theo tên trang hoặc URL"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Trang</th>
                      <th>SEO</th>
                      <th>Tốc độ</th>
                      <th>Vấn đề</th>
                      <th>Lần audit cuối</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-2)', padding: '1rem' }}>
                          Không tìm thấy trang phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredPages.map((page, idx) => (
                        <tr key={idx}>
                          <td>
                            <div>{page.name}</div>
                            <div className="url">{page.url}</div>
                          </td>
                          <td>
                            <span className={`badge ${badgeClass(page.seo)}`}>
                              {page.seo}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${speedBadgeClass(page.speed)}`}>
                              {page.speed.toFixed(1)}s
                            </span>
                          </td>
                          <td>
                            {page.issuesCount > 0 ? (
                              page.issues.map((issue, i) => (
                                <span key={i} className="chip">{issue}</span>
                              ))
                            ) : (
                              <span style={{ fontSize: '.8rem', color: 'var(--text-2)' }}>
                                Không có vấn đề nổi bật
                              </span>
                            )}
                          </td>
                          <td>{page.lastAudit}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: Issues List */}
            <div className="card">
              <h3>Vấn đề nổi bật</h3>
              <div className="issue-list">
                {issues.map((issue, idx) => (
                  <div key={idx} className="issue-item">
                    <div className="issue-header">
                      <div>
                        <div className="issue-title">{issue.title}</div>
                        <div className="issue-count">{issue.count} trang bị ảnh hưởng</div>
                      </div>
                      <div className={`issue-severity ${issue.severity}`}>
                        {severityLabel(issue.severity)}
                      </div>
                    </div>
                    <div className="issue-desc">{issue.desc}</div>
                    <div className="issue-foot">
                      <span>{issue.tip}</span>
                      <span className="link-like">Xem danh sách trang</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
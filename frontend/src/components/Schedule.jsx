// src/components/Schedule.jsx
import { useState, useEffect } from "react";
import "../styles.css";

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Schedule({ navigate }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/schedule.html";
  const isScheduleActive = path === "/schedule.html" || path === "/schedule";

  // State
  const [view, setView] = useState(new Date());
  const [selectedISO, setSelectedISO] = useState(null);
  const [events, setEvents] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    channel: "fb",
    note: ""
  });

  // Helper functions
  const channelClass = (ch) => {
    return ch === "fb" ? "fb" : ch === "yt" ? "yt" : ch === "tt" ? "tt" : "web";
  };

  // Initialize with demo data
  useEffect(() => {
    const now = new Date();
    const d2 = new Date(now.getFullYear(), now.getMonth(), 2);
    const key = iso(d2);

    setEvents({
      [key]: [{ title: "FB: Giới thiệu menu Noel", channel: "fb", note: "" }]
    });

    setFormData(prev => ({ ...prev, date: iso(now) }));
  }, []);

  // Get calendar data
  const getCalendarDays = () => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startIdx = (first.getDay() + 6) % 7; // Convert Sunday=0 to VN week (Mon=0)
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const totalCells = 42; // 6 weeks grid
    const days = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startIdx + 1;
      if (dayNum > 0 && dayNum <= daysInMonth) {
        const dateObj = new Date(view.getFullYear(), view.getMonth(), dayNum);
        const key = iso(dateObj);
        const todayISO = iso(new Date());

        days.push({
          dayNum,
          key,
          events: events[key] || [],
          isToday: key === todayISO,
          isSelected: key === selectedISO
        });
      } else {
        days.push({ isEmpty: true });
      }
    }

    return days;
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const today = new Date();
    const list = [];

    for (const k in events) {
      const dt = new Date(k);
      if (dt >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        (events[k] || []).forEach(ev => {
          list.push({ date: k, ...ev });
        });
      }
    }

    list.sort((a, b) => a.date.localeCompare(b.date));
    return list.slice(0, 8);
  };

  // Handlers
  const handlePrevMonth = () => {
    setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setView(new Date(now.getFullYear(), now.getMonth(), 1));
    setFormData(prev => ({ ...prev, date: iso(now) }));
  };

  const handleDayClick = (key) => {
    setSelectedISO(key);
    setFormData(prev => ({ ...prev, date: key }));
  };

  const handleAddEvent = () => {
    const { title, date, channel, note } = formData;

    if (!title.trim()) {
      alert("Nhập tiêu đề nội dung");
      return;
    }

    const dateStr = date || selectedISO || iso(new Date());

    setEvents(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), { title, channel, note }]
    }));

    // Reset form
    setFormData(prev => ({ ...prev, title: "", note: "" }));

    // Navigate to the month of the new event
    const d = new Date(dateStr);
    setView(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const calendarDays = getCalendarDays();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="app schedule-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">📅</div>
          <span><strong>Lịch xuất bản</strong></span>
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
            className={`nav-link ${isScheduleActive ? "active" : ""}`}
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
          <a href="/campaign" className="nav-link">
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
      </aside>

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-inner">
            <div className="crumbs">Lịch xuất bản</div>
          </div>
        </div>

        <section className="calendar-wrap">
          <div className="toolbar">
            <div className="month">
              <button className="btn" onClick={handlePrevMonth}>←</button>
              <h2>Tháng {view.getMonth() + 1} / {view.getFullYear()}</h2>
              <button className="btn" onClick={handleNextMonth}>→</button>
            </div>
            <button className="btn" onClick={handleToday}>Hôm nay</button>
          </div>

          <div className="grid" aria-label="Lịch xuất bản">
            {/* Headers */}
            <div className="day-header">T2</div>
            <div className="day-header">T3</div>
            <div className="day-header">T4</div>
            <div className="day-header">T5</div>
            <div className="day-header">T6</div>
            <div className="day-header">T7</div>
            <div className="day-header">CN</div>

            {/* Days */}
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`day ${day.isSelected ? "selected" : ""}`}
                style={{
                  background: day.isEmpty ? "#F8FAFC" : "#fff",
                  boxShadow: day.isToday ? "inset 0 0 0 2px var(--blue-500)" : "none",
                  cursor: day.isEmpty ? "default" : "pointer"
                }}
                onClick={() => !day.isEmpty && handleDayClick(day.key)}
              >
                {!day.isEmpty && (
                  <>
                    <div className="day-number">{day.dayNum}</div>
                    {day.events.map((ev, i) => (
                      <div
                        key={i}
                        className={`event ${channelClass(ev.channel)}`}
                        title={ev.note || ""}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Right Panel */}
      <aside className="side">
        <div className="card">
          <h3>Tạo lịch mới</h3>
          <div className="form-row">
            <label>Tiêu đề nội dung</label>
            <input
              className="input"
              placeholder="VD: Livestream menu mới"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Ngày xuất bản</label>
            <input
              type="date"
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Kênh xuất bản</label>
            <select
              className="input"
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
            >
              <option value="fb">Facebook</option>
              <option value="yt">YouTube</option>
              <option value="tt">TikTok</option>
              <option value="web">Website</option>
            </select>
          </div>
          <div className="form-row">
            <label>Ghi chú</label>
            <textarea
              rows="3"
              className="input"
              placeholder="Mô tả nội dung hoặc link bài viết"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>
          <button className="btn primary" style={{ width: "100%" }} onClick={handleAddEvent}>
            Thêm vào lịch
          </button>
        </div>

        <div className="card">
          <h3>Sự kiện sắp tới</h3>
          <div id="upcoming">
            {upcomingEvents.length === 0 ? (
              <div style={{ color: "var(--text-2)" }}>Chưa có sự kiện sắp tới.</div>
            ) : (
              upcomingEvents.map((ev, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: ".5rem",
                    margin: ".4rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: ".5rem"
                  }}
                >
                  <div>
                    <strong>{ev.title}</strong>
                    <div style={{ color: "var(--text-2)", fontSize: ".9rem" }}>
                      {ev.date}
                    </div>
                  </div>
                  <span
                    className={`event ${channelClass(ev.channel)}`}
                    style={{ padding: ".2rem .5rem" }}
                  >
                    {ev.channel.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
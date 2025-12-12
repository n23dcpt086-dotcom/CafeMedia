// src/components/Schedule.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles.css";

const pad2 = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const toLocalDT = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const toLocalDTFromISO = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  return toLocalDT(d);
};

const API_URL = "http://localhost:5000/api";

export default function Schedule({ navigate }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/schedule.html";
  const isScheduleActive = path === "/schedule";

  const [view, setView] = useState(new Date());
  const [selectedISO, setSelectedISO] = useState(null);
  const [events, setEvents] = useState({});
  const [draftPosts, setDraftPosts] = useState([]);

  // NEW: tách tiêu đề lịch và tiêu đề bài viết
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [autoTitleFromPost, setAutoTitleFromPost] = useState(true);

  const [formData, setFormData] = useState({
    datetime: "",
    channel: "fb",
    post_id: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  // detail modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPostDetail, setSelectedPostDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    datetime: "",
    note: "",
    post_id: "",
  });

  const channelClass = (ch) => (ch === "fb" ? "fb" : ch === "yt" ? "yt" : ch === "tt" ? "tt" : "web");

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "";
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPostPublishedAt = (published_at) => {
    if (!published_at) return "-";
    const d = new Date(published_at);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const schedules = await response.json();
      const eventsMap = {};

      schedules.forEach((schedule) => {
        const dateKey = (schedule.publish_time || "").toString().slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return;

        if (!eventsMap[dateKey]) eventsMap[dateKey] = [];
        eventsMap[dateKey].push({
          id: schedule.id,
          title: schedule.title,
          channel: schedule.channel,
          note: schedule.note,
          post_id: schedule.post_id,
          post: schedule.post,
          publish_time: schedule.publish_time,
        });
      });

      setEvents(eventsMap);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const fetchDraftPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/schedules/draft-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const posts = await response.json();
      setDraftPosts(posts);
    } catch (error) {
      console.error("Error fetching draft posts:", error);
    }
  };

  const fetchMyPostDetailById = async (postId) => {
    if (!postId) return null;
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/posts/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const posts = await res.json();
    return Array.isArray(posts) ? posts.find((p) => String(p.id) === String(postId)) || null : null;
  };

  useEffect(() => {
    const now = new Date();
    const todayKey = isoDate(now);

    setSelectedISO(todayKey);
    setFormData((prev) => ({ ...prev, datetime: toLocalDT(now) }));

    fetchSchedules();
    fetchDraftPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCalendarDays = () => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startIdx = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const totalCells = 42;
    const days = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startIdx + 1;
      if (dayNum > 0 && dayNum <= daysInMonth) {
        const dateObj = new Date(view.getFullYear(), view.getMonth(), dayNum);
        const key = isoDate(dateObj);
        const todayISO = isoDate(new Date());

        days.push({
          dayNum,
          key,
          events: events[key] || [],
          isToday: key === todayISO,
          isSelected: key === selectedISO,
        });
      } else {
        days.push({ isEmpty: true });
      }
    }
    return days;
  };

  const dayEvents = useMemo(() => {
    if (!selectedISO) return [];
    const list = (events[selectedISO] || []).slice();
    list.sort((a, b) => (new Date(a.publish_time).getTime() || 0) - (new Date(b.publish_time).getTime() || 0));
    return list;
  }, [events, selectedISO]);

  const handlePrevMonth = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  const handleNextMonth = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));

  const handleToday = () => {
    const now = new Date();
    const todayKey = isoDate(now);
    setView(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedISO(todayKey);
    setFormData((prev) => ({ ...prev, datetime: toLocalDT(now) }));
  };

  const handleDayClick = (key) => {
    setSelectedISO(key);

    setFormData((prev) => {
      // giữ giờ/phút đang có trong input (nếu hợp lệ), tránh bị reset
      let hh = "00";
      let mm = "00";

      if (prev.datetime) {
        const m = String(prev.datetime).match(/^\d{4}-\d{2}-\d{2}T(\d{2}):(\d{2})$/);
        if (m) {
          hh = m[1];
          mm = m[2];
        }
      } else {
        // nếu chưa có datetime thì dùng giờ hiện tại
        const now = new Date();
        hh = pad2(now.getHours());
        mm = pad2(now.getMinutes());
      }

      return { ...prev, datetime: `${key}T${hh}:${mm}` };
    });
  };

  const handleAddEvent = async () => {
    const { datetime, channel, post_id, note } = formData;

    const title = String(scheduleTitle || "").trim();
    if (!title) return alert("Nhập tiêu đề lịch");

    const dtStr = datetime || (selectedISO ? `${selectedISO}T00:00` : toLocalDT(new Date()));

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          publish_time: dtStr,
          channel,
          post_id: post_id || null,
          note: note || "",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return alert(err.message || "Lỗi khi thêm lịch");
      }

      alert("Thêm lịch thành công!");
      await fetchSchedules();

      // reset form
      setScheduleTitle("");
      setAutoTitleFromPost(true);
      setFormData((prev) => ({ ...prev, post_id: "", note: "" }));

      const d = new Date(dtStr);
      setSelectedISO(isoDate(d));
      setView(new Date(d.getFullYear(), d.getMonth(), 1));
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const openEventDetail = async (ev) => {
    setSelectedEvent(ev);
    setSelectedPostDetail(null);
    setDetailOpen(true);

    if (!ev?.post_id) return;

    try {
      setDetailLoading(true);
      const detail = await fetchMyPostDetailById(ev.post_id);
      setSelectedPostDetail(detail);
    } catch (e) {
      console.error("Error loading post detail:", e);
      setSelectedPostDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedEvent(null);
    setSelectedPostDetail(null);
    setDetailLoading(false);
  };

  const openEdit = (ev) => {
    setEditData({
      id: ev.id,
      title: ev.title || "",
      datetime: toLocalDTFromISO(ev.publish_time),
      note: ev.note || "",
      post_id: ev.post_id ? String(ev.post_id) : "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditLoading(false);
  };

  const handleUpdateSchedule = async () => {
    if (!editData.id) return;

    if (!String(editData.title || "").trim()) {
      alert("Tiêu đề không được để trống");
      return;
    }
    if (!editData.datetime) {
      alert("Thời gian xuất bản không được để trống");
      return;
    }

    try {
      setEditLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        title: editData.title,
        publish_time: editData.datetime,
        note: editData.note || "",
        post_id: editData.post_id ? Number(editData.post_id) : null,
      };

      const res = await fetch(`${API_URL}/schedules/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Lỗi khi cập nhật lịch");
        return;
      }

      alert("Cập nhật lịch thành công!");
      await fetchSchedules();

      const d = new Date(editData.datetime);
      setSelectedISO(isoDate(d));
      setView(new Date(d.getFullYear(), d.getMonth(), 1));

      closeEdit();
      closeDetail();
    } catch (e) {
      console.error("Error updating schedule:", e);
      alert("Lỗi kết nối server");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!scheduleId) return;
    const ok = window.confirm("Xóa lịch trình này?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/schedules/${scheduleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Lỗi khi xóa lịch");
        return;
      }

      alert("Xóa lịch thành công!");
      await fetchSchedules();
      closeEdit();
      closeDetail();
    } catch (e) {
      console.error("Error deleting schedule:", e);
      alert("Lỗi kết nối server");
    }
  };

  const calendarDays = useMemo(getCalendarDays, [events, selectedISO, view]);

  return (
    <div className="app schedule-page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">📅</div>
          <span>
            <strong>Lịch xuất bản</strong>
          </span>
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
          <a href="/schedule" className={`nav-link ${isScheduleActive ? "active" : ""}`}>
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

      <main className="main">
        <div className="topbar">
          <div className="topbar-inner">
            <div className="crumbs">Lịch xuất bản</div>
          </div>
        </div>

        <section className="calendar-wrap">
          <div className="toolbar">
            <div className="month">
              <button className="btn" onClick={handlePrevMonth}>
                ←
              </button>
              <h2>
                Tháng {view.getMonth() + 1} / {view.getFullYear()}
              </h2>
              <button className="btn" onClick={handleNextMonth}>
                →
              </button>
            </div>
            <button className="btn" onClick={handleToday}>
              Hôm nay
            </button>
          </div>

          <div className="grid" aria-label="Lịch xuất bản">
            <div className="day-header">T2</div>
            <div className="day-header">T3</div>
            <div className="day-header">T4</div>
            <div className="day-header">T5</div>
            <div className="day-header">T6</div>
            <div className="day-header">T7</div>
            <div className="day-header">CN</div>

            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`day ${day.isSelected ? "selected" : ""}`}
                style={{
                  background: day.isEmpty ? "#F8FAFC" : "#fff",
                  boxShadow: day.isToday ? "inset 0 0 0 2px var(--blue-500)" : "none",
                  cursor: day.isEmpty ? "default" : "pointer",
                }}
                onClick={() => !day.isEmpty && handleDayClick(day.key)}
              >
                {!day.isEmpty && (
                  <>
                    <div className="day-number">{day.dayNum}</div>
                    {day.events.map((ev, i) => (
                      <div key={ev.id ?? i} className={`event ${channelClass(ev.channel)}`} title={ev.title}>
                        <div>{ev.title}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="side">
        <div className="card">
          <h3>Tạo lịch mới</h3>

          {/* Tiêu đề lịch: KHÔNG bị ghi đè bởi bài viết nữa */}
          <div className="form-row">
            <label>Tiêu đề lịch</label>
            <input
              className="input"
              value={scheduleTitle}
              onChange={(e) => {
                const v = e.target.value;
                setScheduleTitle(v);
                setAutoTitleFromPost(false); // người dùng đã tự nhập -> không auto nữa
              }}
              placeholder="Nhập tiêu đề lịch (tuỳ ý)"
            />
          </div>

          <div className="form-row">
            <label>Thời gian xuất bản</label>
            <input
              type="datetime-local"
              className="input"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
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
              className="input"
              rows={3}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label>Chọn bài viết (tùy chọn)</label>
            <select
              className="input"
              value={formData.post_id}
              onChange={(e) => {
                const postId = e.target.value;

                if (postId) {
                  const selectedPost = draftPosts.find((p) => p.id === parseInt(postId, 10));
                  if (selectedPost) {
                    setFormData((prev) => ({ ...prev, post_id: postId }));
                    if (autoTitleFromPost && !String(scheduleTitle || "").trim()) {
                      setScheduleTitle(selectedPost.title || "");
                    }
                  } else {
                    setFormData((prev) => ({ ...prev, post_id: postId }));
                  }
                } else {
                  setFormData((prev) => ({ ...prev, post_id: "" }));
                }
              }}
            >
              <option value="">-- Không chọn bài viết --</option>
              {draftPosts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title} — {formatPostPublishedAt(post.published_at)}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-2)", display: "flex", gap: 8, alignItems: "center" }}>
              <input
                id="autoTitleFromPost"
                type="checkbox"
                checked={autoTitleFromPost}
                onChange={(e) => setAutoTitleFromPost(e.target.checked)}
              />
              <label htmlFor="autoTitleFromPost" style={{ cursor: "pointer" }}>
                Tự động lấy tiêu đề từ bài viết khi chưa nhập tiêu đề lịch
              </label>
            </div>
          </div>

          <button className="btn primary" style={{ width: "100%" }} onClick={handleAddEvent} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm vào lịch"}
          </button>
        </div>

        <div className="card">
          <h3>Sự kiện trong ngày</h3>

          <div style={{ color: "var(--text-2)", fontSize: ".9rem", marginBottom: ".5rem" }}>
            {selectedISO ? selectedISO : "Chọn một ngày trên lịch"}
          </div>

          <div id="upcoming">
            {!selectedISO ? (
              <div style={{ color: "var(--text-2)" }}>Chọn một ngày để xem lịch trình.</div>
            ) : dayEvents.length === 0 ? (
              <div style={{ color: "var(--text-2)" }}>Không có lịch trình trong ngày này.</div>
            ) : (
              dayEvents.map((ev, idx) => (
                <div
                  key={ev.id ?? idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEventDetail(ev)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openEventDetail(ev);
                  }}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: ".5rem",
                    margin: ".4rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: ".5rem",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  title="Click để xem chi tiết"
                >
                  <div>
                    <strong>{ev.title}</strong>
                    <div style={{ color: "var(--text-2)", fontSize: ".9rem", marginTop: "0.25rem" }}>
                      {formatTime(ev.publish_time)}
                    </div>
                  </div>

                  <span className={`event ${channelClass(ev.channel)}`} style={{ padding: ".2rem .5rem" }}>
                    {String(ev.channel || "").toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {detailOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeDetail}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(860px, 96vw)",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,.18)",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "var(--text-2)" }}>Chi tiết lịch trình</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, wordBreak: "break-word" }}>
                  {selectedEvent?.title || ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => openEdit(selectedEvent)}>
                  Sửa
                </button>
                <button className="btn" onClick={() => handleDeleteSchedule(selectedEvent?.id)}>
                  Xóa
                </button>
                <button className="btn" onClick={closeDetail}>
                  Đóng
                </button>
              </div>
            </div>

            <div style={{ padding: "14px 16px" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-2)" }}>Thời gian</div>
                    <div style={{ fontWeight: 700 }}>{formatDateTime(selectedEvent?.publish_time)}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-2)" }}>Kênh</div>
                    <span className={`event ${channelClass(selectedEvent?.channel)}`} style={{ padding: ".2rem .5rem" }}>
                      {String(selectedEvent?.channel || "").toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-2)" }}>Post ID</div>
                    <div style={{ fontWeight: 700 }}>{selectedEvent?.post_id ?? "-"}</div>
                  </div>
                </div>

                {!!selectedEvent?.note && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 13, color: "var(--text-2)" }}>Ghi chú</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{selectedEvent.note}</div>
                  </div>
                )}
              </div>

              <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>Chi tiết bài viết</div>
                  {detailLoading && <div style={{ fontSize: 13, color: "var(--text-2)" }}>Đang tải...</div>}
                </div>

                {!selectedEvent?.post_id ? (
                  <div style={{ marginTop: 8, color: "var(--text-2)" }}>Lịch này không liên kết bài viết.</div>
                ) : !detailLoading && !selectedPostDetail ? (
                  <div style={{ marginTop: 8, color: "var(--text-2)" }}>
                    Không lấy được chi tiết bài viết (không tìm thấy trong /posts/me).
                  </div>
                ) : selectedPostDetail ? (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 13, color: "var(--text-2)" }}>Tiêu đề</div>
                    <div style={{ fontWeight: 800, marginBottom: 8, wordBreak: "break-word" }}>
                      {selectedPostDetail.title}
                    </div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>Trạng thái</div>
                        <div style={{ fontWeight: 700 }}>{selectedPostDetail.status}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>Tag</div>
                        <div style={{ fontWeight: 700, whiteSpace: "pre-wrap" }}>{selectedPostDetail.tag || "-"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>Published at</div>
                        <div style={{ fontWeight: 700 }}>
                          {selectedPostDetail.published_at ? formatDateTime(selectedPostDetail.published_at) : "-"}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: "var(--text-2)" }}>Nội dung</div>
                    <div
                      style={{
                        marginTop: 6,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.55,
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: 10,
                        background: "#fafafa",
                      }}
                    >
                      {selectedPostDetail.body || "(Không có nội dung)"}
                    </div>

                    {(selectedPostDetail.image_url || selectedPostDetail.imageBase64) && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>Ảnh</div>
                        <img
                          alt="post"
                          src={selectedPostDetail.imageBase64 || selectedPostDetail.image_url}
                          style={{ width: "100%", maxHeight: 360, objectFit: "contain", marginTop: 6 }}
                        />
                      </div>
                    )}

                    {(selectedPostDetail.video_url || selectedPostDetail.videoBase64) && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>Video</div>
                        <video
                          controls
                          src={selectedPostDetail.videoBase64 || selectedPostDetail.video_url}
                          style={{ width: "100%", maxHeight: 420, marginTop: 6 }}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeEdit}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(640px, 96vw)",
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,.18)",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800 }}>Sửa lịch trình</div>
              <button className="btn" onClick={closeEdit}>
                Đóng
              </button>
            </div>

            <div style={{ padding: "14px 16px" }}>
              <div className="form-row">
                <label>Tiêu đề</label>
                <input
                  className="input"
                  value={editData.title}
                  onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <label>Thời gian xuất bản</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={editData.datetime}
                  onChange={(e) => setEditData((p) => ({ ...p, datetime: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <label>Ghi chú</label>
                <textarea
                  className="input"
                  rows={3}
                  value={editData.note}
                  onChange={(e) => setEditData((p) => ({ ...p, note: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <label>Chọn bài viết (draft)</label>
                <select
                  className="input"
                  value={editData.post_id}
                  onChange={(e) => setEditData((p) => ({ ...p, post_id: e.target.value }))}
                >
                  <option value="">-- Bỏ liên kết bài viết --</option>
                  {draftPosts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title} — {formatPostPublishedAt(post.published_at)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button className="btn" onClick={() => handleDeleteSchedule(editData.id)} disabled={editLoading}>
                  Xóa
                </button>
                <button className="btn primary" onClick={handleUpdateSchedule} disabled={editLoading}>
                  {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
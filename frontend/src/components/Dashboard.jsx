// src/components/Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import "../styles.css";

const API_URL = "http://localhost:5000/api";

export default function Dashboard({ navigate }) {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [todaySchedules, setTodaySchedules] = useState([]);
  const [activities, setActivities] = useState([]);

  const [postsLast6Months, setPostsLast6Months] = useState([]);
  const [tagDistribution, setTagDistribution] = useState([]);
  const [schedulesThisMonth, setSchedulesThisMonth] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadingStats(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();

        if (cancelled) return;

        setStats(data.kpi || null);
        setTodaySchedules(Array.isArray(data.todaySchedules) ? data.todaySchedules : []);
        setActivities(Array.isArray(data.recentActivities) ? data.recentActivities : []);
        setPostsLast6Months(Array.isArray(data.postsLast6Months) ? data.postsLast6Months : []);
        setTagDistribution(Array.isArray(data.tagDistribution) ? data.tagDistribution : []);
        setSchedulesThisMonth(Array.isArray(data.schedulesThisMonth) ? data.schedulesThisMonth : []);
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = () => navigate("/editor");
  const handleUser = () => navigate("/profile");

  const maxPostCount = useMemo(() => {
    return Math.max(1, ...postsLast6Months.map((x) => Number(x.count) || 0));
  }, [postsLast6Months]);

  const maxTagCount = useMemo(() => {
    return Math.max(1, ...tagDistribution.map((x) => Number(x.count) || 0));
  }, [tagDistribution]);

  const scheduleByDay = useMemo(() => {
    const m = new Map();
    for (const s of schedulesThisMonth) {
      const d = new Date(s.publish_time);
      if (Number.isNaN(d.getTime())) continue;
      const key = d.toISOString().slice(0, 10);
      m.set(key, (m.get(key) || 0) + 1);
    }
    return m;
  }, [schedulesThisMonth]);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const miniDays = useMemo(() => {
    const arr = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const key = d.toISOString().slice(0, 10);
      arr.push({
        day,
        key,
        count: scheduleByDay.get(key) || 0,
        isToday: day === now.getDate(),
      });
    }
    return arr;
  }, [daysInMonth, month, year, now, scheduleByDay]);

  return (
    <div className="app dashboard-page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">☕</div>
          <span><strong>Café Media Portal</strong></span>
        </div>

        <nav className="nav">
          <a href="/dashboard" className="nav-link active" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            📊 <span>Dashboard</span>
          </a>
          <a className="nav-link" href="/editor" onClick={(e) => { e.preventDefault(); navigate("/editor"); }}>
            📝 <span>Nội dung</span>
          </a>
          <a href="/schedule" className="nav-link" onClick={(e) => { e.preventDefault(); navigate("/schedule"); }}>
            📅 <span>Lịch xuất bản</span>
          </a>
          <a className="nav-link" href="/campaign" onClick={(e) => { e.preventDefault(); navigate("/campaign"); }}>
            📢 <span>Chiến dịch</span>
          </a>
          <a className="nav-link" href="/seo" onClick={(e) => { e.preventDefault(); navigate("/seo"); }}>
            ⚙️ <span>SEO & Hiệu năng</span>
          </a>
          <a className="nav-link" href="/profile" onClick={(e) => { e.preventDefault(); navigate("/profile"); }}>
            👤 <span>Người dùng</span>
          </a>
        </nav>

        <div className="spacer" />
        <div className="user"><div className="meta"></div></div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-inner" style={{ position: "relative" }}>
            <button className="btn-primary" id="btn-create" onClick={handleCreate}>+ Tạo mới</button>
            <button className="icon-btn" aria-label="Tài khoản" id="btn-user" type="button" onClick={handleUser}>👤</button>
          </div>
        </div>

        <div className="content" aria-labelledby="h-dashboard">
          <h1 id="h-dashboard" style={{ margin: ".25rem 0 0 0", fontSize: 24 }}>Tổng quan</h1>

          <section className="kpi-grid" aria-label="Chỉ số chính">
            {loadingStats || !stats ? (
              <>
                <article className="card kpi kpi-skeleton" />
                <article className="card kpi kpi-skeleton" />
                <article className="card kpi kpi-skeleton" />
                <article className="card kpi kpi-skeleton" />
              </>
            ) : (
              <>
                <article className="card kpi">
                  <div className="kpi-icon" style={{ background: "var(--teal-600)" }}>📰</div>
                  <div>
                    <div className="title">Bài viết xuất bản</div>
                    <div className="value">{stats.publishedPosts}</div>
                  </div>
                </article>

                <article className="card kpi">
                  <div className="kpi-icon" style={{ background: "var(--amber-500)" }}>👥</div>
                  <div>
                    <div className="title">Tổng số người dùng</div>
                    <div className="value">{stats.totalUsers}</div>
                  </div>
                </article>

                <article className="card kpi">
                  <div className="kpi-icon" style={{ background: "var(--blue-500)" }}>🆕</div>
                  <div>
                    <div className="title">Người dùng mới (tháng này)</div>
                    <div className="value">{stats.newUsersThisMonth}</div>
                  </div>
                </article>

                <article className="card kpi">
                  <div className="kpi-icon" style={{ background: "var(--green-500)" }}>📅</div>
                  <div>
                    <div className="title">Sự kiện hôm nay</div>
                    <div className="value">{todaySchedules.length}</div>
                  </div>
                </article>
              </>
            )}
          </section>

          {/* Middle: Charts */}
          <section className="middle" aria-label="Phân tích">
            {/* Chart 1: Posts 6 months */}
            <article className="card">
              <h3 style={{ margin: "0 0 1rem 0" }}>Số bài viết (6 tháng gần đây)</h3>

              {postsLast6Months.length === 0 ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-2)" }}>
                  Không có dữ liệu
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {postsLast6Months.map((m) => {
                    const c = Number(m.count) || 0;
                    const pct = Math.round((c / maxPostCount) * 100);
                    return (
                      <div key={m.month} style={{ display: "grid", gridTemplateColumns: "80px 1fr 50px", gap: 10, alignItems: "center" }}>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>{m.month}</div>
                        <div style={{ height: 10, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "var(--blue-500)" }} />
                        </div>
                        <div style={{ textAlign: "right", fontWeight: 700 }}>{c}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>

            {/* Chart 2: Tag distribution */}
            <article className="card">
              <h3 style={{ margin: "0 0 1rem 0" }}>Phân bố nội dung theo Tag</h3>

              {tagDistribution.length === 0 ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-2)" }}>
                  Không có dữ liệu tag
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {tagDistribution.map((t) => {
                    const c = Number(t.count) || 0;
                    const pct = Math.round((c / maxTagCount) * 100);
                    return (
                      <div key={t.tag} style={{ display: "grid", gridTemplateColumns: "120px 1fr 50px", gap: 10, alignItems: "center" }}>
                        <div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.tag}</div>
                        <div style={{ height: 10, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "var(--teal-600)" }} />
                        </div>
                        <div style={{ textAlign: "right", fontWeight: 700 }}>{c}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          </section>

          {/* Bottom: Schedule & Events */}
          <section className="bottom" aria-label="Lịch xuất bản & sự kiện">
            <article className="card calendar">
              <h3 style={{ margin: "0 0 1rem 0" }}>Lịch xuất bản (tháng này)</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 8,
                }}
              >
                {miniDays.map((d) => (
                  <div
                    key={d.key}
                    title={d.count ? `${d.count} lịch` : "Không có lịch"}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: 10,
                      background: d.isToday ? "rgba(59,130,246,.10)" : "#fff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: 42,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{d.day}</div>
                    {d.count > 0 && (
                      <div
                        style={{
                          minWidth: 22,
                          height: 22,
                          borderRadius: 999,
                          background: "var(--blue-500)",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {d.count}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, color: "var(--text-2)", fontSize: 13 }}>
                Để xem chi tiết: Vào trang “Lịch xuất bản”.
              </div>
            </article>

            <aside className="events">
              <div className="card" style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 .5rem 0" }}>Sự kiện hôm nay</h3>

                {todaySchedules.length === 0 ? (
                  <div className="event">Không có sự kiện hôm nay</div>
                ) : (
                  todaySchedules.map((ev) => {
                    const d = new Date(ev.publish_time);
                    const hh = String(d.getHours()).padStart(2, "0");
                    const mm = String(d.getMinutes()).padStart(2, "0");
                    return (
                      <div className="event" key={ev.id}>
                        <div>📌</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{ev.title}</div>
                          <div className="time">{hh}:{mm} ({String(ev.channel || "").toUpperCase()})</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="card" style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 .5rem 0" }}>Hoạt động gần đây</h3>
                <div className="activity">
                  {activities.length === 0 ? (
                    <div className="activity-item">Không có dữ liệu</div>
                  ) : (
                    activities.map((ac, idx) => (
                      <div className="activity-item" key={idx}>
                        {ac.type === "schedule" ? "📅" : "📝"} <span>{ac.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}